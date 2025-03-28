import ScrollViewPlus from "./ScrollViewPlus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewCell extends cc.Component {
    static getSize(index: number, data?: any): number {
        return 0;
    }

    init(index: number, data?: any, tv?: ScrollViewPlus) {

    }

    unInit() {

    }

    reload(data?: any) {

    }
}
