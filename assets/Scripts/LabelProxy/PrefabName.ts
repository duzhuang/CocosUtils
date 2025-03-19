const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabName extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    lblName: cc.Node = null;


    protected start(): void {

    }

    public setName(name: string) {
        this.lblName.getComponent(cc.Label).string = name;           
    }
}
