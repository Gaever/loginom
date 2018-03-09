Ext.define('C.view.main.MainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.main',    

  onMenuItemClick(item){
    this.getView().remove(1);
    this.getView().insert(1, { region: 'center', xtype: item.id })
  },

});
