/// <reference path="pdf .worker.js" />
var pdfViewer = null;
var CSS_UNITS = 96.0 / 72.0;
var DEFAULT_SCALE_VALUE = 'auto';
var DEFAULT_SCALE = 1.0;
var MIN_SCALE = 0.10;
var MAX_SCALE = 10.0;
var UNKNOWN_SCALE = 0;
var MAX_AUTO_SCALE = 1.25;
var SCROLLBAR_PADDING = 40;
var VERTICAL_PADDING = 5;
var fullscreenDiv = null;
var fullscreenFunc = null;
var selectedThumb = null;
var FIRST_PAGE = 1;
var ROTATE = 0;
var LAST_PAGE = 0;
var NONE = "none";
var ODD = "odd";
var EVEN = "even";
var SPREAD = NONE;
var SCALE = DEFAULT_SCALE;

function _base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function loadMozPdf(filesrc) {
  
    PDFViewerApplication.open(_base64ToArrayBuffer(filesrc));
}
