import app from './../../app.js';
import config from './../../config.js';
import Base_layers_class from './../../core/base-layers.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class Layer_raster_class {

	constructor() {
		this.Base_layers = new Base_layers_class();

	}

	raster() {
		var canvas = this.Base_layers.convert_layer_to_canvas();  //转化
		var current_layer = config.layer;
		var current_id = current_layer.id;

		//show
		var params = {
			type: 'image',
			name: config.layer.name + ' + raster',
			data: canvas.toDataURL("image/png"),
			x: parseInt(canvas.dataset.x),
			y: parseInt(canvas.dataset.y),
			width: canvas.width,
			height: canvas.height,
			opacity: current_layer.opacity,
		};
		app.State.do_action(  //在core>base-state中，是为了执行动作并管理动作的历史记录，以及在必要时释放内存，以便撤销和重做（undo/redo）
			new app.Actions.Bundle_action('convert_to_raster', 'Convert to Raster', [  //解析见GoodNotes
				new app.Actions.Insert_layer_action(params, false),  //绑定动作
				new app.Actions.Delete_layer_action(current_id)
			])
		);
	}

}

export default Layer_raster_class;
