Ext.define('C.model.Store', {
    extend: 'Ext.data.Model',
    idProperty: "store_id",
    fields: ['store_id', 'code', 'name', 'active']
});
