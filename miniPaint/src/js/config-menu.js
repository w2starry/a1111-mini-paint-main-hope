const menuDefinition = [
	{
		name: 'File',
		children: [
			{
				name: 'New',
				target: 'file/new.new'
			},
			{
				divider: true
			},
			{
						name: 'Open File',
						shortcut: 'O',
						ellipsis: true,
						target: 'file/open.open_file'
			},
			{
				divider: true
			},
			{
				name: 'Export',
				ellipsis: true,
				shortcut: 'S',
				target: 'file/save.export'
			},
			{
				divider: true
			},
			{


				name: 'Send to Controlnet',
                target: 'file/send.GUISendControlnet'


        	}
		]
	},
	{
		name: 'Edit',
		children: [
			{
				name: 'Undo',
				shortcut: 'Ctrl+Z',
				target: 'edit/undo.undo'
			},
			{
				name: 'Redo',
				shortcut: 'Ctrl+Y',
				target: 'edit/redo.redo'
			}
		]
	},
	{
		name: 'Layer',
		children: [
			{
				name: 'New',
				shortcut: 'N',
				target: 'layer/new.new'
			},
			{
				divider: true
			},
			{
				name: 'Show / Hide',
				target: 'layer/visibility.toggle'
			},
			{
				name: 'Delete',
				target: 'layer/delete.delete'
			},
			{
				name: 'Convert to Raster',
				target: 'layer/raster.raster'
			},
			{
				divider: true
			},
			{
				name: 'Move',
				children: [
					{
						name: 'Up',
						target: 'layer/move.up'
					},
					{
						name: 'Down',
						target: 'layer/move.down'
					}
				]
			},
			{
				name: 'Rename',
				ellipsis: true,
				target: 'layer/rename.rename'
			},
			{
				divider: true
			},
			{
				name: 'Merge Down',
				target: 'layer/merge.merge'
			}
		]
	}
];


export default menuDefinition;