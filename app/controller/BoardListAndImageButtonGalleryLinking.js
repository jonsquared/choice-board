Ext.define('ChoiceBoard.controller.BoardListAndImageButtonGalleryLinking', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            'imageButtonGallery': {
                change: 'saveData'
            }
        }
    },

    saveData: function() {
        var boardListController = this.getApplication().getController('BoardList'),
            imageButtonGalleryController = this.getApplication().getController('ImageButtonGallery'),
            imageStore = imageButtonGalleryController.getGallery().getStore(),
            imageData = [];

        for (var i=0; i<imageStore.getCount(); i++)
            imageData[i] = imageStore.getAt(i).getData();
        boardListController.getSelectedRecord().set('images',imageData);
    }
});