Ext.define('C.store.Suppliers', {
  extend: 'C.store.Base',
  alias: 'store.Suppliers',
  model: 'C.model.Supplier',
  constructor: function(){
    this.callParent(arguments);
    this.proxy.url = C.util.Utilities.apiUrl + 'supplier_select';
  }
})