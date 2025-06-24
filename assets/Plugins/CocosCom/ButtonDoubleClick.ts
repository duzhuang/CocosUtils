const { ccclass, menu, property } = cc._decorator;

/**
 * 按钮双击
 */
@ccclass
@menu("Plugin/CocosCom/ButtonDoubleClick")
export default class ButtonDoubleClick extends cc.Component {
    @property({ type: cc.Float, tooltip: "双击时间间隔" })
    doubleClickTime: number = 0.3;

    @property({ type: cc.Component.EventHandler, tooltip: '按钮响应事件' })
    doubleClickEvent: cc.Component.EventHandler[] = [];


    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    private m_lastClickTime: number = 0;
    private m_isDoubleClick: boolean = false;


    private onTouchEnded(event) {
        const now = Date.now();
        if (now - this.m_lastClickTime < this.doubleClickTime * 1000) {
            this.m_isDoubleClick = true;
            this.m_lastClickTime = null;
        } else {
            this.m_lastClickTime = now;
            this.m_isDoubleClick = false;
        }

        if (this.m_isDoubleClick) {
            for (const doubleEvent of this.doubleClickEvent) {
                doubleEvent.emit([event, doubleEvent.customEventData]);
            }
        }
    }
}