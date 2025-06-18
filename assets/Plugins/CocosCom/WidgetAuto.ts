const { ccclass, menu, executeInEditMode, requireComponent } = cc._decorator;

/**
 * 自动设置 widget 的属性
 * 1. isAlignTop = true
 * 2. isAlignBottom = true
 * 3. isAlignLeft = true
 * 4. isAlignRight = true
 * 5. top = 0
 * 6. bottom = 0
 * 7. left = 0
 * 8. right = 0
 */
@ccclass
@menu("Plugin/CocosCom/WidgetAuto")
@executeInEditMode
@requireComponent(cc.Widget)
export default class WidgetAuto extends cc.Component {
    protected start(): void {
        const widgetCom = this.getComponent(cc.Widget);
        widgetCom.isAlignTop = true;
        widgetCom.isAlignBottom = true;
        widgetCom.isAlignLeft = true;
        widgetCom.isAlignRight = true;
        widgetCom.top = 0;
        widgetCom.bottom = 0;
        widgetCom.left = 0;
        widgetCom.right = 0;
    }
}