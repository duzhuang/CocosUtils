const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 支持的图片格式
const IMAGE_EXTENSIONS = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.bmp', '.tiff', '.svg', '.heic', '.heif'
]);

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 递归获取图片文件
async function getImageFiles(dirPath) {
    let results = [];

    try {
        const files = await readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const fileStat = await stat(filePath);

            if (fileStat.isDirectory()) {
                // 递归处理子目录
                const subResults = await getImageFiles(filePath);
                results = results.concat(subResults);
            } else {
                const ext = path.extname(file).toLowerCase();

                if (IMAGE_EXTENSIONS.has(ext)) {
                    results.push({
                        path: filePath,
                        size: fileStat.size,
                        formattedSize: formatFileSize(fileStat.size),
                        extension: ext.toUpperCase().replace('.', '')
                    });
                }
            }
        }
    } catch (error) {
        console.error(`无法访问目录: ${dirPath}`, error);
    }

    return results;
}

// 主函数
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('请提供要扫描的目录路径');
        console.log('示例: node imageStats.js /path/to/directory');
        process.exit(1);
    }

    const targetDir = path.resolve(args[0]);
    console.log(`开始扫描目录: ${targetDir}\n`);

    try {
        // 检查目录是否存在
        await stat(targetDir);

        const startTime = Date.now();
        const imageFiles = await getImageFiles(targetDir);
        const endTime = Date.now();

        if (imageFiles.length === 0) {
            console.log('未找到任何图片文件');
            return;
        }

        // 输出每个图片的详细信息
        console.log('='.repeat(80));
        console.log('图片文件详情:');
        console.log('='.repeat(80));

        imageFiles.sort((a, b) => a.size - b.size);

        imageFiles.forEach((file, index) => { 
            const pathIndex = file.path.indexOf("assets");
            const relativePath = file.path.substring(pathIndex);                                  
            console.log(`${index + 1}. ${relativePath}`);
            console.log(`大小: ${file.formattedSize.padEnd(12)} 格式: ${file.extension}`);
            console.log('\n' + '*'.repeat(80));
        });

        // 计算统计信息
        const totalFiles = imageFiles.length;
        const totalBytes = imageFiles.reduce((sum, file) => sum + file.size, 0);
        const avgSize = totalBytes / totalFiles;

        const sizeGroups = imageFiles.reduce((acc, file) => {
            if (file.size < 1024 * 100) acc.small++;
            else if (file.size < 1024 * 1024) acc.medium++;
            else if (file.size < 1024 * 1024 * 5) acc.large++;
            else acc.veryLarge++;
            return acc;
        }, { small: 0, medium: 0, large: 0, veryLarge: 0 });

        // 按格式统计
        const formatStats = imageFiles.reduce((acc, file) => {
            acc[file.extension] = (acc[file.extension] || 0) + 1;
            return acc;
        }, {});

        // 输出统计信息
        console.log('\n' + '='.repeat(80));
        console.log('统计摘要:');
        console.log('='.repeat(80));
        console.log(`扫描目录: ${targetDir}`);
        console.log(`总图片文件数: ${totalFiles}`);
        console.log(`总大小: ${formatFileSize(totalBytes)}`);
        console.log(`平均大小: ${formatFileSize(avgSize)}`);
        console.log(`扫描耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒\n`);

        console.log('文件大小分布:');
        console.log(`  < 100KB: ${sizeGroups.small} 文件`);
        console.log(`  100KB - 1MB: ${sizeGroups.medium} 文件`);
        console.log(`  1MB - 5MB: ${sizeGroups.large} 文件`);
        console.log(`  > 5MB: ${sizeGroups.veryLarge} 文件\n`);

        console.log('文件格式统计:');
        Object.entries(formatStats).forEach(([format, count]) => {
            console.log(`  ${format.padEnd(5)}: ${count.toString().padStart(4)} 文件`);
        });

    } catch (error) {
        console.error('发生错误:', error.message);
        process.exit(1);
    }
}

// 启动程序
main();