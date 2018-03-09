Ext.define('C.view.store.ViewModel', {
  extend: 'C.view.BaseViewModel',
  alias: 'viewmodel.store',

  data:{
    ids: {
      master: 'store_id',
      dict: 'store_parameter_id',
      dictItemType: 'object_type',
      dictValueIds: [1,2]
    },
    api: {
      create: 'store_insert',
      read: 'store_property_select',
      readDictionary: 'store_parameter_dictionary_select',
      detailUpdate: 'store_property_update',
      update: 'store_update',
      delete: 'store_delete',
    }
  },

  stores: {
    master: { type: 'Stores' },
    details: { type: 'StoreDetails' }
  }
});