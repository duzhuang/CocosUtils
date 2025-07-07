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


    messages: {
        "custom-right-click:processCustomScriptTemplete"() {                      

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

            Editor.log("资源信息", assetInfo);

            Editor.assetdb.queryUuidByUrl(assetInfo.url, (error, uuid) => {
                if (error) {
                    Editor.log("获取资源 UUID 失败:", error);
                    return;
                }

                Editor.log("资源 UUID:", uuid);

                Editor.Ipc.sendToAll('scene:enter-prefab-edit-mode', uuid);
            });
        }
    }
};