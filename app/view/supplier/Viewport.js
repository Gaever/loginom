Ext.define('C.view.supplier.Viewport', {
    extend: 'Ext.Container',
    xtype: 'supplierviewport',
    requires: [
        'C.store.Suppliers',
        'C.store.SupplierDetails',

        'C.model.Supplier',
        'C.model.SupplierDetail',

        'C.view.MasterController',
        'C.view.DetailController',

        'C.view.supplier.Grid',
        'C.view.BaseForm',
        'C.view.supplier.ViewModel',
    ],
    controller: 'master',
    viewModel: 'supplier',
    layout: 'border',
    items: [{
        region: 'center',
        xtype: 'suppliergrid',
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
