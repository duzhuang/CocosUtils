import TableView from "./TableView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export abstract class TableViewMain extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    scrollView: cc.Node = null;

    protected start(): void {
        this.scrollView.getComponent(TableView).init([
            { name: '1' },
            { name: '2' },
            { name: '3' },   
            { name: '4' },  
            { name: '5' },     
            { name: '6' },
            { name: '7' },
            { name: '8' },
            { name: '9' },
            { name: '10' },
            { name: '11' },
            { name: '12' },
            { name: '13' },
            { name: '14' },
            { name: '15' },
            { name: '16' },
            { name: '17' },
        ])                       
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