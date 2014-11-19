Ext.define('ChoiceBoard.model.Image', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
        	{ name:'id', type:'auto' },
        	{ name:'src', type:'string' }
    	],
    	identifier: 'uuid'
    }
});