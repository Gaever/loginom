Ext.define('C.view.object.ObjectDetailController', {
  extend: 'C.view.DetailController',
  alias: 'controller.objectdetail',

  mixins: {
    misc: 'C.mixin.Misc'
  },

  getFetchDetailsRequestUrl(){
    return this.callParent() + '&object_type=' + this.itemType;
  },

  getFetchDictValuesRequestUrl: function(dictId){
    return this.api.readDictionary + 
          '?' + this.ids.master + '=' + this.itemId +
          '&' + this.ids.dict + '=' + dictId +
          '&' + this.ids.dictItemType + '=' + this.itemType;
  },

  onOpenDetail: function(isActiveId){
    this.itemId = this.getViewModel().get('currentItemId')
    this.itemType = this.getViewModel().get('currentItemType')
    if( 
        this.itemId == undefined 
        || this.itemId == null
        || this.itemType == null 
        || this.itemType == undefined 
    ){
      Ext.MessageBox.hide();
      Ext.Msg.alert('Load details', 'Loading details failed');
      return;
    }
    this.itemIdIsActiveId = isActiveId;
    this.fetchDetails();
  },

  getUpdateDetailsRequestUrl: function(item){
    return this.api.detailUpdate + 
            '?' + this.ids.master + '=' + this.itemId +
            '&' + 'object_type=' + this.itemType +
            '&' + this.ids.dict +'=' + item[this.ids.dict] +
            '&value=' + item.getRawValue();
  },


})