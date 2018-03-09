Ext.define('C.view.object.ObjectController', {
  extend: 'C.view.MasterController',
  alias: 'controller.object',

  init: function(){
    this.callParent(arguments);
    this.cbClicked = false;
    var a= Ext.select('.x-tree-semiactive');
  },

  getFetchDictValuesRequestUrl: function(dictId){
    return this.api.readDictionary + '?' + this.ids.dict + '=' + dictId;
  },

  openDetail: function(sender, record) {
    //Предотвращаем открытие детализации если кликнули на чекбокс
    window.requestAnimationFrame(function(){
      if(this.cbClicked){
        this.cbClicked = false;
        this.deselectRow();
        return;
      }
      if(this.getViewModel().get('detailIsLoading')){return};
      Ext.MessageBox.wait('Loading details...');
      this.getViewModel().set('currentItemType', record.get('object_type'))
      this.getViewModel().set('currentItemId', record.get('object_id'))
      this.fireEvent('openDetail', record.get('active'));
    }.bind(this))
  },

  deactivateAll: function(){
    var records = this.getView().items.items[0].getChecked(), 
        me = this;
    var _records = records.filter(function(record){
      if(record.getData().object_type == 3){ 
        record.cascadeBy(function(record){
          record.set('checked', 0);
          record.set('active', 0);
        });
        me.setActivesUp(record.parentNode);
        return true; 
      }
    })

    this.cbClicked = false;
    var requestQueue = _records.map(function(record){
      return function(callback){
        var url = me.api.update + '?' + 
                  'batch_id=' + window.___batch_id + 
                  //'batch_id=57' + 
                  '&object_id=' + record.getData().object_id + 
                  '&object_type=' + record.getData().object_type + 
                  '&object_code=' + encodeURIComponent(record.getData().object_code) + 
                  '&object_name=' + encodeURIComponent(record.getData().object_name) + 
                  '&object_active=0';
        Ext.Ajax.request({
          method: 'get',
          useDefaultXhrHeader: false,
          url: url,
          success: function(){
            record.set('checked', false);
            callback(null);
          },
          failure: function(a,b,c){
            Ext.Msg.alert('Update tree', 'Failed updating tree');
          },
          scope: this
        })
      }
    });


    this.mixins.misc.ajaxSeries(requestQueue, function(err, results){
      Ext.MessageBox.hide();
      if(err.length != 0){
        Ext.Msg.alert('Update tree', 'Failed updating tree');
      }
    });
  },

  toggleActive: function(node, checked){
    var me = this;
    this.cbClicked = true;
    node.cascadeBy(function(node){
      node.set('checked', checked);
      node.set('active', checked ? 1 : 0);
    });

    this.setActivesUp(node.parentNode);

    var active = checked ? '1' : '0';
    var requestQueue =  [ 
      function(callback){
        var url = me.api.update + '?' + 
                  'batch_id=' + window.___batch_id + 
                  //'batch_id=57' + 
                  '&object_id=' + node.getData().object_id + 
                  '&object_type=' + node.getData().object_type + 
                  '&object_code=' + encodeURIComponent(node.getData().object_code) + 
                  '&object_name=' + encodeURIComponent(node.getData().object_name) + 
                  '&object_active=' + active;

        Ext.Ajax.request({
          method: 'get',
          useDefaultXhrHeader: false,
          url: url,
          success: function(){callback(null);},
          failure: function(err){callback(err);},
          scope: this
        })
      }
    ];

    this.mixins.misc.ajaxSeries(requestQueue, function(err, result){
      if(err.length == 0){
      } else {
        Ext.Msg.alert('Update tree', 'Setting activity failed');
      }
    })

    if(
      this.getViewModel().get('currentItemId') == node.getData().object_id
      && this.getViewModel().get('currentItemType') == node.getData().object_type
    ){
      if(checked){
        this.fireEvent('enableDetail');
      } else {
        this.fireEvent('disableDetail');
      }
      this.cbClicked = false;
    }
  },

  setActivesUp: function(node){
    if(node== null){return;}
    var isActive = node.childNodes.find(function(child){ return child.get('checked') == 0; }) == undefined;
    var isInactive = node.childNodes.find(function(child){ return child.get('checked') == 1; }) == undefined;
    var isSemiactive = !isActive && !isInactive;


    if(isSemiactive){ node.set('active', 2); node.set("checked", true); } 
    else if(isActive){ node.set('active', 1); node.set("checked", true) } 
    else if (isInactive){ node.set('active', 0); node.set("checked", false) }

    if(node.get('parent_id') !== null){
      this.setActivesUp(node.parentNode);      
    }
  },

});
