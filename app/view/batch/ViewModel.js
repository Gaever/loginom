Ext.define('C.view.batch.ViewModel', {
  extend: 'C.view.BaseViewModel',
	alias: 'viewmodel.batch',

	data: {
		showArchived: true,

		filterArchivedBtnText:'',
		showArchivedBtnTxt: 'Show archived',
		hideArchivedBtnTxt: 'Hide archived',
		calcBtnText: 'Calculate',

    ids: {
      master: 'batch_id',
      dict: 'setting_id',
      dictValueIds: [1,3,4,5,6,7,8,9,10,11]
    },
    api: {
      create: 'api_method_create',
      read: 'api_method_select',
      readDictionary: 'api_method_value',
      detailUpdate: 'api_method_detail_update',
      update: 'api_method_update',
      delete: 'api_method_delete',
    }

	},

	stores: {
    master: { type: 'Batches' },
    details: { type :'BatchDetails' }
	}

});