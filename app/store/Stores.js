Ext.define('C.store.Stores', {
  extend: 'C.store.Base',
  alias: 'store.Stores',
  model: 'C.model.Store',
  constructor: function(){
    this.callParent(arguments);
    this.proxy.url = C.util.Utilities.apiUrl + 'store_select';
  }
})