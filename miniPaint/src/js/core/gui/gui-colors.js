/*
 * miniPaint - https://github.com/viliusle/miniPaint
 * author: Vilius L.
 */

import config from './../../config.js';
import Helper_class from './../../libs/helpers.js';

const Helper = new Helper_class();

const sidebarTemplate = `
	<div class="ui_flex_group justify_content_space_between stacked">
		<div id="selected_color_sample" class="ui_color_sample" title="Current Color Preview"></div>
		<div class="ui_button_group">



		</div>
	</div>

	<div id="color_section_picker" class="block_section">
		<input id="color_picker_gradient" type="color" aria-label="Color Selection">
		<div class="ui_input_group stacked" style="visibility: hidden;">
			<label id="color_hex_label" title="Hex" class="label_width_small trn">Hex</label>
			<input id="color_hex" aria-labelledby="color_hex_label" value="#000000" maxlength="7" type="text" />
		</div>
	</div>

`;

const dialogTemplate = `
	<div class="ui_flex_group">
		<div id="dialog_color_picker_group" class="ui_flex_group column">
			<input id="dialog_color_picker_gradient" type="color" aria-label="Color Selection">
			<div class="block_section">
				<div class="ui_input_grid stacked">
					<div class="ui_input_group">
						<label class="label_width_medium trn">Current</label>
						<div id="dialog_selected_color_sample" class="ui_color_sample"></div>
					</div>
					<div class="ui_input_group">
						<label class="label_width_medium trn">Previous</label>
						<div id="dialog_previous_color_sample" class="ui_color_sample"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

/**
 * GUI class responsible for rendering colors block on right sidebar
 */
class GUI_colors_class {

	constructor() {
		this.el = null;
		this.COLOR = '#000000';
		this.ALPHA = 255;
		this.colorNotSet = true;
		this.uiType = null;
		this.butons = null;
		this.sections = null;
		this.inputs = null;
		this.Helper = new Helper_class();
	}

	render_main_colors(uiType) {
		this.uiType = uiType || 'sidebar';
		if (this.uiType === 'dialog') {
			this.el = document.getElementById('dialog_color_picker');
			this.el.innerHTML = dialogTemplate;
		} else {
			var saved_color = this.Helper.getCookie('color');
			if (saved_color != null) config.COLOR = saved_color;
			this.el = document.getElementById('toggle_colors');
			this.el.innerHTML = sidebarTemplate;
		}
		this.init_components();
		this.render_ui_deferred = Helper.throttle(this.render_ui_deferred, 50);
	}

	init_components() {

		// Store button references
		this.buttons = {

		};

		// Store UI section references
		this.sections = {
			swatches: $('#color_section_swatches', this.el),
			swatchesPlaceholder: document.createComment('Placeholder comment for color swatches'),
			picker: $('#color_section_picker', this.el),
			pickerPlaceholder: document.createComment('Placeholder comment for color picker'),
		};

		// Store references to all inputs in DOM
		const idPrefix = this.uiType === 'dialog' ? 'dialog_' : '';
		this.inputs = {
			sample: $(`#${idPrefix}selected_color_sample`, this.el),
			swatches: $(`#${idPrefix}color_swatches`, this.el),
			pickerGradient: $(`#${idPrefix}color_picker_gradient`, this.el),
			hex: $(`#${idPrefix}color_hex`, this.el),
			rgb: {
				r: {
					range: $(`#${idPrefix}rgb_r_range`, this.el),
					number: $(`#${idPrefix}rgb_r`, this.el)
				},
				g: {
					range: $(`#${idPrefix}rgb_g_range`, this.el),
					number: $(`#${idPrefix}rgb_g`, this.el)
				},
				b: {
					range: $(`#${idPrefix}rgb_b_range`, this.el),
					number: $(`#${idPrefix}rgb_b`, this.el)
				},
				a: {
					range: $(`#${idPrefix}rgb_a_range`, this.el),
					number: $(`#${idPrefix}rgb_a`, this.el)
				}
			},
			hsl: {
				h: {
					range: $(`#${idPrefix}hsl_h_range`, this.el),
					number: $(`#${idPrefix}hsl_h`, this.el)
				},
				s: {
					range: $(`#${idPrefix}hsl_s_range`, this.el),
					number: $(`#${idPrefix}hsl_s`, this.el)
				},
				l: {
					range: $(`#${idPrefix}hsl_l_range`, this.el),
					number: $(`#${idPrefix}hsl_l`, this.el)
				}
			}
		};



		// Initialize color swatches
		this.inputs.swatches
			.uiSwatches({ rows: 3, cols: 7, count: 21, readonly: this.uiType === 'dialog' })
			.on('input', () => {
				this.set_color({
					hex: this.inputs.swatches.uiSwatches('get_selected_hex')
				});
			});
		if (this.uiType === 'dialog') {
			this.inputs.swatches.uiSwatches('set_all_hex', config.swatches.default);
		}

		// Initialize color picker gradient
		this.inputs.pickerGradient
			.uiColorPickerGradient()  //用的jQuery插件，具体在core>components>color-picker-gradient中
			.on('input', () => {
				const hsv = this.inputs.pickerGradient.uiColorPickerGradient('get_hsv');
				this.set_color({
					h: 0,
					s: 0,
					v: hsv.v * 100
				});
			});

		// Initialize hex entry
		this.inputs.hex
			.on('input', (event) => {
				const value = this.inputs.hex.val();
				const trimmedValue = value.trim();
				if (value !== trimmedValue) {
					this.inputs.hex.val(trimmedValue);
				}
				this.inputs.hex[0].setCustomValidity(/^\#[0-9A-F]{6}$/gi.test(trimmedValue) ? '' : 'Invalid Hex Code');
				this.set_color({ hex: this.inputs.hex.val() });
			})
			.on('blur', () => {
				const value = this.inputs.hex.val();
				if (!/^\#[0-9A-F]{6}$/gi.test(value)) {
					this.inputs.hex.val(this.uiType === 'dialog' ? this.COLOR : config.COLOR);
					this.inputs.hex[0].setCustomValidity('');
				}
			});
		
		// Initialize the color sliders
		const sliderInputs = [
			...Object.entries(this.inputs.rgb),
			...Object.entries(this.inputs.hsl)
		];
		for (const [key, input] of sliderInputs) {
			input.range && input.range
				.uiRange()
				.on('input', () => {
					this.set_color({ [key]: input.range.uiRange('get_value') });
				});
			input.number && input.number
				.uiNumberInput()
				.on('input', () => {
					this.set_color({ [key]: input.number.uiNumberInput('get_value') });
				})
		}

		// Update all inputs from config.COLOR
		this.render_selected_color();
	}

	/**
	 * Changes the config.COLOR variable based on the given input.
	 * @param {*} definition object contains the value of the color to change:
	 *                       hex   - set the color as a hex code
	 *                       r,g,b - set the color as red, green, blue values [0-255]
	 *                       a     - set the color alpha [0-255]
	 *                       h,s,l - set the color as hue [0-360], saturation [0-100], luminosity [0-100]
	 *                       h,s,v - set the color as hue [0-360], saturation [0-100], value [0-100]
	 */
	set_color(definition) {
		let newColor = null;
		let newAlpha = null;
		let hsl = null;
		let hsv = null;
		// Set new color by hex code
		if ('hex' in definition) {
			const hex = '#' + definition.hex.replace(/[^0-9A-F]*/gi, '');
			if (/^\#[0-9A-F]{6}$/gi.test(hex)) {
				newColor = '#' + definition.hex.trim().replace(/^\#/, '');
			}
		}
		// Set new color by rgb
		else if ('r' in definition || 'b' in definition || 'g' in definition) {
			const previousRgb = Helper.hexToRgb(this.uiType === 'dialog' ? this.COLOR : config.COLOR);
			newColor = Helper.rgbToHex(
				'r' in definition ? Math.min(255, Math.max(0, parseInt(definition.r, 10) || 0)) : previousRgb.r,
				'g' in definition ? Math.min(255, Math.max(0, parseInt(definition.g, 10) || 0)) : previousRgb.g,
				'b' in definition ? Math.min(255, Math.max(0, parseInt(definition.b, 10) || 0)) : previousRgb.b
			);
		}
		// Set new color by hsv
		else if ('v' in definition) {
			const previousRgb = Helper.hexToRgb(this.uiType === 'dialog' ? this.COLOR : config.COLOR);
			const previousHsv = Helper.rgbToHsv(previousRgb.r, previousRgb.g, previousRgb.b);
			hsv = {
				h: 'h' in definition ? Math.min(360, Math.max(0, parseInt(definition.h, 10) || 0)) / 360 : previousHsv.h,
				s: 's' in definition ? Math.min(100, Math.max(0, parseInt(definition.s, 10) || 0)) / 100 : previousHsv.s,
				v: 'v' in definition ? Math.min(100, Math.max(0, parseInt(definition.v, 10) || 0)) / 100 : previousHsv.v
			};
			newColor = Helper.hsvToHex(hsv.h, hsv.s, hsv.v);
		}
		// Set new color by hsl
		else if ('h' in definition || 's' in definition || 'l' in definition) {
			hsl = {
				h: ('h' in definition ? Math.min(360, Math.max(0, parseInt(definition.h, 10) || 0)) : parseInt(this.inputs.hsl.h.number.uiNumberInput('get_value'), 10)) / 360,
				s: ('s' in definition ? Math.min(100, Math.max(0, parseInt(definition.s, 10) || 0)) : parseInt(this.inputs.hsl.s.number.uiNumberInput('get_value'), 10)) / 100,
				l: ('l' in definition ? Math.min(100, Math.max(0, parseInt(definition.l, 10) || 0)) : parseInt(this.inputs.hsl.l.number.uiNumberInput('get_value'), 10)) / 100
			};
			newColor = Helper.hslToHex(hsl.h, hsl.s, hsl.l);
		}
		// Set new alpha
		if ('a' in definition) {
			newAlpha = Math.min(255, Math.max(0, parseInt(Math.ceil(definition.a), 10)));
		}
		// Re-render UI if changes made
		if (newColor != null || newAlpha != null) {
			if (this.uiType === 'dialog') {
				this.COLOR = newColor != null ? newColor : this.COLOR;
				this.ALPHA = newAlpha != null ? newAlpha : this.ALPHA;
				if (this.colorNotSet) {
					this.colorNotSet = false;
					$('#dialog_previous_color_sample', this.el)[0].style.background = this.COLOR;
				}
			} else {
				config.COLOR = newColor != null ? newColor : config.COLOR;
				config.ALPHA = newAlpha != null ? newAlpha : config.ALPHA;
			}
			if (hsl && !hsv) {
				hsv = Helper.hslToHsv(hsl.h, hsl.s, hsl.l);
			}
			if (hsv && !hsl) {
				hsl = Helper.hsvToHsl(hsv.h, hsv.s, hsv.v);
			}
			this.render_selected_color({ hsl, hsv });
		}

		if (this.uiType === 'sidebar') {
			this.Helper.setCookie('color', config.COLOR);
		}
	}

	/**
	 * Renders current color defined in the config to all color fields
	 * @param {*} options additional options:
	 *                    hsl - override for hsl values so it isn't calculated based on rgb (can lose selected hue/saturation otherwise)
	 *                    hsv - override for hsv values so it isn't calculated based on rgb (can lose selected hue/saturation otherwise)
	 */
	render_selected_color(options) {
		options = options || {};
		const COLOR = this.uiType === 'dialog' ? this.COLOR : config.COLOR;
		const ALPHA = this.uiType === 'dialog' ? this.ALPHA : config.ALPHA;

		this.inputs.sample.css('background', COLOR);

		if (this.uiType !== 'dialog') {
			this.inputs.swatches.uiSwatches('set_selected_hex', COLOR);
		}

		const hexInput = this.inputs.hex[0];
		hexInput.value = COLOR;
		hexInput.setCustomValidity('');

		const rgb = Helper.hexToRgb(COLOR);
		delete rgb.a;
		for (let rgbKey in rgb) {
			this.inputs.rgb[rgbKey].range.uiRange('set_value', rgb[rgbKey]);
			this.inputs.rgb[rgbKey].number.uiNumberInput('set_value', rgb[rgbKey]);
		}
		this.inputs.rgb.a.range.uiRange('set_value', ALPHA);
		this.inputs.rgb.a.number.uiNumberInput('set_value', ALPHA);

		const hsv = options.hsv || Helper.rgbToHsv(rgb.r, rgb.g, rgb.b);

		const hsl = options.hsl || Helper.rgbToHsl(rgb.r, rgb.g, rgb.b);
		for (let hslKey in hsl) {
			const hslValue = Math.round(hsl[hslKey] * (hslKey === 'h' ? 360 : 100));
			this.inputs.hsl[hslKey].range.uiRange('set_value', hslValue);
			this.inputs.hsl[hslKey].number.uiNumberInput('set_value', hslValue);
		}

		this.render_ui_deferred({ hsl, hsv });
	}

	/**
	 * Renders the color gradients in each channel's color range selection.
	 * This function is throttled due to expensive operations on low-end systems.
	 * @param {*} options additional options:
	 *                    hsl - override for hsl values so it isn't calculated based on rgb (can lose selected hue/saturation otherwise)
	 *                    hsv - override for hsv values so it isn't calculated based on rgb (can lose selected hue/saturation otherwise)
	 */
	render_ui_deferred(options) {
		options = options || {};
		const COLOR = this.uiType === 'dialog' ? this.COLOR : config.COLOR;

		// RGB
		const rgb = Helper.hexToRgb(COLOR);
		delete rgb.a;
		for (let rgbKey in rgb) {
			const rangeMin = JSON.parse(JSON.stringify(rgb));
			const rangeMax = JSON.parse(JSON.stringify(rgb));
			rangeMin[rgbKey] = 0;
			rangeMax[rgbKey] = 255;
			this.inputs.rgb[rgbKey].range.uiRange('set_background',
				`linear-gradient(to right, ${ Helper.rgbToHex(rangeMin.r, rangeMin.g, rangeMin.b) }, ${ Helper.rgbToHex(rangeMax.r, rangeMax.g, rangeMax.b) })`
			);
		}
		// A
		this.inputs.rgb.a.range.uiRange('set_background',
			`linear-gradient(to right, transparent, ${ COLOR })`
		);
		// HSV
		const hsv = options.hsv || Helper.rgbToHsv(rgb.r, rgb.g, rgb.b);
		this.inputs.pickerGradient.uiColorPickerGradient('set_hsv', hsv);
		// HSL
		const hsl = options.hsl || Helper.rgbToHsl(rgb.r, rgb.g, rgb.b);
		// HSL - H
		this.inputs.hsl.h.range.uiRange('set_background',
			`linear-gradient(to right, ${
				Helper.hex_set_hsl('#ff0000', { s: hsl.s, l: hsl.l })
			} 0%, ${
				Helper.hex_set_hsl('#ffff00', { s: hsl.s, l: hsl.l })
			} 17%, ${
				Helper.hex_set_hsl('#00ff00', { s: hsl.s, l: hsl.l })
			} 33%, ${
				Helper.hex_set_hsl('#00ffff', { s: hsl.s, l: hsl.l })
			} 50%, ${
				Helper.hex_set_hsl('#0000ff', { s: hsl.s, l: hsl.l })
			} 67%, ${
				Helper.hex_set_hsl('#ff00ff', { s: hsl.s, l: hsl.l })
			} 83%, ${
				Helper.hex_set_hsl('#ff0000', { s: hsl.s, l: hsl.l })
			} 100%)`
		);
		// HSL - S
		let rangeMin = JSON.parse(JSON.stringify(hsl));
		let rangeMax = JSON.parse(JSON.stringify(hsl));
		rangeMin.s = 0;
		rangeMax.s = 1;
		this.inputs.hsl.s.range.uiRange('set_background',
			`linear-gradient(to right, ${ Helper.hslToHex(rangeMin.h, rangeMin.s, rangeMin.l) }, ${ Helper.hslToHex(rangeMax.h, rangeMax.s, rangeMax.l) })`
		);
		// HSL - L
		let rangeMid = JSON.parse(JSON.stringify(hsl));
		rangeMid.l = 0.5;
		this.inputs.hsl.l.range.uiRange('set_background',
			`linear-gradient(to right, #000000 0%, ${ Helper.hslToHex(rangeMid.h, rangeMid.s, rangeMid.l) } 50%, #ffffff 100%)`
		);

		// Store swatch values
		if (this.uiType === 'sidebar') {
			config.swatches.default = this.inputs.swatches.uiSwatches('get_all_hex');
		}
	}

}

export default GUI_colors_class;
