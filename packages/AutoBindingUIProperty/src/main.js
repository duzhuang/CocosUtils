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
        "custom-right-click:processAutoBindingUIProperty"() {
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

            const prefabContent = fs.readFileSync(assetInfo.path, 'utf8');

            const prefabJson = JSON.parse(prefabContent);

            const needBindProperty = this.getNeedBindProperty(prefabJson);

            const componentProperty = this.vaildAddedCustomScript(prefabJson);

            this.bindProperty(needBindProperty, prefabJson, componentProperty);

            Editor.assetdb.saveExists(assetInfo.url, JSON.stringify(prefabJson), (err, result) => {
                if (err) {
                    Editor.log("属性绑定失败", err);
                } else {
                    Editor.log("属性绑定成功");                   
                }
            })
        }
    },

    /**
     * 刷新属性
     */
    refreshInsperctor() {
        Editor.log("刷新属性");

        const selectedAsset = Editor.Selection.curSelection("node");
        if (selectedAsset && selectedAsset.length === 0) {
            Editor.log("没有选中任何资源");
            return;
        }

        if (selectedAsset.length > 0) {
            Editor.Selection.clear('node');
            Editor.log("开始", new Date().getTime());
            setTimeout(() => {
                Editor.log("完成", new Date().getTime());
                Editor.Selection.select('node', selectedAsset[0]);
            }, 1000);
        }
    },


    /**
     * 获取需要绑定的属性
     * @param {*} prefabJson
     * @returns {string[]} 需要绑定的属性
     * 
     */
    getNeedBindProperty(prefabJson) {
        let needBindPropertyList = [];

        //自定义脚本属性
        const componentProperty = this.vaildAddedCustomScript(prefabJson);

        //判断预制体是否已经添加了自定义脚本        
        if (componentProperty === null) {
            Editor.log("预制体没有添加了自定义脚本，无法自动绑定属性");
            return;
        }

        for (const key in componentProperty) {
            const propertyData = componentProperty[key];

            if (!this.isValidPropertyName(key)) {
                continue; // 跳过无效属性
            }

            if (propertyData === null) {
                needBindPropertyList.push(key);
            }
        }

        return needBindPropertyList;
    },

    /**
     * 校验是否已经添加了自定义脚本
     * @param {*} prefabJson 
     * @returns {boolean} 是否已经添加了自定义脚本
     */
    vaildAddedCustomScript(prefabJson) {
        let result = null;
        //如果添加组件，在prefabContent 数组的倒数第二个元素的__type__属性值不为 cc.PrefabInfo
        if (prefabJson[prefabJson.length - 2].__type__ !== "cc.PrefabInfo") {
            result = prefabJson[prefabJson.length - 2];
        }
        return result;
    },

    /**
     * 校验属性名称有效性
     * @param {string} name 属性名称
     * @returns {boolean} 是否有效（不以_开头）
     */
    isValidPropertyName(name) {
        return name && name[0] !== '_';
    },

    /**
     * 解码
     * @param {*} name 
     */
    decodePropertyName(name) {
        const nameList = name.split("_");
        if (nameList.length < 2) {
            return name;
        }

        if (nameList[0] === "btn") {
            return "cc.Button";
        }

        if (nameList[0] === "lbl") {
            return "cc.Label";
        }
    },

    /**
     *编码
     * @param {*} name
     */
    encodePropertyName(name) {

    },

    /**
     * 绑定属性
     * @param {*} needBindPropertyList 
     */
    bindProperty(needBindPropertyList, prefabJson, componentProperty) {

        for (let idx = 0; idx < needBindPropertyList.length; idx++) {
            const bindPropertyName = needBindPropertyList[idx];
            const bindPropertyType = this.decodePropertyName(bindPropertyName);

            for (let index = 0; index < prefabJson.length; index++) {
                const element = prefabJson[index];

                if (!element.__type__) {
                    continue;
                }
                if (element.__type__ !== bindPropertyType) {
                    continue;
                }

                //如果绑定节点，只需找到属性名和节点名相同即可绑定
                if (bindPropertyType === "cc.Node") {
                    if (element._name === bindPropertyName) {
                        //绑定节点
                        componentProperty[bindPropertyName] = { __id__: index };
                    }
                } else {
                    const targetNodeID = element.node.__id__;
                    const targetNode = prefabJson[targetNodeID];

                    if (targetNode._name === bindPropertyName) {
                        //绑定属性
                        componentProperty[bindPropertyName] = { __id__: index };
                    }
                }
            }
        }
    },

};