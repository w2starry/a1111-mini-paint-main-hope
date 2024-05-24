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
		        name: "Send",
		        children: [
			        {
				        name: 'Send to Controlnet',
				        target: 'file/send.GUISendControlnet'
			        },
		        	{
		        		name: 'Send to Image2Image',
		        		target: 'file/send.GUISendImg2img'
		        	},
			        {
		        		name: 'Send to Extras',
			        	target: 'file/send.GUISendExtras'
			        }
		        ]
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
			},
			{
				divider: true
			},
			{
				name: 'Copy to Clipboard',
				shortcut: 'Ctrl+C',
				target: 'edit/copy.copy_to_clipboard'
			},
			{
				name: 'Paste',
				shortcut: 'Ctrl+V',
				target: 'edit/paste.paste'
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
				name: 'Duplicate',
				shortcut: 'D',
				target: 'layer/duplicate.duplicate'
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
				name: 'Clear',
				target: 'layer/clear.clear'
			},
			{
				divider: true
			},
			{
				name: 'Merge Down',
				target: 'layer/merge.merge'
			},
			{
				name: 'Flatten Image',
				target: 'layer/flatten.flatten'
			}
		]
	},
	{
		name: 'Help',
		children: [
			{
				name: 'Keyboard Shortcuts',
				ellipsis: true,
				target: 'help/shortcuts.shortcuts'
			},
		]
	}
];


export default menuDefinition;