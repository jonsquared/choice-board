Ext.define('ChoiceBoard.model.BoardList', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name:'id', type:'auto' },
        	{ name:'name', type:'string' },
            { name:'images' }
    	],
        proxy: {
            type: 'localstorage',
            id  : 'ChoiceBoard-list-data'
        }
    }
});