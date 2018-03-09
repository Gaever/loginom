Ext.define('C.model.StoreDetail', {
    extend: 'Ext.data.Model',
    idProperty: "store_parameter_id",
    fields: ['store_parameter_id', 'name', 'description', 'value']
});
