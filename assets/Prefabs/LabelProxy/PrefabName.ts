
const { ccclass, property } = cc._decorator;
@ccclass
export default class PrefabName extends cc.Component {   

	@property({ type: cc.Label, tooltip: '' })
 	lbl_name: cc.Label = null;


    protected onLoad(): void {
        
    }

    protected start(): void {
        
    }

    protected onDestroy(): void {
    
    }
}