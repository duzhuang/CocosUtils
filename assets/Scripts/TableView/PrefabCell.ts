import { TableViewCell } from "./TableViewCell";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class PrefabCell extends TableViewCell {

    @property({ type: cc.Label, tooltip: '' })
    lblName: cc.Label = null;

    updateView(index: number, data?: any): void {
        if (data) {
            this.lblName.string = data.name;
        }
    }
    resuse(): void {
        console.log("resuse")
    }
    unuse(): void {
        console.log("unuse")
    }

}