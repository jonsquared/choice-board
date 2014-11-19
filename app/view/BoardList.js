Ext.define('ChoiceBoard.view.BoardList', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.data.Store',
        'Ext.List',
        'Ext.Menu'
    ],
    xtype: 'boardList',
    config: {
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            align: 'left',
            items: [{
                xtype: 'title',
                title: 'Choice Board'
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'add',
                iconMask: true,
                action: 'addChoiceBoard'
            }]
        }, {
            xtype: 'list',
            store: {
                model: 'ChoiceBoard.model.BoardList'
            },
            itemTpl: '<div>{name}</div>'
        }]
    },

    initialize: function() {
        this.callParent(arguments);

        this.down('list').getStore().on({
            addrecords: function() { this.fireEvent('change'); },
            removerecords: function() { this.fireEvent('change'); },
            updaterecord: function() { this.fireEvent('change'); },
            scope: this
        });
    }

});
