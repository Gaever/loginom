Ext.define('C.view.store.Viewport', {
    extend: 'Ext.Container',
    xtype: 'storeviewport',
    requires: [
        'C.store.Stores',
        'C.store.StoreDetails',

        'C.model.Store',
        'C.model.StoreDetail',

        'C.view.MasterController',
        'C.view.DetailController',

        'C.view.store.ViewModel',
        'C.view.store.Grid',
        'C.view.BaseForm',
    ],
    controller: 'master',
    viewModel: 'store',
    layout: 'border',
    items: [{
        region: 'center',
        xtype: 'storegrid',
        margin: '5 0 5 5'
    }, {
        region: 'east',
        xtype: 'container',
        layout: 'card',
        margin: '5 5 5 0',
        split: true,
        width: '50%',
        activeItem: 0,
        items: [{
            xtype: 'detailform'            
        }]
    }],
});
