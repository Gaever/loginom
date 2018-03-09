Ext.define('C.view.DetailController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.detail',

  mixins: {
    misc: 'C.mixin.Misc'
  },

  init: function(){
    var vm = this.getViewModel();
    this.store = vm.getStore('details');
    this.api = this.mixins.misc.getApi(this);
    this.ids = this.mixins.misc.mapIdFieldNames(this);
  },

  listen: {
    controller: {
      '*': {
        openDetail: 'onOpenDetail',
        closeDetail: 'onCloseDetail',
        enableDetail: 'enableDetail',
        disableDetail: 'disableDetail',
        clearDetails: 'clearDetails'
      }
    }
  },

  //============================================
  //================  READ  ====================
  //============================================

  onOpenDetail: function(isActiveId, isNewItem){
    this.isNewItem = isNewItem;
    this.itemId = this.getViewModel().get('currentItemId');
    if( this.itemId !== 0 && !this.itemId){
      Ext.Msg.alert('Load details', 'Loading details failed');
      return;
    }
    this.itemIdIsActiveId = isActiveId;
    this.fetchDetails();
  },

  onCloseDetail: function(){
    var form = this.getView();
    this.getViewModel().set('currentItemId', null)
    form.removeAll();
  },

  getFetchDetailsRequestUrl(){
    return this.api.read + '?' + this.ids.master + '=' + this.itemId;
  },

  disableDetail: function(){
    var form = this.getView();
    form.query('button').forEach(function(btn){
      btn.setDisabled(true);
    });
    form.query('combobox').forEach(function(combobox){
      combobox.disable()
    })
  },

  enableDetail:function(){
    var form = this.getView();
    form.query('button').forEach(function(btn){
      btn.setDisabled(false);
    })
    form.query('combobox').forEach(function(combobox){
      combobox.enable()
    })
  },

  /*
   *  Подгружаем с сервера детальную информацию по пакету
   */
  fetchDetails: function(){
    var form = this.getView();

    if(!this.itemIdIsActiveId){
      this.disableDetail()
    } else {
      this.enableDetail()
    }

    var url = this.getFetchDetailsRequestUrl()
    this.store.proxy.setConfig('url', url);
    this.store.load({
      callback: this.showDetails,
      scope: this
    })
  },

  /**
   * Отобразить все строки параметра детализации
   */
  showDetails: function(detailsRows){
    var form = this.getView(), me = this;
    this.dictionary = Ext.clone(this.getViewModel().get('dictionary'));

    form.removeAll(true);
    var requestQueue = detailsRows.map(function(detailRow){
      return function(callback){
        me.showDetail(detailRow, callback);
      }
    });

    this.mixins.misc.ajaxSeries(requestQueue, function(err, results){
      Ext.MessageBox.hide();
      if(err.length == 0){
        me.getViewModel().set('detailIsLoading', false);
      } else {
        Ext.Msg.alert('Load details', 'Loading details failed');
      }
    });
  },

  
  /**
   * Отобразить одну строку параметра детализации
   */
  showDetail: function(detailRow, callback){
    var form = this.getView(),
        dictValues = this.dictionary.shift();

    var states = Ext.create('Ext.data.Store', {
      fields: ['name'],
      data: dictValues
    });

    var o = {
      labelWidth: '50%',
      displayField:'name',
      store: states,
      editable: true,
      disabled: !this.itemIdIsActiveId,        
      name: detailRow.data.name,
      value: this.isNewItem ? null : detailRow.data.value,
      fieldLabel: detailRow.data.description,
    }, _o = {};      
    _o[this.ids.dict] = detailRow.data[this.ids.dict]; //id field
    Ext.apply(o, _o);
    var el = Ext.create('Ext.form.field.ComboBox', o);
    form.add(el);
    this.isNewItem = false;
    callback(null, el);
  },

  //============================================
  //===============  UPDATE  ===================
  //============================================

  getUpdateDetailsRequestUrl: function(item){
    return this.api.detailUpdate + 
            '?' + this.ids.master + '=' + this.itemId +
            '&' + this.ids.dict +'=' + item[this.ids.dict] +
            '&value=' + item.getRawValue();
  },

  /*
   *  Обновляем данные в детальной таблице
   */
  updateDetails: function(btn,a){
    var form = this.getView(), me = this
    //Собираем очередь URL-ов на обновление каждого параметра
    var requestURLs = form.items.items.map(function(item){
      //Сохраняем только измененные поля
      if(item.isDirty()){
        return this.getUpdateDetailsRequestUrl(item);
      }
    }.bind(this));
    requestURLs = requestURLs.filter(function(item){
      return item !== undefined;
    })

    //Последовательно выполняем запросы
    var requestQueue = requestURLs.map(function(requestUrl){
      return function(callback){
        Ext.Ajax.request({
          method: 'get',
          useDefaultXhrHeader: false,
          url: requestUrl,
          success: function(){callback(null)},
          failure: function(err){callback(err)}
        })
      }
    });

    Ext.MessageBox.wait('Saving...');
    //По завершению последнего запроса обновляем store детальной таблицы
    this.mixins.misc.ajaxSeries(requestQueue, function(err, result){
      Ext.MessageBox.hide();
      if(err.length == 0){
        //Формируем поля для оновления store
        var newFields = [];
        form.items.items.map(function(formItem){
          me.store.data.items.map(function(storeItem, key){
            if(formItem.name == storeItem.data.name){
              storeItem.data.value = formItem.value;
              newFields.push(storeItem);
            }             
          })
        })
        //Обновляем store
        me.store.setFields(newFields);
        me.store.commitChanges();
      } else {
        Ext.Msg.alert('Update details', 'Saving failed');
      }
    })
  },

  clearDetails: function(){
    var form = this.getView();

    form.items.items.forEach(function(item){
      item.setValue(null);
    });
  },

});