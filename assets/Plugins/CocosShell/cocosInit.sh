# 提示. 添加执行权限（首次执行需要）
#chmod +x cocosInit.sh

#!/bin/bash

set -e #遇到错误退出

echo "输入活动的名字："
read activityName
#活动名字
activityName="${activityName}"

echo "输入活动的路径："
read activityPath
#活动路径
path="${activityPath}/${activityName}"
#创建活动文件夹
if [ ! -d "${path}" ]; then
    mkdir -p "${path}"
fi

mkdir -p "${path}/Prefabs"
mkdir -p "${path}/Sprites"
mkdir -p "${path}/Scripts"
mkdir -p "${path}/Textures"

#生成配置类

DataBasePath="${path}/Scripts/DataCenter"

mkdir -p "${DataBasePath}"

cat << EOF > "${DataBasePath}/${activityName}Config.ts"
export namespace ${activityName}Config {
    //CMD
    export namespace CMD {
        
    }

    //事件
    export namespace Event {
        
    }
}

EOF

echo "创建 ${activityName}Config.ts 文件成功"

#生成数据中心类
cat << EOF > "${DataBasePath}/${activityName}DataCenter.ts"
export default class ${activityName}DataCenter {
    private static _instance:${activityName}DataCenter;
    public static get instance(): ${activityName}DataCenter {
        if (!this._instance) {
            this._instance = new ${activityName}DataCenter();
        } 
        return this._instance;
    }

    public destory() {
       ${activityName}DataCenter._instance = null!;
    }
}

EOF

echo "创建 ${activityName}DataCenter.ts 文件成功"

#生成数据分发类
cat << EOF > "${DataBasePath}/${activityName}DataDispatcher.ts"
export namespace ${activityName}DataDispatcher {
    export function dispatchEvent(data: any):void {
        if(!data || !data.cmd) {
            return;
        }
        switch (data.cmd) {          
            default:
                break;
        }        
    }
}

EOF
echo "创建 ${activityName}DataDispatcher.ts 文件成功"


#生成数据模型类
cat << EOF > "${DataBasePath}/${activityName}DataModel.ts"
export namespace ${activityName}DataModel {
    
}

EOF
echo "创建 ${activityName}DataModel.ts 文件成功"

