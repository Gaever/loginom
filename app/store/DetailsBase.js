Ext.define('C.store.DetailsBase', {
  extend: 'Ext.data.Store',
  autoLoad: false,
  autoSync: false,
  proxy:{
    type:'ajax',
    useDefaultXhrHeader: false,
    reader:{
      type: 'json',
      transform: {
        fn: function(data){
          return data.DataSet.Rows;
        }, 
        scope: this
      },
    },
    writer: {
      type: 'json',
    }
  }
})

