/**
 * 音效和音乐的管理类
 */
export default class SoundController {
    private static _instance: SoundController;
    public static get instance(): SoundController {
        if (!this._instance) {
            this._instance = new SoundController();
        }
        return this._instance;
    }

    public destory() {
        SoundController._instance = null!;
    }

    /**停止音效 */
    private m_isEffectOn: boolean = false;

    constructor() {
        this.getMusicConfig();
        this.getEffectConfig();
    }

    /**
     * 获取本地的音乐配置
     * @returns true: 音乐开启 false: 音乐关闭
     */
    private getMusicConfig(): boolean {
        return this.getLocalConfig('isMusicOn');
    }

    /**
     * 获取本地的音效配置
     * @returns true: 音效开启 false: 音效关闭
     */
    private getEffectConfig(): boolean {
        return this.getLocalConfig('isEffectOn');
    }

    /**获取本地的配置 */
    private getLocalConfig(configName: string): boolean {
        let config = cc.sys.localStorage.getItem(configName);
        if (config == null) {
            cc.sys.localStorage.setItem(configName, 'true');
            return true;
        }
        return config == 'true';
    }

    /**
     * 设置本地的配置
     * @param configName 配置名称
     * @param value true:开启 false: 关闭
     */
    private setLocalConfig(configName: string, value: boolean) {
        cc.sys.localStorage.setItem(configName, value ? 'true' : 'false');
    }

    /**
     * 设置音乐是否开启
     * @param value true:开启 false: 关闭
     */
    public setMusic(value: boolean) {
        this.setLocalConfig('isMusicOn', value);
        if (value) {
            cc.audioEngine.resumeMusic();
        } else {
            this.stopMusic();
        }
    }

    /**
     * 设置音效是否开启
     * @param value true:开启 false: 关闭
     */
    public setEffect(value: boolean) {
        this.m_isEffectOn = value;
        this.setLocalConfig('isEffectOn', value);        
    }

    /**
     * 播放音乐
     * @param musicName 音乐名称
     * @param loop 是否循环
     */
    public playMusic(musciClip: cc.AudioClip, loop: boolean = true) {
        cc.audioEngine.playMusic(musciClip, loop);
    }

    /**
     * 播放音效
     * @param effectName 音效名称
     * @param loop 是否循环
     */
    public playEffect(effectClip: cc.AudioClip, loop: boolean = false) {
        if (!this.m_isEffectOn) {
            return;
        }
        cc.audioEngine.playEffect(effectClip, loop);
    }

    /**
     * 停止音乐
     */
    public stopMusic() {
        cc.audioEngine.pauseMusic();
    }

    /**
     * 停止音效
     */
    public stopEffect() {
        cc.audioEngine.stopAllEffects();
    }

    /**
     * 设置音乐音量
     * @param volume 音量
     */
    public setMusicVolume(volume: number) {
        cc.audioEngine.setMusicVolume(volume);
    }

    /**
     * 设置音效音量
     * @param volume 音量
     */
    public setEffectVolume(volume: number) {
        cc.audioEngine.setEffectsVolume(volume);
    }

}

