export default class GameSoundCache {
    private static _instance: GameSoundCache;
    public static get instance(): GameSoundCache {
        if (!this._instance) {
            this._instance = new GameSoundCache();
        }
        return this._instance;
    }

    public destory() {
        this.m_soundMap.clear();
        GameSoundCache._instance = null!;
    }

    private m_soundMap: Map<string, cc.AudioClip> = new Map();

    /**
     * 获取路径的音频
     * @param path 路径
     * @param callBack 获取到音频的回调， clip 为 null 表示获取失败
     */
    public getAudioClip(path: string, callBack?: (audioClip: cc.AudioClip) => void) {
        if (this.m_soundMap.has(path)) {
            const clip = this.m_soundMap.get(path);
            callBack && callBack(clip);
            return;
        }


        cc.loader.loadRes(path, cc.AudioClip, (err, audioClip) => {
            if (err) {
                console.error(err);
                return;
            }
            this.m_soundMap.set(path, audioClip);
            callBack && callBack(audioClip);
        })
    }

    /**
     * 清除缓存
     */
    public clear() {
        this.m_soundMap.clear();
    }
}

