import config from './../../config.js';
import File_save_class from './save.js';
import Dialog_class from './../../libs/popup.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

/** 
 * manages files / quick-save
 * 
 * @author ViliusL
 */
class File_quicksave_class {

	constructor() {
		this.POP = new Dialog_class();
		this.File_save = new File_save_class();

	}


	quicksave() {
		//save image data
		var data_json = this.File_save.export_as_json();
		if (data_json.length > 5000000) {
			alertify.error('Sorry, image is too big, max 5 MB.');
			return false;
		}
		localStorage.setItem('quicksave_data', data_json);
	}

}

export default File_quicksave_class;