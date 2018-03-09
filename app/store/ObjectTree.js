Ext.define('C.store.ObjectTree', {
	extend: 'Ext.data.TreeStore',
	alias: 'store.ObjectTree',
	autoLoad: true,
	proxy:{
		type:'ajax',
		method:'GET',
		useDefaultXhrHeader: false,
		url: C.util.Utilities.apiUrl + 'object_select',
		reader: {
			type: 'json',
			prepareNode: function(node){
				if(node.type_name){
					node.text = node.type_name.replace(/-/g,'') + ' - ' + node.object_name;					
				}
				if(node.object_type == 1){
					node.leaf = true;
				}
				node.checked = node.active ? true : false;
			},
			growTree: function(data, parentNode = {}){
				parentNode.children = data.filter(function(node){
					var isRoot = (
						!parentNode.object_id 
						&& !parentNode.object_type
						&& node.parent_id === null
					);
					var isChild = (
						node.object_type == parentNode.object_type - 1 
						&& node.parent_id == parentNode.object_id
					);
					if(isRoot || isChild){
						this.growTree(data, node);
						return true;
					} 
				}.bind(this))
				this.prepareNode(parentNode);
				return parentNode
			},
			transform: {
				fn: function(data){
					var tree = this.growTree(data.DataSet.Rows);
					return tree;
				}, 
			},
		},
		writer: {
			type: 'json',
		},  
	},

})