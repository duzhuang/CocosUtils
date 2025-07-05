'use strict';
var fs = require('fs');

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        "custom-right-click:processGetSelectedPrefab"() {
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

            Editor.log("资源数据", prefabJson);

            // const data = this.parsePrefab(prefabJson);

            // Editor.log("解析结果", data);
        }
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
                    `                   
    @property({ type: cc.Button, tooltip: '' })\n \t${data._name}: cc.Button = null;`
                );
            }

            if (nameList[0] === "lbl") {
                result.push(
                    `
    @property({ type: cc.Label, tooltip: '' })\n \t${data._name}: cc.Label = null;`
                );
            }
        }

        return result;
    }
};