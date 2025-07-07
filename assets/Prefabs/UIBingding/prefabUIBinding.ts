
const { ccclass, property } = cc._decorator;
@ccclass
export default class prefabUIBinding extends cc.Component {   

	@property({ type: cc.Node, tooltip: '' })
 	node_level1: cc.Node = null;

	@property({ type: cc.Node, tooltip: '' })
 	node_level2: cc.Node = null;

	@property({ type: cc.Node, tooltip: '' })
 	node_level3: cc.Node = null;

	@property({ type: cc.Node, tooltip: '' })
 	node_level4: cc.Node = null;

	@property({ type: cc.Node, tooltip: '' })
 	node_level5: cc.Node = null;

	@property({ type: cc.Canvas, tooltip: '' })
 	canvas_1: cc.Canvas = null;

	@property({ type: cc.Widget, tooltip: '' })
 	widget_1: cc.Widget = null;

	@property({ type: cc.Sprite, tooltip: '' })
 	spr_add: cc.Sprite = null;

	@property({ type: cc.Sprite, tooltip: '' })
 	spr_l2: cc.Sprite = null;

	@property({ type: cc.Sprite, tooltip: '' })
 	spr_l3: cc.Sprite = null;

	@property({ type: cc.Label, tooltip: '' })
 	lbl_result: cc.Label = null;

	@property({ type: cc.RichText, tooltip: '' })
 	rich_level1: cc.RichText = null;

	@property({ type: cc.Graphics, tooltip: '' })
 	graphice_1: cc.Graphics = null;

	@property({ type: cc.Mask, tooltip: '' })
 	mask_1: cc.Mask = null;

	@property({ type: cc.Button, tooltip: '' })
 	btn_add: cc.Button = null;

	@property({ type: cc.EditBox, tooltip: '' })
 	edit_1: cc.EditBox = null;

	@property({ type: cc.Toggle, tooltip: '' })
 	toggle_1: cc.Toggle = null;

	@property({ type: cc.Slider, tooltip: '' })
 	slider_1: cc.Slider = null;

	@property({ type: cc.ScrollView, tooltip: '' })
 	scro_level1: cc.ScrollView = null;

	@property({ type: cc.ProgressBar, tooltip: '' })
 	proBar_1: cc.ProgressBar = null;

	@property({ type: cc.Layout, tooltip: '' })
 	layout_1: cc.Layout = null;

	@property({ type: cc.TiledMap, tooltip: '' })
 	tiledMap_1: cc.TiledMap = null;

	@property({ type: cc.TiledTile, tooltip: '' })
 	tiledTile_1: cc.TiledTile = null;

	@property({ type: cc.BlockInputEvents, tooltip: '' })
 	blockInput_1: cc.BlockInputEvents = null;

	@property({ type: cc.ScrollView, tooltip: '' })
 	scro_2: cc.ScrollView = null;

	@property({ type: cc.Scrollbar, tooltip: '' })
 	scrollBar_1: cc.Scrollbar = null;

	@property({ type: cc.Toggle, tooltip: '' })
 	toggle_2: cc.Toggle = null;

	@property({ type: cc.ToggleContainer, tooltip: '' })
 	toggleCon_2: cc.ToggleContainer = null;

	@property({ type: cc.VideoPlayer, tooltip: '' })
 	videoPlayer_2: cc.VideoPlayer = null;

	@property({ type: cc.WebView, tooltip: '' })
 	webView_2: cc.WebView = null;

	@property({ type: cc.BoxCollider, tooltip: '' })
 	boxCo_2: cc.BoxCollider = null;

	@property({ type: cc.CircleCollider, tooltip: '' })
 	circleCo_2: cc.CircleCollider = null;

	@property({ type: cc.PolygonCollider, tooltip: '' })
 	polygonCo_2: cc.PolygonCollider = null;

	@property({ type: cc.PhysicsBoxCollider, tooltip: '' })
 	phyBoxCo_2: cc.PhysicsBoxCollider = null;

	@property({ type: cc.PhysicsCircleCollider, tooltip: '' })
 	phyCircleCo_2: cc.PhysicsCircleCollider = null;

	@property({ type: cc.PhysicsPolygonCollider, tooltip: '' })
 	phyPolygonCo_2: cc.PhysicsPolygonCollider = null;

	@property({ type: cc.Animation, tooltip: '' })
 	animation_2: cc.Animation = null;

	@property({ type: cc.AudioSource, tooltip: '' })
 	audioSource_2: cc.AudioSource = null;

	@property({ type: cc.Camera, tooltip: '' })
 	camera_2: cc.Camera = null;

	@property({ type: cc.MotionStreak, tooltip: '' })
 	motionStreak_2: cc.MotionStreak = null;

	@property({ type: sp.Skeleton, tooltip: '' })
 	spineSk_2: sp.Skeleton = null;


    protected onLoad(): void {
        
    }

    protected start(): void {
        
    }

    protected onDestroy(): void {
    
    }
}