Ext.define('C.view.BaseViewModel', {
  extend: 'Ext.app.ViewModel',

  data: {
    currentItemId: null,
    detailIsLoading: false,
    masterIsEditing: false,

    dictionary: null,

    formTitle: 'Details',

    gridTitle: 'Main',
    addBtnText: 'Add',
    editBtnText: 'Edit',
    saveBtnText: 'Save',
    delBtnText: 'Delete',
  },
});