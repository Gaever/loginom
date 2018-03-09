Ext.define('C.store.Base', {
  extend: 'Ext.data.Store',
  autoLoad: true,
  autoSync: false,
  sorters: {
    property: 'id',
    direction: 'ASC'
  },
  proxy:{
    type:'ajax',
    method:'GET',
    useDefaultXhrHeader: false,
    reader:{
      type: 'json',
      transform: {
        fn: function(data){
          //Rename id fields to 'id'
          /*
          return data.DataSet.Rows.map(function(item){
            console.log( item );
            var _item = {};
            Ext.Object.each(item, function(key, value){
              if(key.match('id') !== null){
                _item.id = value;
              } else {
                _item[key] = value;
              }
            })
            return _item;
          })
          */
         return data.DataSet.Rows;
        }, 
      },
    },
    writer: {
      type: 'json',
    },  
    scope: this
  },
})