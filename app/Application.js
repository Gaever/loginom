Ext.define('C.Application', {
    extend: 'Ext.app.Application',
    name: 'C',
    launch: function() {

    },
    onAppUpdate: function() {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function(choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

Ext.define('C.util.Utilities', {
    statics: {
        apiUrl: 'https://localhost/',
        //apiUrl: '/data.php/',
        apiCalcUrl: 'https://localhost/calc/'
    }
});