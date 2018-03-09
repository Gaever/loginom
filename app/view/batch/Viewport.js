Ext.define('C.view.batch.Viewport', {
    extend: 'Ext.Container',
    xtype: 'batchviewport',
    requires: [
        'C.model.Batch',
        'C.model.BatchDetail',

        'C.store.Batches',
        'C.store.BatchDetails',

        'C.view.batch.ViewModel',
        'C.view.batch.BatchController',
        'C.view.batch.DetailController',

        //'C.view.BaseForm',
        'C.view.batch.Form',
        'C.view.batch.Grid',
    ],
    items: [{
        region: 'center',
        xtype: 'batchgrid',
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
            xtype: 'batchform'
        }]
    }],
    layout: 'border',
    controller: 'batch',
    viewModel: 'batch',
});
