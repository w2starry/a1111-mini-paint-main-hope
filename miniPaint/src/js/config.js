//main config file

var config = {};

config.TRANSPARENCY = false;
config.TRANSPARENCY_TYPE = 'squares'; //squares, green, grey
config.LANG = 'en';
config.WIDTH = 512;
config.HEIGHT = 512;
config.visible_width = null;
config.visible_height = null;
config.COLOR = '#ffffff';
config.ALPHA = 255;
config.ZOOM = 1;
config.SNAP = true;
config.pixabay_key = '3ca2cd8af3fde33af218bea02-9021417';
config.safe_search_can_be_disabled = true;
config.google_webfonts_key = 'AIzaSyAC_Tx8RKkvN235fXCUyi_5XhSaRCzNhMg';
config.layers = [];
config.layer = null;
config.need_render = false;
config.need_render_changed_params = false; // Set specifically when param change in layer details triggered render
config.mouse = {};
config.mouse_lock = null;
config.swatches = {
	default: [] // Only default used right now, object format for swatch swapping in future.
};
config.user_fonts = {};
config.enable_autoresize_by_default = true;

//requires styles in reset.css
config.themes = [
	'dark',
	'light',
	'green',
];

//no-translate BEGIN

//no-translate END

config.TOOLS = [
	{
		name: 'brush',
		attributes: {
			size: 4,
		},
	},
	{
		name: 'pick_color',
		attributes: {
			global: false,
		},
	},
	{
		name: 'erase',
		on_update: 'on_params_update',
		attributes: {
			size: 30,
			circle: true,
			strict: true,
		},
	}
];

//link to active tool
config.TOOL = config.TOOLS[2];
	
export default config;