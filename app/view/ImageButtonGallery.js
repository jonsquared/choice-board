Ext.define('ChoiceBoard.view.ImageButtonGallery', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.data.Store',
        'Ext.dataview.DataView',
        'Ext.XTemplate'
    ],
    xtype: 'imageButtonGallery',
    config: {
        layout: 'fit',
        cls: 'contentPanel',
        //style: 'background: linear-gradient(to left top, blue, red);',
        items: [{
            xtype: 'dataview',
            store: {
                model: 'ChoiceBoard.model.Image'
            }
        }]
    },

    viewTpl: null,
    editTpl: null,

    constructor: function() {
        this.viewTpl = this.editTpl = new Ext.XTemplate(
            '<tpl if="src">',
                '<div class="image thumb-wrap" style="background-image:url({src})">',
            '<tpl else>',
                '<div class="image thumb-wrap">',
            '</tpl>',
            '</div>'
        );
        this.callParent(arguments);
    },

    initialize: function() {
        this.addListener({
            painted: this.setImageStyleSizes,
            scope: this
        });
        this.callParent(arguments);

        this.down('dataview').getStore().on({
            updaterecord: function() { this.fireEvent('change'); },
            scope: this
        });
    },

    getNumberOfPixelsInOneEm: function() {
        var sizeElem = Ext.getBody().createChild({
                tag: 'div',
                style: 'width:1em;'
            }),
            pixelsPerEm = parseFloat(sizeElem.getStyle('width'));
        sizeElem.destroy();
        return pixelsPerEm;
    },

    getOptimalGridInfo: function(desiredCellSizeInEms) {
        var viewportWidth = window.innerWidth,
            viewportHeight = window.innerHeight,
            pixelsPerEm = this.getNumberOfPixelsInOneEm(),
            cellSizeInPixels = desiredCellSizeInEms*pixelsPerEm,
            cellWidthRemainder = viewportWidth%cellSizeInPixels,
            cellHeightRemainder = viewportHeight%cellSizeInPixels,
            maxCellSizeRemainder, maxViewportSpace;

        if (cellWidthRemainder > cellHeightRemainder) {
            maxCellSizeRemainder = cellWidthRemainder;
            maxViewportSpace = viewportWidth;
        } else {
            maxCellSizeRemainder = cellHeightRemainder;
            maxViewportSpace = viewportHeight;
        }

        var numImages = Math.floor(maxViewportSpace/cellSizeInPixels),
            maxCellSizeRemainder = maxViewportSpace-numImages*cellSizeInPixels;
        if (maxCellSizeRemainder > cellSizeInPixels/2)
            numImages++;
        var cellSizeInPixels = Math.floor(maxViewportSpace/numImages);
/*
        return {
            numCols: Math.floor(viewportWidth/cellSizeInPixels),
            numRows: Math.floor(viewportHeight/cellSizeInPixels),
            cellSizeInPixels: cellSizeInPixels
        }
*/
        return {
            numCols: 4,
            numRows: 2,
            cellSizeInPixels: Math.floor(viewportWidth/4)
        }
    },

    setImageStyleSizes: function() {
        var viewportWidth = window.innerWidth,
            viewportHeight = window.innerHeight,
            gridInfo = this.getOptimalGridInfo(8),
            borderWidth = Math.floor(gridInfo.cellSizeInPixels/16),
            containerPadding = borderWidth,
            colSpace = viewportWidth - 2*borderWidth,
            rowSpace = viewportHeight - 2*borderWidth,
            cellWidth = colSpace/gridInfo.numCols,
            cellHeight = rowSpace/gridInfo.numRows,
            imageSize = Math.min(cellWidth,cellHeight),
            borderWidth = Math.floor(imageSize/14),
            colMargin = Math.floor((cellWidth-imageSize)/2),
            rowMargin = Math.floor((cellHeight-imageSize)/2);

        var styleSheet = document.styleSheets[0];

//TODO: this is overriding the natural image width/height and aspect ratio is being changed -- fix it!

        styleSheet.addRule('.image', '\
            width: '+(imageSize-2*borderWidth)+'px;\
            height: '+(imageSize-2*borderWidth)+'px;\
            float: left;\
            margin: '+(borderWidth+rowMargin)+'px '+(borderWidth+colMargin)+'px;\
            background-color: #000;\
            border: '+borderWidth+'px solid #999;\
            border-radius: '+borderWidth+'px;\
            background-size: cover;\
            background-position: center;\
            background-repeat: no-repeat;\
        ');
        styleSheet.addRule('.x-item-selected .image', '\
            border-color: #ff0;\
        ');
        styleSheet.addRule('.contentPanel', 'padding:'+containerPadding+'px');
    }
});
