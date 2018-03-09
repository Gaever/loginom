Ext.define('C.view.batch.DetailController', {
  extend: 'C.view.DetailController',
  alias: 'controller.batchdetail',

  getUpdateDetailsRequestUrl: function(item){
    return this.api.detailUpdate + 
            '?batch_id=' + this.itemId +
            '&' + this.ids.dict +'=' + item[this.ids.dict] +
            '&value=' + item.getRawValue();
  },

});