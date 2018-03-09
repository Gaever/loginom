Ext.define('C.view.object.ObjectModel', {
  extend: 'C.view.BaseViewModel',
  alias: 'viewmodel.object',
  data: {
    treeTitle: 'Tree',
    ids: {
      master: 'object_id',
      dict: 'parameter_id',
      dictValueIds: [1,2,3]
    },
    api:{
      currentItemType: null,
      read: 'object_property_select',
      update: 'object_update',
      detailUpdate: 'object_property_update',
      readDictionary: 'object_parameter_dictionary_select',
      clearParameter: 'object_parameter_null'
    }
  },
  stores: {
    master: { type: 'ObjectTree' },
    details: { type: 'ObjectDetails' }
  }

});