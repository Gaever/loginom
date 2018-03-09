Ext.define('C.view.object.Tree', {
  extend: 'Ext.tree.Panel',
  xtype: 'objecttree',
  rootVisible: false,
  bind: {
    store: '{master}',
    title: '{treeTitle}'
  },
  useArrows: true,
  listeners: {
    select: 'openDetail',
    checkchange: 'toggleActive',
    //beforeselect: 'beforeSelect',
  },
  tbar:[{
    text: 'Deactivate all',
    handler: 'deactivateAll'
  }],
  viewConfig: {
    getRowClass: function(record, index, rowParams, store){
      return record.getData().active == 2 ? 'x-tree-semiactive' : '';
    }
  }

});
