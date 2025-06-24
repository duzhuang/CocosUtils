const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

var FILE_TYPES = new Map();


// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function filterFileType(dirPath) {
    const files = await readdir(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStat = await stat(filePath);


        if (fileStat.isDirectory()) {
            // 递归处理子目录
            await filterFileType(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!FILE_TYPES.has(ext)) {
                let result = [];
                result.push({
                    path: filePath,
                    size: fileStat.size,
                    formattedSize: formatFileSize(fileStat.size),
                    extension: ext.toUpperCase().replace('.', '')
                })

                FILE_TYPES.set(ext, result);
            }
            else {
                let result = FILE_TYPES.get(ext);
                result.push({
                    path: filePath,
                    size: fileStat.size,
                    formattedSize: formatFileSize(fileStat.size),
                    extension: ext.toUpperCase().replace('.', '')
                })
            }
        }
    }
}

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
        await filterFileType(targetDir);
        const endTime = Date.now();

        if (FILE_TYPES.size === 0) {
            console.log('未找到任何图片文件');
            return;
        }

        const totalFiles = Array.from(FILE_TYPES.values()).reduce((total, files) => total + files.length, 0);
        const totalBytes = Array.from(FILE_TYPES.values()).reduce((total, files) => total + files.reduce((sum, file) => sum + file.size, 0), 0);
               
        console.log('文件详情:');  
        console.log(`扫描耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);
        console.log(`总文件数: ${totalFiles}`);
        console.log(`总大小: ${formatFileSize(totalBytes)}`);
        console.log("\n");

        FILE_TYPES.forEach((value, key) => {            
            console.log('*'.repeat(80));
            console.log('文件详情:');
            console.log(`文件类型: ${key}`);            
            console.log(`文件数量: ${value.length}`);
            console.log(`总大小: ${formatFileSize(value.reduce((total, file) => total + file.size, 0))}`);
            console.log('*'.repeat(80));  
            console.log("\n");          
        })

    } catch (error) {
        console.error(`无法访问目录: ${targetDir}`, error);
        process.exit(1);
    }
}

main();