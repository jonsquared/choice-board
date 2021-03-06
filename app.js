/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'ChoiceBoard',

    requires: [
        'Ext.MessageBox',
        'Ext.device.Camera',
        'Ext.device.FileSystem'
    ],

    models: [
        'Image',
        'BoardList'
    ],

    views: [
        'BoardList',
        'ImageButtonGallery'
    ],

    controllers: [
        'BoardList',
        'ImageButtonGallery',
        'BoardListAndImageButtonGalleryLinking'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    fileSystem: null,

    launch: function() {
        var context = this;
        this.initDevice(function() {
            // Destroy the #appLoadingIndicator element
            Ext.fly('appLoadingIndicator').destroy();

            Ext.Viewport.add(Ext.create('ChoiceBoard.view.BoardList'));
            Ext.Viewport.add(Ext.create('ChoiceBoard.view.ImageButtonGallery'));

            context.getController('BoardList').loadData();            
        });
    },

    initDevice: function(callback) {
        this.initBackButtonEvents();

        Ext.device.FileSystem.requestFileSystem({
            type: window.PERSISTENT,
            size: 5*1024*1024,
            success: function(fileSystem) {
                this.fileSystem = fileSystem;
                callback();
            },
            failure: function(error) {
                alert("FileSystem Error: Could not access the local file system.");
            },
            scope: this
        });
    },

    initBackButtonEvents: function() {
        if (Ext.os.is('Android')) {
            document.addEventListener("backbutton", Ext.bind(onBackKeyDown, this), false);

            function onBackKeyDown(e) {   
                e.preventDefault();
                Ext.Viewport.setActiveItem(0);
            }
        }
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
