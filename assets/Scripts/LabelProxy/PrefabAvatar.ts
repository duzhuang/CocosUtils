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

    private m_sign: number = 0;

    start() {

    }

    protected update(dt: number): void {
        this.node.position = this.getRandomPos();
        this.m_labelProxyManager.refreshLabel(this.lblName, this.m_proxyNode);

        if(Math.floor(Math.random() * 1000)  === this.m_sign) {            
            this.m_labelProxyManager.unregisterLabel(this.m_proxyNode);
            this.node.destroy();
        }
    }

    private getRandomPos(): cc.Vec3 {
        let result = cc.Vec3.ZERO;
        result.x = (Math.random() * cc.winSize.width / 2) * (Math.random() < 0.5 ? -1 : 1);
        result.y = (Math.random() * cc.winSize.height / 2) * (Math.random() < 0.5 ? -1 : 1);
        return result;
    }

    public setAvatar(index: number, name: string) {
        this.m_sign = index;
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
