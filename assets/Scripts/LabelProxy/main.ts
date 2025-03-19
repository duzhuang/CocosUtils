import PrefabAvatar from "./PrefabAvatar";
import PrefabName from "./PrefabName";

const { ccclass, property } = cc._decorator;

@ccclass
export default class main extends cc.Component {

    @property({ type: cc.Prefab, tooltip: '' })
    prefabName: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '' })
    prefabAvatar: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    nodeParent: cc.Node = null;

    private m_avatarCount: number = 100;


    private m_charList: string = "abcdefghijklmnopqrstuvwxyz";

    start() {
        this.spawnPrefabName();
        this.spawnPrefabAvatar();       
    }

    private spawnPrefabName() {
        for (let i = 0; i < 10; i++) {
            let node = cc.instantiate(this.prefabName);
            node.setPosition(this.getRandomPos());
            node.parent = this.nodeParent;
            let playerName = this.getRandomChar();
            node.getComponent(PrefabName).setName(playerName);
        }
    }

    private spawnPrefabAvatar() {
        for (let i = 0; i < this.m_avatarCount; i++) {
            let node = cc.instantiate(this.prefabAvatar);
            node.setPosition(this.getRandomPos());
            node.parent = this.nodeParent;
            const playerName = this.getRandomChar();
            node.getComponent(PrefabAvatar).setAvatar(i % 7, playerName);
        }
    }

    private getRandomChar(): string {
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += this.m_charList[Math.floor(Math.random() * this.m_charList.length)];
        }
        return result;
    }

    private getRandomPos(): cc.Vec3 {
        let result = cc.Vec3.ZERO;
        result.x = (Math.random() * cc.winSize.width / 2) * (Math.random() < 0.5 ? -1 : 1);
        result.y = (Math.random() * cc.winSize.height / 2) * (Math.random() < 0.5 ? -1 : 1);
        return result;
    }
}
