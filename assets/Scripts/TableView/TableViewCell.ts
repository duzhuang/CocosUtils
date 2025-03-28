const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("TableView/TableViewCell")
export abstract class TableViewCell extends cc.Component {
    abstract updateView(index: number, data?: any): void;
    abstract resuse(): void;
    abstract unuse(): void;
}