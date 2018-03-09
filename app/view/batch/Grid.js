Ext.define('C.view.batch.Grid', {
	extend: 'Ext.grid.Panel',
	xtype: 'batchgrid',

	bind: {
		store: '{master}',
		title: '{gridTitle}'
	},

	columns: [
		{
			header: 'Active',
			dataIndex: 'active',
			xtype: 'checkcolumn',
			width: 60,
			//editor: 'checkbox',
			listeners:{
				beforecheckchange: 'toggleActive',
			}
		}, {
			header: 'Archive',
			dataIndex: 'archive',
			xtype: 'checkcolumn',
			editor: 'checkbox',
			width: 70,
			listeners:{
				beforecheckchange: 'toggleArchive',
			}
		}, {
			header: 'id',
			dataIndex: 'id',
			width: 60
		}, {
			header: 'Name',
			dataIndex: 'name',
			flex: 1,
			editor: 'textfield',
		}, {
			text: 'Date',
			dataIndex: 'date',
			width: 100,
			xtype: 'datecolumn',
			format: 'Y-m-d',
			submitFormat: "Y-m-d\\TH:i:s",
			editor: {
				xtype: 'datefield',
				format: "Y-m-d\\TH:i:s",
			},
		}, {
			xtype: 'widgetcolumn',
			width: 75,
      widget: {
        xtype: 'button',
        bind: '{delBtnText}',
        handler: 'deleteItem'
      }
		}, {
			xtype: 'widgetcolumn',
			width: 75,
      widget: {
        xtype: 'button',
        bind: '{editBtnText}',
        handler: 'editItem',
        enabled: false
      }
		}
	],
	
	plugins: [{
		ptype: 'rowediting',
		pluginId: 'gridCellEditingPlugin',
		clicksToEdit: 2,
		listeners: {
			beforeedit: 'onGridBeforeEdit',
			edit: 'onGridEdit',
			canceledit: 'onGridCancelEdit'
		}
	}],

	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: ['->',{
			xtype: 'button',
			action: 'add',
			bind: '{addBtnText}',
			width: 100,
			handler: 'createNewItem'
		}, {
			xtype: 'button',
			bind: '{calcBtnText}',
			width: 100,
			handler: 'doCalculation'
		},{
			xtype: 'button',
			bind: '{filterArchivedBtnText}',
			width: 200,
			handler: 'filterArchived'
		}]
	}],

	listeners: {
		select: 'openDetail',
	}
});
