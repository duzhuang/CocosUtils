# 提示. 添加执行权限（首次执行需要）
#chmod +x mkInstance.sh

#!/bin/bash

source mkInstancePath.sh

set -e #遇到错误退出

echo "输入要新建单例类的名字："

read className

className="${className}"

cat << EOF > "${className}.ts"
export default class ${className} {
    private static _instance: ${className};
    public static get instance(): ${className} {
        if (!this._instance) {
            this._instance = new ${className}();
        }
        return this._instance;
    }

    public destory() {
        ${className}._instance = null!;
    }
}

EOF


echo "创建 ${className}.ts 文件成功"

