Ext.define('C.view.BaseForm', {
    extend: 'Ext.form.Panel',
    xtype: 'detailform',
    controller: 'detail',

    bind:{
        title:'{formTitle}',
    },
    autoScroll: true,
    bodyPadding: 5,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        anchor: '100%',
        allowBlank: true,
        msgTarget: 'under'
    },
    items: [],
    buttons: [{
        text: 'Save',
        action: 'save',
        handler:'updateDetails',
    }, {
        text: 'Clear',
        action: 'clear',
        handler:'clearDetails'
    }]
});
