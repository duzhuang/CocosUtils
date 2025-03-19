import LabelProxyManager from "../../Tools/LabelProxyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabAvatar extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    lblName: cc.Node = null;

    @property({ type: cc.Node, tooltip: '' })
    sprIcon: cc.Node = null;

    @property({ type: cc.SpriteFrame, tooltip: '' })
    sprIconList: cc.SpriteFrame[] = [];

    private m_labelProxyManager: LabelProxyManager = null;

    private m_proxyNode: cc.Node = null;

    start() {

    }

    public setAvatar(index: number, name: string) {
        this.setIcon(index);
        this.setName(name);
    }

    public setIcon(index: number) {
        this.sprIcon.getComponent(cc.Sprite).spriteFrame = this.sprIconList[index];
    }

    public setName(name: string) {
        this.lblName.getComponent(cc.Label).string = name;
        this.lblName.active = false;
        this.m_labelProxyManager = this.node.parent.parent.getComponent(LabelProxyManager);
        this.m_proxyNode = this.m_labelProxyManager.registerLabel(this.lblName);
    }

    protected onDestroy(): void {
        this.m_labelProxyManager.unregisterLabel(this.m_proxyNode);
    }
}
