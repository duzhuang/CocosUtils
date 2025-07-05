
const { ccclass, property } = cc._decorator;
@ccclass
export default class prefabUIBinding extends cc.Component {   

	@property({ type: cc.Button, tooltip: '' })
 	btn_add: cc.Button = null;

	@property({ type: cc.Label, tooltip: '' })
 	lbl_result: cc.Label = null;


    protected onLoad(): void {
        
    }

    protected start(): void {
        
    }

    protected onDestroy(): void {
    
    }
}