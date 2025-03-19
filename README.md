# 简介

一个 cocos creator 工具的仓库

## LabelProxy

### 简介

将 cocos 不同预制体下的 Label 进行分批渲染，降低 DrawCall

### 特性

- 抽离 cocos 中不同层级中的 Label 组件
- Label 组件单独渲染，拒绝 Label 打断合批
