import GameSoundController from "./GameSoundController";
import SoundController from "./SoundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundScene extends cc.Component {
    protected onLoad(): void {
        this.registerEvent();
    }

    protected onDestroy(): void {
        this.unregisterEvent();
    }

    protected start(): void {
        GameSoundController.instance.playMusicSync("BGM");
    }

    private registerEvent(): void {

    }

    private unregisterEvent(): void {

    }

    private slideMusic(sliderMusic: cc.Slider) {
        SoundController.instance.setMusicVolume(sliderMusic.progress);
    }

    private slideEffect(sliderEffect: cc.Slider) {
        SoundController.instance.setEffectVolume(sliderEffect.progress);
    }

    private toggleMusic(toggleMusic: cc.Toggle) {
        SoundController.instance.setMusic(toggleMusic.isChecked);
    }

    private toggleEffect(toggleEffect: cc.Toggle) {
        SoundController.instance.setEffect(toggleEffect.isChecked);
    }

    private btnClickSound() {
        GameSoundController.instance.playEffectSync("CLICK_CONFIRM");
    }

    private btnLevelUpSound() {
        GameSoundController.instance.playEffectSync("LEVEL_UP");
    }

    private btnNormalSound() {
        GameSoundController.instance.playEffectSync("CONGRATES_NORMAL");
    }
}

