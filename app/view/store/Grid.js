Ext.define('C.view.store.Grid', {
  extend: 'Ext.grid.Panel',
  xtype: 'storegrid',

  bind: {
    store: '{master}',
    title: '{gridTitle}'
  },

  columns: [{
      header: 'Active',
      dataIndex: 'active',
      xtype: 'checkcolumn',
      width: 60,
      listeners:{
        beforecheckchange: 'toggleActive',
      }
    }, {
      header: 'id',
      dataIndex: 'id',
      //editor: 'textfield',
      width: 60
    }, {
      header: 'Code',
      dataIndex: 'code',
      flex: 1,
      editor: 'textfield',
    }, {
      header: 'Name',
      dataIndex: 'name',
      flex: 1,
      editor: 'textfield',
    }, {
      xtype: 'widgetcolumn',
      width: 110,
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

  /*
  dockedItems: [{
    xtype: 'toolbar',
    dock: 'top',
    items: ['->',{
      xtype: 'button',
      action: 'add',
      bind: '{addBtnText}',
      width: 100,
      handler: 'createNewItem'
    }]
  }],
  */

  listeners: {
    select: 'openDetail',
  }
});
