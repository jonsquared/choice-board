Ext.define('ChoiceBoard.controller.BoardList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            boardList: 'boardList',
            list: 'boardList list'
        },

        control: {
            'button[action=addChoiceBoard]': {
                tap: 'showAddBoardPrompt'
            },
            'boardList': {
                change: 'saveData'
            },
            'boardList list': {
                itemtap: 'showBoardMenu'
            },
            'boardList menu button[action=view]': {
                tap: 'viewBoard'
            },
            'boardList menu button[action=rename]': {
                tap: 'showRenameBoardPrompt'
            },
            'boardList menu button[action=edit]': {
                tap: 'editBoard'
            },
            'boardList menu button[action=delete]': {
                tap: 'showDeleteBoardConfirmation'
            },
            'boardList menu button': {
                tap: 'hideBoardMenu'
            }
        }
    },

    itemMenu: null,

    loadData: function() {
        this.getList().getStore().load();
    },

    saveData: function() {
        this.getList().getStore().sync();
    },

    getSelectedRecord: function() {
        return this.getList().getSelection()[0] || null;
    },

    viewBoard: function() {
        this.goToBoardView(this.getSelectedRecord(),false);
    },

    editBoard: function() {
        this.goToBoardView(this.getSelectedRecord(),true);
    },

    goToBoardView: function(record, isEditMode) {
        var boardView = Ext.Viewport.getAt(1),
            boardViewController = this.getApplication().getController('ImageButtonGallery');
        boardViewController.setEditMode(isEditMode);
        boardViewController.getGallery().getStore().setData(record.get('images'));
        Ext.Viewport.setActiveItem(1);
    },

    createBoardMenu: function() {
        this.itemMenu = Ext.create('Ext.Menu', {
            items: [{
                text: 'View',
                action: 'view'
            },{
                text: 'Rename',
                iconCls: 'compose',
                action: 'rename'
            },{
                text: 'Edit',
                iconCls: 'compose',
                action: 'edit'
            },{
                text: 'Delete',
                iconCls: 'delete',
                action: 'delete'
            },{
                text: 'Cancel',
                action: 'cancel'
            }]
        });
        this.getBoardList().add(this.itemMenu);
    },

    showBoardMenu: function() {
        if (!this.itemMenu)
            this.createBoardMenu();
        this.itemMenu.show();
    },

    hideBoardMenu: function() {
        this.itemMenu.hide();
    },

    showAddBoardPrompt: function() {
        Ext.Msg.prompt(
            'Add Choice Board',
            'What would you like to name it?',
            this.handleAddConfirmation,
            this,
            false,
            null,
            {
                placeHolder: 'Enter name...'
            }
        );
    },

    handleAddConfirmation: function (buttonId, value) {
        if (buttonId == 'ok' && value)
            this.createBoard(value);
    },

    createBoard: function(name) {
        this.getList().getStore().add({
            name: name,
            images: [{src:''},{src:''},{src:''},{src:''},{src:''},{src:''},{src:''},{src:''}]
        });
    },

    showRenameBoardPrompt: function() {
        Ext.Msg.prompt(
            'Rename Choice Board',
            'What would you like to name it?',
            this.handleRenameConfirmation,
            this,
            false,
            this.getSelectedRecord().get('name'),
            {
                placeHolder: 'Enter name...'
            }
        );
    },

    handleRenameConfirmation: function (buttonId, value) {
        if (buttonId == 'ok' && value)
            this.getSelectedRecord().set('name',value);
    },

    showDeleteBoardConfirmation: function() {
        Ext.Msg.confirm(
            'Delete Choice Board',
            'Are you sure you would like to delete '+this.getSelectedRecord().get('name')+'?',
            this.handleDeleteConfirmation,
            this
        );
    },

    handleDeleteConfirmation: function (buttonId) {
        if (buttonId == 'yes')
            this.getList().getStore().remove(this.getSelectedRecord());
    }

});