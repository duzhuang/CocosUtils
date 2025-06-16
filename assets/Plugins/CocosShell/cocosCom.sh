# 提示. 添加执行权限（首次执行需要）
#chmod +x cocosCom.sh

#!/bin/bash

set -e #遇到错误退出

echo "输入要新建组件的名字："

read comName
#组件名字
comName="${comName}"
#组件路径
read -p "输入要新建组件的路径：" path

path="${path}"

#创建活动文件夹
if [ ! -d "${path}" ]; then
    mkdir -p "${path}"
fi

cat << EOF > "${path}/${comName}.ts"

const { ccclass, property } = cc._decorator;

@ccclass
export default class ${comName} extends cc.Component {
    protected onLoad(): void {
        this.registerEvent();
    }

    protected onDestroy(): void {
        this.unregisterEvent();
    }

    protected start(): void {
        
    }

    private registerEvent(): void {
        
    }

    private unregisterEvent(): void {
        
    }
}

EOF

echo "创建 ${comName}.ts 文件成功"