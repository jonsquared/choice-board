Ext.define('ChoiceBoard.controller.ImageButtonGallery', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.XTemplate',
        'Ext.data.identifier.Uuid'
    ],

    config: {
        refs: {
            imageButtonGalleryView: 'imageButtonGallery',
            gallery: 'imageButtonGallery dataview'
        },

        control: {
            'imageButtonGallery dataview': {
                itemtap: 'showImageMenu'
            },
            'imageButtonGallery menu button[action=browse]': {
                tap: 'browseForImage'
            },
            'imageButtonGallery menu button[action=photo]': {
                tap: 'takePhoto'
            },
            'imageButtonGallery menu button[action=remove]': {
                tap: 'showRemoveImageConfirmation'
            },
            'imageButtonGallery menu button': {
                tap: 'hideImageMenu'
            }

        }
    },

    isEditMode: false,
    imageMenu: null,
    guidGenerator: null,

    constructor: function() {
        this.guidGenerator = Ext.create('Ext.data.identifier.Uuid');
        this.callParent(arguments);
    },

    setEditMode: function(isEditMode) {
        this.isEditMode = isEditMode;
        this.updateItemTpl();
    },

    updateItemTpl: function() {
        var view = Ext.Viewport.getAt(1),
            tpl = this.isEditMode ? view.editTpl : view.viewTpl;
        if (this.getGallery().getItemTpl() !== tpl)
            this.getGallery().setItemTpl(tpl);
    },

    getSelectedRecord: function() {
        return this.getGallery().getSelection()[0] || null;
    },

    createImageMenu: function() {
        this.imageMenu = Ext.create('Ext.Menu', {
            items: [{
                text: 'Choose an existing image',
                iconCls: 'photos',
                action: 'browse'
            },{
                text: 'Take a photo',
                iconCls: 'camera',
                action: 'photo'
            },{
                text: 'Remove',
                iconCls: 'delete',
                action: 'remove'
            },/*{
                text: 'Settings',
                iconCls: 'settings',
                action: 'settings'
            },*/{
                text: 'Cancel',
                action: 'cancel'
            }]
        });
        this.getImageButtonGalleryView().add(this.imageMenu);
    },

    showImageMenu: function() {
        if (!this.isEditMode)
            return;
        if (!this.imageMenu)
            this.createImageMenu();
        this.imageMenu.show();
    },

    browseForImage: function() {
        Ext.device.Camera.capture({
            quality: 100,
            source: 'library',
            destination: 'data',
            encoding: 'jpg',
            width: 128,
            height: 128,
            success: this.onGetPhotoSuccess,
            failure: this.onGetPhotoFail,
            scope: this
        });
    },

    takePhoto: function() {
        Ext.device.Camera.capture({
            quality: 100,
            source: 'camera',
            destination: 'data',
            encoding: 'jpg',
            width: 128,
            height: 128,
            success: this.onGetPhotoSuccess,
            failure: this.onGetPhotoFail,
            scope: this
        });
    },

    testImageIndex: 0,

    onGetPhotoSuccess: function(imageData) {
        var context = this,
            record = this.getSelectedRecord();
        //<debug>
        testImages = [
           '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'
        ];
        if(imageData.indexOf('http:')==0)
            imageData = testImages[this.testImageIndex++];
        //</debug>

        this.saveImageDataToFile(imageData, function(url) {
            context.getSelectedRecord().set('src',url);
        });
    },

    onGetPhotoFail: function(message) {
        alert(message);
    },

    saveImageDataToFile: function(imageData, callback) {
        var context = this,
            data = this.convertBase64StringToBlob(imageData,'image/jpeg'),
            id = this.guidGenerator.generate();
        this.getApplication().fileSystem.fs.root.getFile(
            'ChoiceBoard/'+id+'.jpg',
            {create: true, exclusive: false},
            function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        callback(fileEntry.toURL());
                    };

                    fileWriter.onerror = function(e) {
                        alert('Write failed: ' + e.toString());
                    };

                    fileWriter.write(data);

                }, context.errorHandler);
            },
            context.errorHandler
        );
    },

    errorHandler: function(e) {
      var msg = '';

      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error Code:'+e.code;
          break;
      };

      alert(msg);
    },

    convertBase64StringToBlob: function(data, mimeType) {
        var raw = atob(data),
            rawLength = raw.length,
            array = new Uint8Array(rawLength);

        for (var i=0; i<rawLength; i++)
            array[i] = raw.charCodeAt(i);

        return this.convertArrayToBlob(array, mimeType);
    },

    convertArrayToBlob: function(array, mimeType) {
        var blob = null;
        try{
            blob = new Blob( [array], {type : mimeType});
        }
        catch(e){
            // TypeError old chrome and FF
            window.BlobBuilder = window.BlobBuilder || 
                                 window.WebKitBlobBuilder || 
                                 window.MozBlobBuilder || 
                                 window.MSBlobBuilder;
            if(e.name == 'TypeError' && window.BlobBuilder){
                var bb = new BlobBuilder();
                bb.append(array.buffer);
                blob = bb.getBlob(mimeType);
            }
            else if(e.name == "InvalidStateError"){
                // InvalidStateError (tested on FF13 WinXP)
                blob = new Blob( [array.buffer], {type : mimeType});
            }
            else{
                // We're screwed, blob constructor unsupported entirely   
            }
        }
        return blob;
    },

    showRemoveImageConfirmation: function() {
        Ext.Msg.confirm(
            'Remove Image',
            'Are you sure you would like to remove this image?',
            this.handleRemoveImageConfirmation,
            this
        );
    },

    handleRemoveImageConfirmation: function (buttonId) {
        if (buttonId == 'yes')
            this.getSelectedRecord().set('src','');
    },

    hideImageMenu: function() {
        this.imageMenu.hide();
    }   
});