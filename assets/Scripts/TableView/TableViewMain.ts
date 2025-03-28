import TableView from "./TableView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export abstract class TableViewMain extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    scrollView: cc.Node = null;

    protected start(): void {
        this.scrollView.getComponent(TableView).init([
            { name: '1' },
        ])

        //this.scrollView.getComponent(TableView).scrollToTop();
    }

    onClickAdd() {
        this.scrollView.getComponent(TableView).reloadData([
            { name: '1' },
            { name: '2' },
        ])
    }

    onClickRemove() {
        this.scrollView.getComponent(TableView).reloadData([
            { name: '2' },
        ])
    }

    onClickRefresh() {
        this.scrollView.getComponent(TableView).reloadData([                      
            { name: '9' },    
        ])
    }

    onClickClear() {
        this.scrollView.getComponent(TableView).reloadData([])
    }

}