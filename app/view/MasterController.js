Ext.define('C.view.MasterController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.master',

  mixins: {
    misc: 'C.mixin.Misc'
  },

  init: function(){
    var vm = this.getViewModel(), me = this;
    this.store = vm.getStore('master');
    this.api = this.mixins.misc.getApi(this);
    this.ids = this.mixins.misc.mapIdFieldNames(this);
    this.isNewItem = false;
    this.fetchDictValues();
  },

  getFetchDictValuesRequestUrl: function(dictId){
    return this.api.readDictionary + '?' + this.ids.dict + '=' + dictId;
  },

  fetchDictValues: function(){
    var me = this;

    Ext.MessageBox.wait('Loading dictionary...');
    var requestURLs = [];
    this.ids.dictValueIds.forEach(function(id){
      requestURLs.push(this.getFetchDictValuesRequestUrl(id))      
    }.bind(this))

    var requestQueue = requestURLs.map(function(requestUrl){
      return function(callback){
        Ext.Ajax.request({
          method: 'get',
          useDefaultXhrHeader: false,
          url: requestUrl,
          success: function(data){
            var values = JSON.parse(data.responseText).DataSet.Rows;
            var _values = values.map(function(o, key){
              return {'name': o.value};
            })
            callback(null, _values);
          },
          failure: function(err){ callback(err) }
        })
      }
    });

    this.mixins.misc.ajaxSeries(requestQueue, function(err, result){
      Ext.MessageBox.hide();
      if(err.length == 0){
        me.getViewModel().set('dictionary', result);
      } else {
        Ext.Msg.alert('Update details', 'Saving failed');
      }
    })
  },

  //============================================
  //===============  CREATE  ===================
  //============================================

  /**
   * Добавляет новую запись в основную таблицу и переводит фокус на
   * редактирование полей
   */
  newItemResponse: function(data){
    Ext.MessageBox.hide();
    var response = JSON.parse(data.responseText).Variables;
    response = this.mixins.misc.renameIdFields( response );
    var record = Ext.create(this.store.model.$className, response);
    this.store.insert(0, record);
    this.fireEvent('closeDetail');
    this.isNewItem = true;
    this.openDetail(null, record);
    this.startEdit(record);
  },

  createNewItem: function() {
    Ext.MessageBox.wait('Creating new item...');
    Ext.Ajax.request({
      method: 'get',
      useDefaultXhrHeader: false,
      url:  this.api.create,
      success: this.newItemResponse,
      failure: function(){
        Ext.Msg.alert('Create supplier', 'Failed adding new supplier');
      },
      scope: this
    })
  },

  //============================================
  //================  READ  ====================
  //============================================

  /**
   * Клик по строке основной таблицы.
   */
  openDetail: function(sender, record) {
    if(
      this.getViewModel().get('detailIsLoading')
      || this.getViewModel().get('masterIsEditing')
    ){return};
    Ext.MessageBox.wait('Loading details...');
    this.getViewModel().set('currentItemId', record.get(this.ids.masterRecord))
    this.fireEvent('openDetail', record.get('active'), this.isNewItem);
  },

  //============================================
  //===============  UPDATE  ===================
  //============================================

  initUpdateUrl: function(){
    var id = this.ids.master;
    if(this.ids.master == 'store_id'){id = 'id'}
    if(this.ids.master == 'supplier_id'){id = 'id'}
    return this.api.update + '?' + id;
  },

  makeUpdateUrl: function(record, excludeFields = []){
    var url = this.initUpdateUrl() + '=' + record.get(this.ids.masterRecord);
    var me = this;

    this.store.model.fields.forEach(function(field, key){
      if(
        field.name != me.ids.master 
        && field.name != me.ids.masterRecord
        && !excludeFields.includes(field.name) 
      ){
        switch(field.name){
          case 'date':
            url += '&' + field.name + '=' + record.get(field.name).toISOString()
            break;
          default:
            url += '&' + field.name + '=' + encodeURIComponent(record.get(field.name))
            break;
        }
      }
    })
    return url;
  },

  findRecord(rowIndex){
    return this.store.data.items.find(function(item,key){
      if(key == rowIndex){ return true; }
    });
  },

  getToggleActiveRequestUrl: function(record){
    return this.makeUpdateUrl(record, ['active']) + '&active=' + !record.get('active');
  },

  toggleActive: function(ctx, rowIndex, checked, record){
    //record, приходящий в параметрах содержит объект только с одним
    //параметром beforecheckchange: "toggleActive". Явно не настоящий record.
    //Пытаемся самостоятельной найти запись.
    var active = active == undefined ? checked : active;
    var record = this.findRecord(rowIndex);
    if(this.getViewModel().get('currentItemId') == record.getData().id){
      if(checked){
        this.fireEvent('enableDetail');
      } else {
        this.fireEvent('disableDetail');
      }
    }
    var url = this.getToggleActiveRequestUrl(record)
    //this.store.commitChanges();
    Ext.Ajax.request({
      method: 'get',
      useDefaultXhrHeader: false,
      url: url,
      success: function(){
      }, 
      failure: function(err){
        console.log( err );
        Ext.Msg.alert('Update item', 'Failed, item was not changed activity');
      },
      scope: this
    })
  },

  onGridBeforeEdit: function(editor, ctx){
    return ctx.record.get('active');
  },

  onGridEdit: function(editor, ctx){
    this.updateRecord(ctx.record);
    if(!this.getViewModel().get('currentItemId')){
      this.deselectRow();      
    }
  },

  onGridCancelEdit: function(editor){
    this.getViewModel().set('masterIsEditing', false);
    if(!this.getViewModel().get('currentItemId')){
      this.deselectRow();      
    }
  },

  deselectRow: function(){
    var panel = this.getView().items.items[0];
    panel.getSelectionModel().deselectAll();
  },

  editItem: function(btn){
    var record = btn.getWidgetRecord();
    if(!record.get('active')){return;}
    this.startEdit(record);
  },

  startEdit: function(record){
    this.getViewModel().set('masterIsEditing', true)
    var grid = this.getView().items.items[0];
    grid.getPlugin('gridCellEditingPlugin').startEdit(record);
  },

  updateRecord: function(record){
    this.getViewModel().set('masterIsEditing', false)
    Ext.Ajax.request({
      method: 'get',
      useDefaultXhrHeader: false,
      url: this.makeUpdateUrl(record),
      success: function(a,b,c){
        this.store.commitChanges();
      },
      failure: function(a,b,c){
        Ext.Msg.alert('Update item', 'Failed, item was not updated');
      },
      scope: this
    })
  },

  //============================================
  //===============  DELETE  ===================
  //============================================

  /*
   *  Удаляем запись в основной таблице
   */
  deleteItem: function(btn) {
    var record = btn.getWidgetRecord();
    if(this.getViewModel().get('currentItemId') == record.get(this.ids.masterRecord)){
      this.fireEvent('closeDetail');
    }
    this.store.remove(record);

    Ext.Ajax.request({
      method: 'get',
      useDefaultXhrHeader: false,
      url: this.api.delete + '?' + this.ids.master + '=' + record.data.id,
      success: function(){
      },
      failure: function(){
        Ext.Msg.alert('Delete item', 'Failed, item was not deleted');
      }
    })
  },

});