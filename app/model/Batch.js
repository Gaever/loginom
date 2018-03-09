Ext.define('C.model.Batch', {
    extend: 'Ext.data.Model',
    idProperty: "batch_id",
    fields: ['batch_id', 'date', 'name', 'archive', 'active']
});
