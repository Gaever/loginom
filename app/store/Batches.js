Ext.define('C.store.Batches', {
  extend: 'C.store.Base',
  alias: 'store.Batches',
  model: 'C.model.Batch',
  constructor: function(){
    this.callParent(arguments);
    this.proxy.url = C.util.Utilities.apiUrl + 'batch_select?hide_archive=False';
  },
  getActiveId: function(){
    var activeId = this.getData().items.find(function(item){
      return item.data.active;
    })    
    return activeId ? activeId.data.id : false;
  },
})
