Ext.define('C.view.main.Main', {
	extend: 'Ext.Container',
	xtype: 'mainview',

	requires: [
		'C.view.main.MainModel',
		'C.view.main.MainController',

		'C.view.batch.Viewport',
		'C.view.store.Viewport',
		'C.view.supplier.Viewport',
		'C.view.object.Viewport',
	],

	items: [{
		region: 'north',
		xtype: 'menu',
		floating: false,
		layout: 'hbox',
		align: 'stretch',
		items: [
			{
				text: 'Batches',
				id: 'batchviewport',
				listeners: { click: 'onMenuItemClick' },
			},{
				text: 'Stores',
				id: 'storeviewport',
				listeners: { click: 'onMenuItemClick' },
			},{
				text: 'Suppliers',
				id: 'supplierviewport',
				listeners: { click: 'onMenuItemClick' },
			},{
				text: 'Objects',
				id: 'objectviewport',
				listeners: { click: 'onMenuItemClick' },
			}
		]
	}, {
		region: 'center',
		reference: 'viewport',
		xtype: 'batchviewport',
		//xtype: 'objectviewport'
	}],

	activeItem: 0,
	layout: 'border',

	controller: 'main',
	viewModel: 'main',
});