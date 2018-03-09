Ext.define('C.mixin.Misc', {

  apiUrl: function(){
    return C.util.Utilities.apiUrl;
  },

  apiCalcUrl: function(){
    return C.util.Utilities.apiCalcUrl;
  },

  ajaxSeries: function(funcs, resultCallback = null){
    var results = [],
        err = [];
    var f = function(){
      var _f = funcs.shift();     
      if (_f && err.length == 0){

        _f(function(_err, result){
          if(!_err){
            results.push(result);                       
          } else {
            err.push(err);
          }
          f();
        })

      } else {
        resultCallback(err, results);
      }
    };

    f();
  },

  getIdField: function(model){
    var idField = model.fields.find(function(field, key){
      if(field.name.match('id') !== null){ return true; }
    })
    if(idField){ return idField.name }
  },

  getApi: function(ctx){
    var api = {};
    Ext.Object.each(ctx.getViewModel().get('api').__proto__, function(key, value){
      api[key] = this.apiUrl() + value;
    }.bind(this));
    return api;
  },

  renameIdFields: function(item, newIdFieldName = 'id'){
    var _item = {};
    Ext.Object.each(item, function(key, value){
      if(key == 'batch_id'){
        _item.id = value
      } else if (key == 'batch_detail_id'){
        _item.batch_detail_id = value;
      } else if(key.match('id') !== null){
        _item[newIdFieldName] = value;
      } else if(key.match('id') == 'detail_id') {
        _item.detail_id = value;
      } else {
        _item[key] = value;
      }
    })
    return _item;
  },

  mapIdFieldNames: function(ctx){
    var vm = ctx.getViewModel(), me = this;
    return {
      master: vm.get('ids.master') || me.getIdField(ctx.store.model),
      detail: vm.get('ids.detail') || 'id',
      dict: vm.get('ids.dict') || 'id',
      masterRecord: vm.get('ids.masterRecord') ||'id',
      dictValueIds: vm.get('ids.dictValueIds') || [],
    }
  }


});
