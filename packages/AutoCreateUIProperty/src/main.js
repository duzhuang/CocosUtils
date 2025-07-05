'use strict';

const fs = require('fs');

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        "custom-right-click:processAutoCreateUIProperty"() {
            const selectedAsset = Editor.Selection.curSelection("asset");
            if (selectedAsset && selectedAsset.length === 0) {
                Editor.log("没有选中任何资源");
                return;
            }

            const selectedAssetUUID = selectedAsset[0];
            const assetInfo = Editor.assetdb.assetInfoByUuid(selectedAssetUUID);

            if (!assetInfo) {
                Editor.log("无法找到资源信息");
                return;
            }

            if (assetInfo.type !== "prefab") {
                Editor.log("选中的资源不是预制体");
                return;
            }

            Editor.log("资源路径", assetInfo);

            const prefabContent = fs.readFileSync(assetInfo.path, 'utf8');            
            const prefabJson = JSON.parse(prefabContent);
            const data = this.parsePrefab(prefabJson);            
            const scriptName = this.getPrefabName(prefabJson);
            Editor.log("脚本名称", scriptName);
            const scriptPath = this.getPrefabPath(assetInfo);
            Editor.log("脚本url", scriptPath);
            const scriptStr = this.getScriptStr(scriptName, data);

            Editor.assetdb.create(`${scriptPath}${scriptName}.ts`, scriptStr, (err, result) => {
                if (err) {
                    Editor.log("创建脚本失败", err);
                }
                Editor.log("创建脚本成功");
            })
        }
    },



    /**
   * 获取脚本数据
   * @param {*} scriptName
   * @param {*} data
   * @returns {string} 脚本数据
   */
    getScriptStr(scriptName, data) {
        return `
const { ccclass, property } = cc._decorator;
@ccclass
export default class ${scriptName} extends cc.Component {   

${data.join("\n")}

    protected onLoad(): void {
        
    }

    protected start(): void {
        
    }

    protected onDestroy(): void {
    
    }
}`
    },

    /**
     * 获取预制体名称
     * @param {*} prefabJson
     * @returns {string} 预制体名称
     */
    getPrefabName(prefabJson) {
        let prefabName = "";
        for (const data of prefabJson) {
            if (data.__type__ !== "cc.Node") {
                continue;
            }
            if (data._parent === null) {
                prefabName = data._name;
                break;
            }
        }
        return prefabName
    },

    /**
     * 获取预制体路径
     * @param {*} prefabJson
     * @returns {string} 预制体路径
     */
    getPrefabPath(assetInfo) {
        const pathList = assetInfo.url.split("/");
        pathList.pop(); // 移除文件名
        return pathList.join("/") + "/";
    },

    /**
     * 解析预制体
     * @param {*} prefabJson
     * @returns {string[]} 解析结果
     */
    parsePrefab(prefabJson) {
        let result = [];

        for (const data of prefabJson) {
            if (data.__type__ !== "cc.Node") {
                continue;
            }

            const nameList = data._name.split("_");
            if (nameList.length < 2) {
                continue;
            }

            if (nameList[0] === "btn") {
                result.push(
                    `\t@property({ type: cc.Button, tooltip: '' })\n \t${data._name}: cc.Button = null;\n`
                );
            }

            if (nameList[0] === "lbl") {
                result.push(
                    `\t@property({ type: cc.Label, tooltip: '' })\n \t${data._name}: cc.Label = null;\n`
                );
            }
        }

        return result;
    }
};