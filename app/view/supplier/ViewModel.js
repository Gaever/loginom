Ext.define('C.view.supplier.ViewModel', {
  extend: 'C.view.BaseViewModel',
  alias: 'viewmodel.supplier',

  data:{
    ids: {
      master: 'supplier_id',
      dict: 'supplier_parameter_id',
      dictValueIds: [0,1]
    },
    api: {
      create: 'supplier_insert',
      read: 'supplier_property_select',
      readDictionary: 'supplier_parameter_dictionary_select',
      detailUpdate: 'supplier_property_update',
      update: 'supplier_update',
      delete: 'supplier_delete',
    }
  },

  stores: {
    master: { type: 'Suppliers' },
    details: { type: 'SupplierDetails' }
  }

});