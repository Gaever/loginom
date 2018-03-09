Ext.define('C.view.object.Viewport', {
    extend: 'Ext.Container',
    xtype: 'objectviewport',
    requires: [
        'C.store.ObjectTree',
        'C.store.ObjectDetails',

        'C.model.ObjectDetail',

        'C.view.BaseForm',

        'C.view.object.ObjectModel',
        'C.view.object.ObjectController',
        'C.view.object.ObjectDetailController',
        'C.view.object.Tree',
    ],
    items: [{
        region: 'center',
        xtype: 'objecttree',
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
            xtype: 'detailform',
            controller: 'objectdetail'
        }]
    }],
    layout: 'border',
    controller: 'object',
    viewModel: 'object',
});
