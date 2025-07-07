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

        const typeMap = {
            /**节点组件 */
            node: 'Node',          
           

            /**渲染组件 */
            dragonBones: 'DragonBones',            
            lbl: 'Label',
            lblOut: 'LabelOutline',
            lblSha: 'LabelShadow',
            light: 'Light',
            particle: 'ParticleSystem',
            rich: 'RichText',
            graphice: 'Graphics',
            mask: 'Mask',
            tiledMap: 'TiledMap',
            tiledTile: 'TiledTile',
            spineSk: 'Skeleton',   
            spr: 'Sprite', 
            tiledMap: 'TiledMap',
            tiledTile: 'TiledTile',          

            /**UI 组件 */
            blockInput: 'BlockInputEvents',      
            btn: 'Button',
            canvas: 'Canvas',
            edit: "EditBox",
            layout: 'Layout',
            proBar: 'ProgressBar',
            sageArea: 'SafeArea',
            scrollBar: 'Scrollbar',
            scro: 'ScrollView',        
            toggle: 'Toggle',
            toggleCon: 'ToggleContainer',            
            slider: 'Slider',                                      
            videoPlayer: 'VideoPlayer',
            webView: 'WebView',
            widget: 'Widget',

            /**碰撞组件 */
            boxCo: 'BoxCollider',
            circleCo: 'CircleCollider',
            polygonCo: 'PolygonCollider',            

            /**物理组件 */
            rigidBody: 'RigidBody',
            phyBoxCo: "PhysicsBoxCollider",
            phyCircleCo: "PhysicsCircleCollider",
            phyPolygonCo: "PhysicsPolygonCollider",
            phyChainCo_2: "PhysicsChainCollider",
           
            /**其它组件 */                
            animation: 'Animation',
            audioSource: 'AudioSource',
            camera: 'Camera',
            motionStreak: 'MotionStreak'                               
        };

        for (const data of prefabJson) {

            if (!data._name || data._name === "") {
                continue;
            }

            const nameList = data._name.split("_");

            if (nameList.length < 2) {
                continue;
            }

            const prefix = nameList[0];
            const componentType = typeMap[prefix];
            if (componentType) {
                //如果是 spine 组件 特殊处理
                if (prefix === "spineSk") {
                    result.push(
                        `\t@property({ type: sp.Skeleton, tooltip: '' })\n \t${data._name}: sp.Skeleton = null;\n`
                    );
                } else {
                    result.push(
                        `\t@property({ type: cc.${componentType}, tooltip: '' })\n \t${data._name}: cc.${componentType} = null;\n`
                    );
                }                
            }

        }

        return result;
    }
};