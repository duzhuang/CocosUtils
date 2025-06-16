import GameSoundCache from "./GameSoundCache";
import SoundController from "./SoundController";

export default class GameSoundController {
    private static _instance: GameSoundController;
    public static get instance(): GameSoundController {
        if (!this._instance) {
            this._instance = new GameSoundController();
        }
        return this._instance;
    }

    public destory() {
        GameSoundController._instance = null!;
    }

    public static readonly AUDIO_CONFIG = {
        CLICK_CONFIRM: "click_confirm",
        LEVEL_UP: "level_up",
        UNLOCK_PACK: "unlock_pack",
        CONGRATES_NORMAL: "congrats_normal",
        CONGRATES_DOUBLE: "congrats_double",
        BGM: "bgm",
    } as const;


    public playMusic(audioName: keyof typeof GameSoundController.AUDIO_CONFIG) {
        const audioUrl = "Sounds/" + GameSoundController.AUDIO_CONFIG[audioName];
        GameSoundCache.instance.getAudioClip(audioUrl, (audioClip) => {
            if (!audioClip) {
                console.error("audioClip is null");
                return;
            }
            SoundController.instance.playMusic(audioClip, true);
        })
    }

    public playEffect(audioName: keyof typeof GameSoundController.AUDIO_CONFIG) {
        const audioUrl = "Sounds/" + GameSoundController.AUDIO_CONFIG[audioName];
        GameSoundCache.instance.getAudioClip(audioUrl, (audioClip) => {
            if (!audioClip) {
                console.error("audioClip is null");
                return;
            }
            SoundController.instance.playEffect(audioClip, false);
        })
    }
}

