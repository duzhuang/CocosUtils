'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // // 脚本创建时的处理
    // async createScript(scriptPath, className) {

    //     // 读取模板内容
    //     const templatePath = path.join(__dirname, 'src/custom-template.ts');
    //     let content = fs.readFileSync(templatePath, 'utf-8');

    //     // 替换占位符
    //     content = content.replace(/{{ClassName}}/g, className);
    //     // 写入文件
    //     fs.writeFileSync(scriptPath, content, 'utf-8');
    // },

    messages: {
        "custom-right-click:processCustomScriptTemplete"() {
            Editor.log("processCustomScriptTemplete");
        }
    }
};