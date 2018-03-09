Ext.define('C.view.batch.BatchController', {
	extend: 'C.view.MasterController',
	alias: 'controller.batch',    

	init: function(){
    this.callParent(arguments);
		this.fetchActiveItemId();
		this.filterArchived();
	},

	//============================================
	//================  MISC  ====================
	//============================================

	fetchActiveItemId: function(){
		var me = this;
		this.store.on({
			load: function(){
				me.activeId = me.store.getActiveId()
				window.___batch_id = me.activeId;
			} 
		});
	},

	doCalculation: function(){
		var requestURLs = [
			this.mixins.misc.apiUrl() + 'api_method1?batch_id=' + this.activeId,
			this.mixins.misc.apiCalcUrl() + 'api_method2',
			this.mixins.misc.apiCalcUrl() + 'api_method3',
			this.mixins.misc.apiCalcUrl() + 'api_method4?batch_id=' + this.activeId
		]

		stage = 1;
		var requestQueue = requestURLs.map(function(requestUrl, key){
			return function(callback){
				var func = null;
				if(key == 0){
					func = function(response){
				  	if( JSON.parse(response.responseText).Variables.code_result === 1 ){
					  	stage++;
				  		callback(null);
				  	} else{
				  		Ext.MessageBox.hide();
				  		Ext.Msg.alert('Calculations', 'Calculations failed. Batch wasn\'t synchronized' );
				  	}
					}
				} else {
					func = function(){
				  	stage++;
				  	Ext.MessageBox.hide();
				  	callback(null); 
					}
				}

				Ext.MessageBox.wait('Calculating... Stage ' + (stage)+ '/' + requestURLs.length);
				Ext.Ajax.request({
				  method: 'get',
				  useDefaultXhrHeader: false,
				  url: requestUrl,
				  success: func,
				  failure: function(a){
				  	Ext.MessageBox.hide();
				  	Ext.Msg.alert('Calculations', 'Calculations failed');
				  }
				});
			}
		});

		this.mixins.misc.ajaxSeries(requestQueue, function(err, result){
			Ext.MessageBox.hide();
			if(err.length == 0){
				Ext.Msg.alert('Calculations', 'Calculations complete');
			} else {
				Ext.Msg.alert('Calculations', 'Calculations failed');
			}
		});
	},

	filterArchived: function(){
		var vm = this.getViewModel(),
				showArchived = vm.get('showArchived');

		this.store.clearFilter();
		if(showArchived){
			//Hide archived
			this.store.filterBy(function(record){
				return !record.get('archive');
			})
			vm.set('filterArchivedBtnText', vm.get('showArchivedBtnTxt'))
			vm.set('showArchived', false)
		} else {
			//Show archived
			this.store.filterBy(function(record){
				return true;
			})
			vm.set('filterArchivedBtnText', vm.get('hideArchivedBtnTxt'))
			vm.set('showArchived', true)
		}
	},

  //============================================
  //===============  CREATE  ===================
  //============================================

	newItemResponse: function(data){
  	this.store.each(function(record){
			record.set('active', false);
  	});
  	this.deselectRow();
  	this.activeId = JSON.parse(data.responseText).Variables[this.ids.master];
  	window.___batch_id = this.activeId;
		this.callParent(arguments);
	},

	//============================================
	//===============  UPDATE  ===================
	//============================================

	getToggleActiveRequestUrl: function(record){
		return this.mixins.misc.apiUrl() + 'api_method5?id=' + record.getData().id + '&active=True'
	},

	toggleActive(ctx, rowIndex, checked, record){
		var record = this.findRecord(rowIndex);
		if(record.data.active){ return false; }		
		this.activeId = record.getData().id;
		window.___batch_id = this.activeId;
    this.checkOnlyCheckbox();

		this.callParent(arguments);
	},

  checkOnlyCheckbox: function(){
  	var me = this;
  	this.store.each(function(record){
  		if( record.get('id') !== me.activeId ){
  			record.set('active', false);
  			if( record.get('id') == me.getViewModel().get('currentItemId') ){
  				me.fireEvent('disableDetail');
  			}
	  	}
  	})
  },

	toggleArchive: function(ctx, rowIndex, checked, record){
		var me = this, 
				archived = checked ? 'True' : 'False',
				record;

		this.store.data.items.forEach(function(item,key){
			if(key == rowIndex){ record = item }
		});

		Ext.Ajax.request({
			method: 'get',
			useDefaultXhrHeader: false,
			url:  this.api.update + 
						'?id=' + record.data.id + 
						'&archive=' + archived + 
						'&active=' + record.data.active,
			success: function(a,b,c){
			},
			failure: function(){
				Ext.Msg.alert('Update batch', 'Failed, batch was not set as archived');
			},
			scope: this
		})        
	},

	initUpdateUrl: function(){
		return this.api.update + '?' + 'id';
	},

	onGridBeforeEdit: function(editor, ctx){
		if(this.activeId != ctx.record.get('id')){return false;}		
	},

});
