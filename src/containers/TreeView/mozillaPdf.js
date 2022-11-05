export const FnScript = `
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
    loadPdf();
    function loadPdf() {
       

        var url = '@@pdfUrl';
        //console.log("pdf url" + url);
        //if (document.getElementById("treeView")) {
          //  document.getElementById("treeView").style.width = "33%";
           // document.getElementById("treeViewOperation").style.width = "66%";
      //  }
    //console.log("Width :" + document.getElementById('treeViewOperation').clientWidth);
    PDFJS.workerSrc = "./pdf.worker.js";
    var loadingTask = PDFJS.getDocument(url);
    var innerIndex = 1;
    loadingTask.promise.then(function (pdf) {
        //console.log('PDF loaded');
        var pageNumber = 1;
        pdfViewer = pdf;
        pdfViewer.currentPageNumber = 1;
        pdfViewer.scale = DEFAULT_SCALE;
        pdfViewer.currentScale = DEFAULT_SCALE;
        pdfViewer.isInPresentationMode = false;
        // Get div#container and cache it for later use
        var container = document.getElementById("pdf_view_container");
        //$("#pageCount").text("of " + pdf.numPages);
       // $("#currPageNumber").val("1");
        // Loop from 1 to total_number_of_pages in PDF document
        for (var i = 1; i <= pdf.numPages; i++) {

            // Get desired page
            pdf.getPage(i).then(function (page) {

                var scale = DEFAULT_SCALE;
                var viewport = page.getViewport(scale);
                var div = document.createElement("div");

                // Set id attribute with page-#{pdf_page_number} format
                div.setAttribute("id", "page-" + (page.pageIndex + 1));

                // This will keep positions of child elements as per our needs
                div.setAttribute("style", "position: relative; text-align:center;outline:0;");
                div.tabIndex = (page.pageIndex + 1);
                div.style.width = "inherit";
                div.addEventListener('keydown', function (event) {
                    //console.log("Key Pressed => " + event.keyCode);
                    if (event.keyCode === 37) {//Left Arrow Key
                        previousPage();
                        return true;
                    } else if (event.keyCode === 39) {
                        nextPage();
                        return true;

                    }
                }, false);
                // Append div within div#container
                container.appendChild(div);

                // Create a new Canvas element
                var canvas = document.createElement("canvas");

                // Append Canvas within div#page-#{pdf_page_number}
                div.appendChild(canvas);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // Render PDF page
                
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                   // var myElement = document.getElementById('page-' + innerIndex);

                   // canvas.toDataURL("image/png", 1);
                   // innerIndex += 1;
                });
                
            });
        }
       // fnLoaderHide("divLoader");
    }, function (reason) {
            // PDF loading error
            console.error(reason);
           // fnLoaderHide("divLoader");
        });
    }
`;