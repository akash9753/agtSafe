
var controlID = "";
var forsavecoordsJson = "";
window.savedTextAnnotID = [];
window.predictText = "";
window.isHaveMapping = false;

var pdfSessionStorage = { AddBookLink: false };
function initDoc() {
    controlID = sessionStorage.getItem("controlID");
    forsavecoordsJson = "";
    window.savedTextAnnotID = [];
    if (!JSON.parse(sessionStorage.projectStudyLockStatus)) {
        addContextMenuForBookmark();
    }
}

function slideupAdvancedOptions() {

    jQuery("#advancedOptionsPdfBody").slideUp();
    var faf = jQuery("#pdfCollapseFa");
    if (faf.hasClass('fa fa-fw fa-chevron-down')) {
        faf.removeClass("fa fa-fw fa-chevron-down").addClass("fa fa-fw fa-chevron-right");
    }
}

function addTextAnnotation(elem) { //To Show text annotation dialog
    defaultAnnotStyle = {
        fill: true,
        annot_fillColor: "#FFFFFF",
        autoSize: true,
        borderWidth: 0.015,
        annot_strokeColor: "#0000FF",
        fontStyle: 0,
        fontSize: 10,
        annot_foreColor: "#0000FF",
        opacity: 1,
        annotText: "",
        alignment: 1,
        lineAlignment: 0,
        stroke: true
    };
    customEllipseVar = 0;
    DocuViewareAPI.AddTextAnnotInteractive(controlID, defaultAnnotStyle, true, ["annotText", "annot_foreColor", "annot_fillColor", "annot_strokeColor", "stroke"]);
    var annot_SrcText = jQuery("#annot_SrcText" + controlID);
    annot_SrcText.css("display", "inline-block");
    var strokeCheckbox = jQuery("#annot_strokeCheck" + controlID);
    strokeCheckbox.css("display", "inline-block");
    slideupAdvancedOptions();
    $("#annotationDialogForm" + controlID).addClass("customtextannotclass");
}


function addLineArrow(elem) { //To show line annotation dialog
    defaultStyle = {
        annot_strokeColor: "#0000FF",
        borderWidth: 0.01,
    };
    customEllipseVar = 0;
    DocuViewareAPI.AddLineAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor"]);
    slideupAdvancedOptions();
}
function addLineWithCircle(elem) { //To show line annotation dialog
    defaultStyle = {
        annot_strokeColor: "#0000FF",
        borderWidth: 0.01,
        squaredBox: true,
    };
    customEllipseVar = 0;
    DocuViewareAPI.AddLineAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor"]);
    slideupAdvancedOptions();
}
function addEclipse(elem) { //To show eclipse annotation dialog
    defaultStyle = {
        annot_strokeColor: "#0000FF",
        borderWidth: 0.01,
        fill: true,
        annot_fillColor: "#0000FF",
        squaredBox: false,
        opacity: 1,
        stroke: true,
    };
    customEllipseVar = 0;
    DocuViewareAPI.AddEllipseAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor", "annot_fillColor", "fill", "opacity"]);
    slideupAdvancedOptions();
}

customEllipseVar = 0;

function addEclipse1(elem) { //To show eclipse annotation dialog
    defaultStyle = {
        annot_fillColor: "#0000FF",
        annot_strokeColor: "#0000FF",
        borderWidth: 0.01,
        squaredBox: true,
    };

    customEllipseVar = 1;
    DocuViewareAPI.AddCustomCircleLineAnnotInteractive(controlID, defaultStyle, false, []);
}

function addRect(elem) { //To show react annotatation dialog
    defaultStyle = {
        annot_strokeColor: "#0000FF",
        borderWidth: 0.01,
        fill: true,
        annot_fillColor: "#FFFFFF",
        opacity: 1
    };
    customEllipseVar = 0;
    DocuViewareAPI.AddRectangleAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor", "annot_fillColor", "fill", "opacity"]);
    slideupAdvancedOptions();
}

function resetMouseMode(elem) { //To reset button css on mouse out
    jQuery(elem).removeClass("button_active");
    jQuery(elem).css("fill", "rgb(100, 100, 100)");
    DocuViewareAPI.SetMouseMode(controlID, 0);
    allPdfComp.dom.updateButtons();
}

function resetMouseModeOfMultiple(ids) { //To reset button css on mouse out

    jQuery("#" + ids[0] + ",#" + ids[1]).removeClass("button_active");
    jQuery("#" + ids[0] + ",#" + ids[1]).css("fill", "rgb(100, 100, 100)");
    jQuery("#" + ids[0] + ",#" + ids[1]).attr("mouseMode", 0);
    DocuViewareAPI.SetMouseMode(controlID, 0);
    allPdfComp.dom.updateButtons();
}




function addButtonHover(elem) { //add button hover css style
    jQuery(elem).addClass("button_hover");
    allPdfComp.dom.updateButtons();
}

function removeButtonHover(elem) { //Removing button hover on mouse out
    jQuery(elem).removeClass("button_hover");
    allPdfComp.dom.updateButtons();
}

function fnCopyAnnot() {
    var e = document.getElementById(controlID);
    if (e) {
        e.control.CustomCopyAnnotationButton_Click();
    }
}
function ToggleHeaderContent(e) {
    if (e.id && (e.id === "dv-toolbar-contentHideBtn" + controlID || e.id === "dv-mobile-toolbar-contentHideBtn" + controlID)) {
        $("#dv-toolbar-contentHide" + controlID + "," + "#dv-mobile-toolbar-contentHide" + controlID).hide();
        $("#dv-toolbar-contentShow" + controlID + "," + "#dv-mobile-toolbar-contentShow" + controlID).show();
        window.ToggleHeader(false);
    } else {
        $("#dv-toolbar-contentHide" + controlID + "," + "#dv-mobile-toolbar-contentHide" + controlID).show();
        $("#dv-toolbar-contentShow" + controlID + "," + "#dv-mobile-toolbar-contentShow" + controlID).hide();
        window.ToggleHeader(true);
    }
    $("#control" + controlID).height("100%");
    window.dispatchEvent(new Event('resize'))
    DocuViewareAPI.UpdateLayout(sessionStorage.controlID);
}

function addButtonsToSnapIn() { //Adding all required buttons to pdf viewer
    //Adding ToggleMouse Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="ToggleMouseMode' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#ToggleMouseMode" + controlID).append('<button id="selectMouseModeButton' + controlID + '" mouseMode=0 style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="toggleMouseMode(this,false);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Select Mode"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M0 2.655c0 44.976 0 89.952 0 134.929 18.57 0 37.141 0 55.712 0 0 78.942 0 157.883 0 236.825-18.57 0-37.141 0-55.712 0 0 45.864 0 91.728 0 137.591 45.861 0 91.722 0 137.583 0 0-18.57 0-37.141 0-55.712 78.945 0 157.888 0 236.833 0 0 18.57 0 37.141 0 55.712 45.861 0 91.722 0 137.584 0 0-45.861 0-91.722 0-137.583-18.568 0-37.135 0-55.704 0 0-78.945 0-157.888 0-236.833 18.567 0 37.135 0 55.702 0 0-45.862 0-91.722 0-137.583-45.861 0-91.721 0-137.58 0 0 18.57 0 37.141 0 55.712-78.942 0-157.885 0-236.827 0 0-18.57 0-37.141 0-55.712-45.863 0-91.725 0-137.589 0v2.655zM111.413 26.169c0 28.417 0 56.836 0 85.253-28.415 0-56.83 0-85.245 0 0-28.418 0-56.836 0-85.253 28.415 0 56.83 0 85.245 0zM485.832 26.169c0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 28.416 0 56.832 0 85.248 0zM374.416 81.872c0 18.57 0 37.141 0 55.712 18.57 0 37.141 0 55.712 0 0 78.945 0 157.888 0 236.833-18.57 0-37.141 0-55.712 0 0 18.568 0 37.135 0 55.704-78.942 0-157.885 0-236.827 0 0-18.568 0-37.135 0-55.704-18.57 0-37.139 0-55.709 0 0-78.945 0-157.888 0-236.833 18.57 0 37.139 0 55.709 0 0-18.57 0-37.141 0-55.712 78.942 0 157.885 0 236.827 0zM61.023 400.584c16.8 0 33.599 0 50.398 0 0 28.416 0 56.832 0 85.248-28.418 0-56.836 0-85.253 0 0-28.416 0-56.832 0-85.248 11.618 0 23.236 0 34.854 0zM450.983 400.584c11.616 0 23.233 0 34.849 0 0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 16.8 0 33.599 0 50.399 0z"></path></svg></button>');

    //For adding bookmark and link
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="AddingBookLink' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#AddingBookLink" + controlID).append('<button   id = "addingBookLinkButton' + controlID + '" mouseMode = 0  style = "margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class= "dv-button highlight" type = "button" onclick = "toggleMouseMode(this,true);" onmouseover = "addButtonHover(this)" onmouseout = "removeButtonHover(this)" title = "Add Bookmark & Link " > <svg viewBox="0 0 5 5" width="100%" height="100%"><path d="M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z"></path></svg></button > ');

    //Adding TextAnnotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="TextAnnotBtn' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#TextAnnotBtn" + controlID).append('<button id="AddtextAnnotBtn" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addTextAnnotation(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Annotation"><svg viewBox="0 0 512 512" width="100%" height="100%"><g><path d="M43.419,109l-2.444,88h30.453l3.074-27.874c0.604-4.992,1.576-9.444,2.995-13.384c1.394-3.995,3.521-7.271,6.385-10.003c2.864-2.732,6.595-4.948,11.14-6.418c4.573-1.472,10.221-2.32,17-2.32H149v241.824c0,6.463-0.991,11.612-2.174,15.448c-1.182,3.836-2.992,6.727-5.041,8.829c-2.075,2.049-4.596,3.343-7.38,3.973c-2.811,0.683-5.99,0.926-9.378,0.926H107v24h155v-24h-18.951c-3.258,0-6.252-0.243-9.063-0.926c-2.785-0.63-5.256-1.961-7.384-4.009c-2.128-2.103-3.721-4.976-4.903-8.812c-1.182-3.836-1.698-8.967-1.698-15.43V137h36.056c6.751,0,12.428,0.865,16.973,2.337c4.572,1.471,8.275,3.638,11.142,6.371c2.889,2.733,5.018,6.075,6.41,10.069c1.392,3.94,2.391,8.342,2.968,13.333L296.86,197h30.215l-2.208-88H43.419z"></path><polygon points="471,28 471,0 416.925,0 389.875,0 336,0 336,28 390,28 390,485 336,485 336,512 471,512 471,485 417,485 417,28 	"></polygon></g></svg></button>');
    
    //Adding Line Annotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="ArrowBtn' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#ArrowBtn" + controlID).append('<button id="AddArrowBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addLineArrow(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Line"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M18.027,508.886c-3.465,0-6.93-1.322-9.574-3.968c-5.29-5.289-5.29-13.858,0-19.147L484.646,9.604c5.289-5.29,13.858-5.29,19.147,0c5.289,5.289,5.289,13.858,0,19.148L27.601,504.918C24.956,507.563,21.491,508.886,18.027,508.886z"></path></svg></button>');

    //Adding Line with Annotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="LineWithCircleBtn' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#LineWithCircleBtn" + controlID).append('<button id="AddLineWithCircleBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addLineWithCircle(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Line With Round Cap"><svg viewBox="0 0 512 300" width="100%" height="100%"><path d="M18.027,508.886c-3.465,0-6.93-1.322-9.574-3.968c-5.29-5.289-5.29-13.858,0-19.147L484.646,9.604c5.289-5.29,13.858-5.29,19.147,0c5.289,5.289,5.289,13.858,0,19.148L27.601,504.918C24.956,507.563,21.491,508.886,18.027,508.886z"></path><g stroke="black" stroke-width="99" fill="black"><circle cx="402" cy="90" r="60"></circle></g></svg></button>');

    //Adding Eclipse Annotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="EclipseBtn' + controlID + '" class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#EclipseBtn" + controlID).append('<button id="AddEclipseBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addEclipse(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Eclipse">' +
        '<svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M256,475C114.579,475-0.474,375.635-0.474,253.5S114.579,32,256,32c141.42,0,256.475,99.365,256.475,221.5S397.42,475,256,475z M256,55.315c-128.567,0-233.158,88.914-233.158,198.185c0,109.293,104.591,198.185,233.158,198.185c128.555,0,233.157-88.892,233.157-198.185C489.156,144.229,384.555,55.315,256,55.315z"></path></svg></button>');

    //Adding Round Annotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="EclipseBtn1' + controlID + '"class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#EclipseBtn1" + controlID).append('<button id="AddEclipseBtn1' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addEclipse1(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Round">'+
        '<svg  version="1.1" id="Layer_1" height="10px" x="0px" y="0px" viewBox="0 0 512 512" ' +
            'style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
            '<g>' +
                '<g>' +
                    '<path d="M256,0C115.39,0,0,115.39,0,256s115.39,256,256,256s256-115.39,256-256S396.61,0,256,0z"/>' +
                '</g>' +
            '</g>'+
        '</svg ></button > ');

    //Adding Rectangle Annotation Button
    jQuery("#"+controlID+"_snapin_panel_Annotation").append('<div id="RectBtn' + controlID + '"class="dv-buttons-container" style="padding:15px;"></div>');
    jQuery("#RectBtn" + controlID).append('<button id="AddRectBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addRect(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Rectangle"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M500.984,475H12.015C5.58,475,1,470.943,1,464.485V45.368C1,38.955,5.58,32,12.015,32h488.97C507.42,32,512,38.955,512,45.368v419.117C512,470.943,507.42,475,500.984,475z M23,451h467V56H23V451z"></path></svg></button>');

    //Adding Text Annotaion Input to dialoglin
    jQuery("#annotationDialogFormContainer" + controlID).append('<div id="annot_text' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;">' +
        '<div  class="flexdiv">' +
                '<div id="annot_text_label' + controlID + '" class="dv-form-line-label">' +
                    '<label for="annot_text_input' + controlID + '">Annotation Text</label>' +
               '</div > ' +
               '<div id="annot_text_control' + controlID + '" class="dv-form-line-control-large">' +
                    '<span class="ant-input-wrapper ant-input-group">' +
                        '<span class="ant-input-affix-wrapper">' +
                             '<input type ="text" onkeyup="validatevartext(this)" name="annot_text_input' + controlID + '" type="text" id="annot_text_input' + controlID + '" style="width: 100%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);" >' +
                                 '<span style="display:none" id="annotTextParentSpan' + controlID + '" class="annotTextParentSpan ant-input-suffix ">' +
                                    '<span role="button" aria-label="close-circle" tabindex="-1" class="anticon anticon-close-circle ant-input-clear-icon">' +
                                        '<i class="fas fa-check annotextsuffixiconcheck" style="color:green" onclick="toggleAnnotTextBoxIcon()"></i>' +
                                        '<i class="fas fa-times annotextsuffixicon" style="color:red" onclick="fnToClearAnnotText()" ></i>' +
                                 '</span >' +
                                '</span >' +
                                 '<span id="var_text_errormessage_span' + controlID + '" class="annot_spanerror"></span>' +
                     '</span >' +
                  '</span >' +
            '</div>'+
          '</div></div > ');

    //Adding Check Box
    jQuery("#annotationDialogFormContainer" + controlID).append('<div id="annot_strokeCheck' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;">' +
        '<div class="flexdiv">'+
        '<div id="annot_strokeCheck_label' + controlID + '" class="dv-form-line-label">' +
            '<label for="annot_strokeCheck_input' + controlID + '">Stroke</label>' +
        '</div>' +
        '<div id="annot_strokeCheck_control' + controlID + '" class="dv-form-line-control-large">' +
            '<input name="annot_strokeCheck_input' + controlID + '" type="checkbox" id="annot_strokeCheck_input' + controlID + '" style="width: 93%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);">' +
        '</div >' +
        '</div >' +
        '</div > ');
    //jQuery("#annotationDialogFormContainer" + controlID).append('<div id="annot_linkCheck' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_linkCheck_label' + controlID + '" class="dv-form-line-label"><label for="annot_linkCheck_input' + controlID + '">Link with Source Variable?</label></div><div id="annot_linkCheck_control' + controlID + '" class="dv-form-line-control-large"><input name="annot_linkCheck_input' + controlID + '" type="checkbox" onclick="linkSource(this)" id="annot_linkCheck_input' + controlID + '" style="width: 93%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
    
    //Adding Text Annotaion Input to dialog
    jQuery("#annotationDialogFormContainer" + controlID).prepend('<div id="annot_SrcText' + controlID + '" class="dv-form-line dv-annotation-control" style="display: block;">' +
        '<div  class="flexdiv">' +
        '<div id="annot_SrcText_label' + controlID + '" class="dv-form-line-label">' +
        '<label for="annot_SrcText_input' + controlID + '">Source Domain/Variable</label>' +
        '</div > <div id="annot_SrcText_control' + controlID + '" class="dv-form-line-control-large">' +
        '<div>' +
            '<div class="input-group">' +
                    '<input onkeyup="validatesrctext(this)" type ="text" class= "form-control addsourcefield annot_SrcText_input' + controlID + '" name="annot_SrcText_input' + controlID + '" type="text" id="annot_SrcText_input' + controlID + '" >' +
                    '<span class = "input-group-addon" style="cursor:pointer" onclick="fnToAddSourceTextbox()">+</span>' +
            '</div>' +
            '<span id="src_text_errormessage_span' + controlID + '" class="annot_spanerror"></span>' +
        '</div > ' +
        '</div>' +
        '</div>' +
        '</div > ');
    //PredictText 
    jQuery("#annotationDialogFormContainer" + controlID).prepend('<div id="annot_PredictText' + controlID + '" class="dv-form-line dv-annotation-control" style="display: block;">' +
        '<div  class="flexdiv">' +
        '<div id="annot_PretictText_label' + controlID + '" class="dv-form-line-label">' +
        '   <label for="annot_PredictText_input' + controlID + '">Predict Text</label>' +
        '</div > ' +
        '<div id="annot_PredictText_control' + controlID + '" class="dv-form-line-control-large">' +
        '<p id="annot_PredictText_input' + controlID + '" class="predict_text_annotation"></p>'+
        '</div>' +
        '</div>'+
    '</div > ');

    //Mapping CheckBox
    jQuery("#annotationDialogFormContainer" + controlID).prepend('<div id="annot_Mapcheck' + controlID + '" class="dv-form-line dv-annotation-control" style="display: block;">' +
        '<div  class="flexdiv">' +
        '<div id="annot_Mapcheck_label' + controlID + '" class="dv-form-line-label">' +
        '<label for="annot_Mapcheck_input' + controlID + '">Add To Mapping' +
        '</label > ' +
        '</div>' +
        ' <div id="annot_Mapcheck_control' + controlID + '" class="dv-form-line-control-large">' +
        '<input style="width: 93%;border-color: rgb(100, 100, 100);color: rgb(100, 100, 100);" ' +
            'type ="checkbox" ' +
            'class= "form-control addsourcefield annot_Mapcheck_input' + controlID + '" ' +
            'name = "annot_Map_input' + controlID + '" ' +
            'id = "annot_Mapcheck_input' + controlID + '"' +
            'onchange ="fnAddToMapping(this)"> ' +
        '</div>' +
        '</div>' +
        '</div> ');

    var collpasePanel = '   <div class="pdfCollapseContainer" class="dv-form-line dv-annotation-control" >  ' +
        '       <div id="pdfCollapseContainerHeader" style="margin-top:20px; margin-bottom:20px"><span><i id="pdfCollapseFa" class="fa fa-fw fa-chevron-right"></i> Advanced Options</span>  ' +
        '       </div>  ' +
        '       <div id="advancedOptionsPdfBody" class="content">  ' +
        '       </div>  ' +
        '  </div>  ';

    jQuery("#annotationDialogFormContainer" + controlID).append(collpasePanel);

    jQuery("#pdfCollapseContainerHeader").click(function () {
        $header = jQuery(this);
        $content = $header.next();
        $content.slideToggle(500, function () {
            if ($content.is(":visible")) {
                jQuery("#pdfCollapseFa").removeClass("fa fa-fw fa-chevron-right").addClass("fa fa-fw fa-chevron-down");
            } else {
                jQuery("#pdfCollapseFa").removeClass("fa fa-fw fa-chevron-down").addClass("fa fa-fw fa-chevron-right");
            }
        });
    });
    jQuery("#annot_text" + controlID).on('show', function () {
        $header = jQuery("#pdfCollapseContainerHeader");
        $content = $header.next();
        $content.slideUp();
    });
   

    //Adding Fore Color Input to dialog
    jQuery("#advancedOptionsPdfBody").append('<div id="annot_foreColor' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_foreColor_label' + controlID + '" class="dv-form-line-label"><label for="annot_foreColor_input' + controlID + '">Text Color</label></div><div id="annot_foreColor_control' + controlID + '" class="dv-form-line-control-large"><input name="annot_foreColor_input' + controlID + '" type="color" class="color" id="annot_foreColor_input' + controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');

    //Adding Fill Color Input to dialog
    jQuery("#advancedOptionsPdfBody").append('<div id="annot_fillColor' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_fillColor_label' + controlID + '" class="dv-form-line-label"><label for="annot_fillColor_input' + controlID + '">Fill Color</label></div><div id="annot_fillColor_control' + controlID + '" class="dv-form-line-control-large"><input  name="annot_fillColor_input' + controlID + '" type="color"  class="color" id="annot_fillColor_input' + controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');

    //Adding Stroke Color Input to dialog
    jQuery("#advancedOptionsPdfBody").append('<div id="annot_strokeColor' + controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_strokeColor_label' + controlID + '" class="dv-form-line-label"><label for="annot_strokeColor_input' + controlID + '">Stroke Color</label></div><div id="annot_strokeColor_control' + controlID + '" class="dv-form-line-control-large"><input name="annot_strokeColor_input' + controlID + '" class="color" type="color" id="annot_strokeColor_input' + controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
    jQuery("#annotationActionButtons" + controlID).append('<div id="AddCopyAnnot' + controlID + '" style="fill: rgb(100, 100, 100); height: 16px; width: 16px; float: left;" title="Copy Annotation" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnCopyAnnot();"><svg class="svg-icon" viewBox="0 0 20 20"><path d="M17.927,5.828h-4.41l-1.929-1.961c-0.078-0.079-0.186-0.125-0.297-0.125H4.159c-0.229,0-0.417,0.188-0.417,0.417v1.669H2.073c-0.229,0-0.417,0.188-0.417,0.417v9.596c0,0.229,0.188,0.417,0.417,0.417h15.854c0.229,0,0.417-0.188,0.417-0.417V6.245C18.344,6.016,18.156,5.828,17.927,5.828 M4.577,4.577h6.539l1.231,1.251h-7.77V4.577z M17.51,15.424H2.491V6.663H17.51V15.424z"></path></svg></div>');

    //Adding Stroke Color Input to dialog
    jQuery("#annotationActionButtons" + controlID).append('<div  class="booklink" id="Bookmark' + controlID + '" style="fill: rgb(100, 100, 100); float: left;" title="Add Bookmark" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnForToAddBookmarkOrInternalLink(0);">Add Bookmark</div>');
    jQuery("#annotationActionButtons" + controlID).append('<div   class="booklink" id="InternalLink' + controlID + '" style="fill: rgb(100, 100, 100); float: left;" title="Add InternalLink" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnForToAddBookmarkOrInternalLink(1);">Add InternalLink</div>');

    //Context for internallink
    jQuery("#annotationActionButtons" + controlID).append('<div  class="internalLinkContext" id="EditLink' + controlID + '" style="width:100%;fill: rgb(100, 100, 100); float: left;" title="Edit" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnForToEditAndDeleteInternalLink(0);">Edit</div>');
    jQuery("#annotationActionButtons" + controlID).append('<div   class="internalLinkContext" id="DeleteLink' + controlID + '" style="width:100%;margin-top:5px;fill: rgb(100, 100, 100); float: left;" title="Delete" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnForToEditAndDeleteInternalLink(1);">Delete</div>');
}

function isLockedfnDesktopViewCustomBtn() {


    //BAcK Button
    jQuery(".dv-toolbar-buttons").prepend('<div onclick="window.backToTreeview()" id="dv-toolbar-back' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-back" + controlID).append('<button id="dv-toolbar-backBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Back">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve">' +
        '<path style = "fill:#1E201D;" d = "M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" />' +
        '</svg>' +
        '</button>');
    //Show Header Content Button
    $(".dv-logo").html("");
    jQuery(".dv-toolbar" + controlID).append('<div id="dv-toolbar-contentShow' + controlID + '" class="dv-buttons-container"  style="padding-right:12px;"></div>');
    jQuery("#dv-toolbar-contentShow" + controlID).append('<button id="dv-toolbar-contentShowBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        '<g>' +
        '<path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.733,204.705L232.119,334.324c-3.614,3.614-7.9,5.428-12.849,5.428   c-4.948,0-9.229-1.813-12.847-5.428L76.804,204.705c-3.617-3.615-5.426-7.898-5.426-12.845c0-4.949,1.809-9.235,5.426-12.851   l29.119-29.121c3.621-3.618,7.9-5.426,12.851-5.426c4.948,0,9.231,1.809,12.847,5.426l87.65,87.65l87.65-87.65   c3.614-3.618,7.898-5.426,12.847-5.426c4.949,0,9.233,1.809,12.847,5.426l29.123,29.121c3.621,3.616,5.428,7.902,5.428,12.851   C367.164,196.807,365.357,201.09,361.733,204.705z" />' +
        '</g ></svg>' +
        '</button>');

    //Hide Header Content Button
    jQuery(".dv-toolbar" + controlID).append('<div id="dv-toolbar-contentHide' + controlID + '" class="dv-buttons-container"  style="display:none;padding-right:12px;"></div>');
    jQuery("#dv-toolbar-contentHide" + controlID).append('<button id="dv-toolbar-contentHideBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        ' <g>' +
        ' <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.74,259.517l-29.123,29.129c-3.621,3.614-7.901,5.424-12.847,5.424   c-4.948,0-9.236-1.81-12.847-5.424l-87.654-87.653l-87.646,87.653c-3.616,3.614-7.898,5.424-12.847,5.424   c-4.95,0-9.233-1.81-12.85-5.424l-29.12-29.129c-3.617-3.607-5.426-7.898-5.426-12.847c0-4.942,1.809-9.227,5.426-12.848   l129.62-129.616c3.617-3.617,7.898-5.424,12.847-5.424s9.238,1.807,12.846,5.424L361.74,233.822   c3.613,3.621,5.424,7.905,5.424,12.848C367.164,251.618,365.357,255.909,361.74,259.517z" />' +
        '</g ></svg>' +
        '</button>');

    //for Close
   // $("#docuViewareLogo" + controlID).append('<div id="fnClose' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
  //  $("#fnClose" + controlID).append('<div id="Close' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="highlight dv-button dv-dropdown" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" onclick="ConfirmationBeforeCancel();" title="Close Document"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469 c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304 c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path></svg></div>');


    $(".highlight").click(function (elem) {
        if (!$(this).hasClass("button_active")) {
            removeHighlightOfBtn();
            $(this).addClass("button_active");
            $(this).css("fill", "rgb(3, 130, 212)");
        } else {
            removeHighlightOfBtn();
        }
    });
}
//For Desktop
function fnDesktopViewCustomBtn() {

    //FnSave Button
    jQuery(".dv-toolbar-buttons").prepend('<div id="fnSave' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#fnSave" + controlID).prepend('<div id="Save' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="dv-button dv-dropdown highlight"  onclick="fnToSavePDFDetails();" title="Save"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path></svg></div>');

    //BAcK Button
    jQuery(".dv-toolbar-buttons").prepend('<div onclick="window.backToTreeview()" id="dv-toolbar-back' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-back" + controlID).append('<button id="dv-toolbar-backBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Back">' +
         '<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve">'+
            '<path style = "fill:#1E201D;" d = "M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" />'+
         '</svg>' +
        '</button>');
    

    //Adding ToggleMouse Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-ToggleMouseMode' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-ToggleMouseMode" + controlID).append('<button id="dv-toolbar-selectMouseModeButton' + controlID + '" mouseMode=0 style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="toggleMouseMode(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Select Mode"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M0 2.655c0 44.976 0 89.952 0 134.929 18.57 0 37.141 0 55.712 0 0 78.942 0 157.883 0 236.825-18.57 0-37.141 0-55.712 0 0 45.864 0 91.728 0 137.591 45.861 0 91.722 0 137.583 0 0-18.57 0-37.141 0-55.712 78.945 0 157.888 0 236.833 0 0 18.57 0 37.141 0 55.712 45.861 0 91.722 0 137.584 0 0-45.861 0-91.722 0-137.583-18.568 0-37.135 0-55.704 0 0-78.945 0-157.888 0-236.833 18.567 0 37.135 0 55.702 0 0-45.862 0-91.722 0-137.583-45.861 0-91.721 0-137.58 0 0 18.57 0 37.141 0 55.712-78.942 0-157.885 0-236.827 0 0-18.57 0-37.141 0-55.712-45.863 0-91.725 0-137.589 0v2.655zM111.413 26.169c0 28.417 0 56.836 0 85.253-28.415 0-56.83 0-85.245 0 0-28.418 0-56.836 0-85.253 28.415 0 56.83 0 85.245 0zM485.832 26.169c0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 28.416 0 56.832 0 85.248 0zM374.416 81.872c0 18.57 0 37.141 0 55.712 18.57 0 37.141 0 55.712 0 0 78.945 0 157.888 0 236.833-18.57 0-37.141 0-55.712 0 0 18.568 0 37.135 0 55.704-78.942 0-157.885 0-236.827 0 0-18.568 0-37.135 0-55.704-18.57 0-37.139 0-55.709 0 0-78.945 0-157.888 0-236.833 18.57 0 37.139 0 55.709 0 0-18.57 0-37.141 0-55.712 78.942 0 157.885 0 236.827 0zM61.023 400.584c16.8 0 33.599 0 50.398 0 0 28.416 0 56.832 0 85.248-28.418 0-56.836 0-85.253 0 0-28.416 0-56.832 0-85.248 11.618 0 23.236 0 34.854 0zM450.983 400.584c11.616 0 23.233 0 34.849 0 0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 16.8 0 33.599 0 50.399 0z"></path></svg></button>');

    //For adding bookmark and link
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-AddingBookLink' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-AddingBookLink" + controlID).append('<button id="dv-toolbar-addingBookLinkButton' + controlID + '" mouseMode=0  style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="toggleMouseMode(this,true);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Bookmark & Link "><svg viewBox="0 0 5 5" width="100%" height="100%"><path d="M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z"></path></svg></button>');

    //Adding TextAnnotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-TextAnnotBtn' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-TextAnnotBtn" + controlID).append('<button id="dv-toolbar-AddtextAnnotBtn" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addTextAnnotation(this);" onmouseover="addButtonHover(this,true)" onmouseout="removeButtonHover(this)" title="Add Annotation"><svg viewBox="0 0 512 512" width="100%" height="100%"><g><path d="M43.419,109l-2.444,88h30.453l3.074-27.874c0.604-4.992,1.576-9.444,2.995-13.384c1.394-3.995,3.521-7.271,6.385-10.003c2.864-2.732,6.595-4.948,11.14-6.418c4.573-1.472,10.221-2.32,17-2.32H149v241.824c0,6.463-0.991,11.612-2.174,15.448c-1.182,3.836-2.992,6.727-5.041,8.829c-2.075,2.049-4.596,3.343-7.38,3.973c-2.811,0.683-5.99,0.926-9.378,0.926H107v24h155v-24h-18.951c-3.258,0-6.252-0.243-9.063-0.926c-2.785-0.63-5.256-1.961-7.384-4.009c-2.128-2.103-3.721-4.976-4.903-8.812c-1.182-3.836-1.698-8.967-1.698-15.43V137h36.056c6.751,0,12.428,0.865,16.973,2.337c4.572,1.471,8.275,3.638,11.142,6.371c2.889,2.733,5.018,6.075,6.41,10.069c1.392,3.94,2.391,8.342,2.968,13.333L296.86,197h30.215l-2.208-88H43.419z"></path><polygon points="471,28 471,0 416.925,0 389.875,0 336,0 336,28 390,28 390,485 336,485 336,512 471,512 471,485 417,485 417,28 	"></polygon></g></svg></button>');

    //Adding Line Annotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-ArrowBtn' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-ArrowBtn" + controlID).append('<button id="dv-toolbar-AddArrowBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addLineArrow(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Line"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M18.027,508.886c-3.465,0-6.93-1.322-9.574-3.968c-5.29-5.289-5.29-13.858,0-19.147L484.646,9.604c5.289-5.29,13.858-5.29,19.147,0c5.289,5.289,5.289,13.858,0,19.148L27.601,504.918C24.956,507.563,21.491,508.886,18.027,508.886z"></path></svg></button>');

    //Adding Line with Annotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-LineWithCircleBtn' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-LineWithCircleBtn" + controlID).append('<button id="dv-toolbar-AddLineWithCircleBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addLineWithCircle(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Line With Round Cap"><svg viewBox="0 0 512 300" width="100%" height="100%"><path d="M18.027,508.886c-3.465,0-6.93-1.322-9.574-3.968c-5.29-5.289-5.29-13.858,0-19.147L484.646,9.604c5.289-5.29,13.858-5.29,19.147,0c5.289,5.289,5.289,13.858,0,19.148L27.601,504.918C24.956,507.563,21.491,508.886,18.027,508.886z"></path><g stroke="black" stroke-width="99" fill="black"><circle cx="402" cy="90" r="60"></circle></g></svg></button>');

    //Adding Eclipse Annotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-EclipseBtn' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-EclipseBtn" + controlID).append('<button id="dv-toolbar-AddEclipseBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addEclipse(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Eclipse"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M256,475C114.579,475-0.474,375.635-0.474,253.5S114.579,32,256,32c141.42,0,256.475,99.365,256.475,221.5S397.42,475,256,475z M256,55.315c-128.567,0-233.158,88.914-233.158,198.185c0,109.293,104.591,198.185,233.158,198.185c128.555,0,233.157-88.892,233.157-198.185C489.156,144.229,384.555,55.315,256,55.315z"></path></svg></button>');

    //Adding Round Annotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-EclipseBtn1' + controlID + '"class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-EclipseBtn1" + controlID).append('<button id="dv-toolbar-AddEclipseBtn1' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addEclipse1(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Round">' +
        '<svg  version="1.1" id="Layer_1" height="10px" x="0px" y="0px" viewBox="0 0 512 512" ' +
         'style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
         '<g>' +
            '<g>' +
                 '<path d="M256,0C115.39,0,0,115.39,0,256s115.39,256,256,256s256-115.39,256-256S396.61,0,256,0z"/>' +
            '</g>' +
        '</g>' +
        '</svg ></button >')

    //Adding Rectangle Annotation Button
    jQuery(".dv-toolbar-buttons").append('<div id="dv-toolbar-RectBtn' + controlID + '"class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#dv-toolbar-RectBtn" + controlID).append('<button id="dv-toolbar-AddRectBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="addRect(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Rectangle"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M500.984,475H12.015C5.58,475,1,470.943,1,464.485V45.368C1,38.955,5.58,32,12.015,32h488.97C507.42,32,512,38.955,512,45.368v419.117C512,470.943,507.42,475,500.984,475z M23,451h467V56H23V451z"></path></svg></button>');

    //Show Header Content Button
    $(".dv-logo").html("");
    jQuery(".dv-toolbar").append('<div id="dv-toolbar-contentShow' + controlID + '" class="dv-buttons-container"  style="padding-right:12px;"></div>');
    jQuery("#dv-toolbar-contentShow" + controlID).append('<button id="dv-toolbar-contentShowBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        '<g>' +
        '<path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.733,204.705L232.119,334.324c-3.614,3.614-7.9,5.428-12.849,5.428   c-4.948,0-9.229-1.813-12.847-5.428L76.804,204.705c-3.617-3.615-5.426-7.898-5.426-12.845c0-4.949,1.809-9.235,5.426-12.851   l29.119-29.121c3.621-3.618,7.9-5.426,12.851-5.426c4.948,0,9.231,1.809,12.847,5.426l87.65,87.65l87.65-87.65   c3.614-3.618,7.898-5.426,12.847-5.426c4.949,0,9.233,1.809,12.847,5.426l29.123,29.121c3.621,3.616,5.428,7.902,5.428,12.851   C367.164,196.807,365.357,201.09,361.733,204.705z" />' +
        '</g ></svg>' +
        '</button>');

    //Hide Header Content Button
    jQuery(".dv-toolbar").append('<div id="dv-toolbar-contentHide' + controlID + '" class="dv-buttons-container"  style="display:none;padding-right:12px;"></div>');
    jQuery("#dv-toolbar-contentHide" + controlID).append('<button id="dv-toolbar-contentHideBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        ' <g>' +
        ' <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.74,259.517l-29.123,29.129c-3.621,3.614-7.901,5.424-12.847,5.424   c-4.948,0-9.236-1.81-12.847-5.424l-87.654-87.653l-87.646,87.653c-3.616,3.614-7.898,5.424-12.847,5.424   c-4.95,0-9.233-1.81-12.85-5.424l-29.12-29.129c-3.617-3.607-5.426-7.898-5.426-12.847c0-4.942,1.809-9.227,5.426-12.848   l129.62-129.616c3.617-3.617,7.898-5.424,12.847-5.424s9.238,1.807,12.846,5.424L361.74,233.822   c3.613,3.621,5.424,7.905,5.424,12.848C367.164,251.618,365.357,255.909,361.74,259.517z" />' +
        '</g ></svg>' +
        '</button>');

    //for Close
    //$("#docuViewareLogo" + controlID).append('<div id="fnClose' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    //$("#fnClose" + controlID).append('<div id="Close' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="highlight dv-button dv-dropdown" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" onclick="ConfirmationBeforeCancel();" title="Close Document"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469 c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304 c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path></svg></div>');

    
    $(".highlight").click(function (elem) {
        if (!$(this).hasClass("button_active")) {
            removeHighlightOfBtn();
            $(this).addClass("button_active");
            $(this).css("fill", "rgb(3, 130, 212)");
        } else {
            removeHighlightOfBtn();
        }
    });
   
}
function isLockedfnMobileViewCustomBtn() {
    jQuery("#docuViewareLogoMobile" + controlID).prepend('<div onclick="window.backToTreeview()" id="dv-mobile-toolbar-back' + controlID + '" class="dv-buttons-container" ></div>');
    jQuery("#dv-mobile-toolbar-back" + controlID).append('<button id="dv-mobile-toolbar-backBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Back">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve">' +
        '<path style = "fill:#1E201D;" d = "M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" />' +
        '</svg>' +
        '</button>');

    //Show Header Content Button
    jQuery(".dv-toolbar-menu").append('<div id="dv-mobile-toolbar-contentShow' + controlID + '" class="dv-buttons-container"  style="float:right;padding-right:12px;"></div>');
    jQuery("#dv-mobile-toolbar-contentShow" + controlID).append('<button id="dv-mobile-toolbar-contentShowBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        '<g>' +
        '<path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.733,204.705L232.119,334.324c-3.614,3.614-7.9,5.428-12.849,5.428   c-4.948,0-9.229-1.813-12.847-5.428L76.804,204.705c-3.617-3.615-5.426-7.898-5.426-12.845c0-4.949,1.809-9.235,5.426-12.851   l29.119-29.121c3.621-3.618,7.9-5.426,12.851-5.426c4.948,0,9.231,1.809,12.847,5.426l87.65,87.65l87.65-87.65   c3.614-3.618,7.898-5.426,12.847-5.426c4.949,0,9.233,1.809,12.847,5.426l29.123,29.121c3.621,3.616,5.428,7.902,5.428,12.851   C367.164,196.807,365.357,201.09,361.733,204.705z" />' +
        '</g ></svg>' +
        '</button>');

    //Hide Header Content Button
    jQuery(".dv-toolbar-menu").append('<div id="dv-mobile-toolbar-contentHide' + controlID + '" class="dv-buttons-container"  style="float:right;display:none;padding-right:12px;"></div>');
    jQuery("#dv-mobile-toolbar-contentHide" + controlID).append('<button id="dv-mobile-toolbar-contentHideBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        ' <g>' +
        ' <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.74,259.517l-29.123,29.129c-3.621,3.614-7.901,5.424-12.847,5.424   c-4.948,0-9.236-1.81-12.847-5.424l-87.654-87.653l-87.646,87.653c-3.616,3.614-7.898,5.424-12.847,5.424   c-4.95,0-9.233-1.81-12.85-5.424l-29.12-29.129c-3.617-3.607-5.426-7.898-5.426-12.847c0-4.942,1.809-9.227,5.426-12.848   l129.62-129.616c3.617-3.617,7.898-5.424,12.847-5.424s9.238,1.807,12.846,5.424L361.74,233.822   c3.613,3.621,5.424,7.905,5.424,12.848C367.164,251.618,365.357,255.909,361.74,259.517z" />' +
        '</g ></svg>' +
        '</button>');


    //for Close
    $(".dv-mobile-buttons-container").append('<div id="mobile-fnClose' + controlID + '" class="dv-buttons-container" style="float:left;padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    $("#mobile-fnClose" + controlID).append('<div id="mobile-Close' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="highlight dv-button dv-dropdown"  onclick="ConfirmationBeforeCancel();" title="Close Document"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469 c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304 c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path></svg></div>');

}
//For Mobile
function fnMobileViewCustomBtn() {

    //Back To TreeView
    //BAcK Button
    jQuery("#docuViewareLogoMobile" + controlID).prepend('<div onclick="window.backToTreeview()" id="dv-mobile-toolbar-back' + controlID + '" class="dv-buttons-container" ></div>');
    jQuery("#dv-mobile-toolbar-back" + controlID).append('<button id="dv-mobile-toolbar-backBtn' + controlID + '" style="fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Back">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve">' +
        '<path style = "fill:#1E201D;" d = "M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" />' +
        '</svg>' +
        '</button>');

    //Show Header Content Button
    jQuery(".dv-toolbar-menu").append('<div id="dv-mobile-toolbar-contentShow' + controlID + '" class="dv-buttons-container"  style="float:right;padding-right:12px;"></div>');
    jQuery("#dv-mobile-toolbar-contentShow" + controlID).append('<button id="dv-mobile-toolbar-contentShowBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        '<g>' +
        '<path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.733,204.705L232.119,334.324c-3.614,3.614-7.9,5.428-12.849,5.428   c-4.948,0-9.229-1.813-12.847-5.428L76.804,204.705c-3.617-3.615-5.426-7.898-5.426-12.845c0-4.949,1.809-9.235,5.426-12.851   l29.119-29.121c3.621-3.618,7.9-5.426,12.851-5.426c4.948,0,9.231,1.809,12.847,5.426l87.65,87.65l87.65-87.65   c3.614-3.618,7.898-5.426,12.847-5.426c4.949,0,9.233,1.809,12.847,5.426l29.123,29.121c3.621,3.616,5.428,7.902,5.428,12.851   C367.164,196.807,365.357,201.09,361.733,204.705z" />' +
        '</g ></svg>' +
        '</button>');

    //Hide Header Content Button
    jQuery(".dv-toolbar-menu").append('<div id="dv-mobile-toolbar-contentHide' + controlID + '" class="dv-buttons-container"  style="float:right;display:none;padding-right:12px;"></div>');
    jQuery("#dv-mobile-toolbar-contentHide" + controlID).append('<button id="dv-mobile-toolbar-contentHideBtn' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button highlight" type="button" onclick="ToggleHeaderContent(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Header Content">' +
        '<svg version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">' +
        ' <g>' +
        ' <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M361.74,259.517l-29.123,29.129c-3.621,3.614-7.901,5.424-12.847,5.424   c-4.948,0-9.236-1.81-12.847-5.424l-87.654-87.653l-87.646,87.653c-3.616,3.614-7.898,5.424-12.847,5.424   c-4.95,0-9.233-1.81-12.85-5.424l-29.12-29.129c-3.617-3.607-5.426-7.898-5.426-12.847c0-4.942,1.809-9.227,5.426-12.848   l129.62-129.616c3.617-3.617,7.898-5.424,12.847-5.424s9.238,1.807,12.846,5.424L361.74,233.822   c3.613,3.621,5.424,7.905,5.424,12.848C367.164,251.618,365.357,255.909,361.74,259.517z" />' +
        '</g ></svg>' +
        '</button>');

    //For Save
    jQuery(".dv-mobile-buttons-container").prepend('<div id="mobile-fnSave' + controlID + '" class="dv-buttons-container" style="float:left;padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    jQuery("#mobile-fnSave" + controlID).prepend('<div id="mobile-Save' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="dv-button dv-dropdown highlight"  onclick="fnToSavePDFDetails();" title="Save"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path></svg></div>');

    //for Close
    $(".dv-mobile-buttons-container").append('<div id="mobile-fnClose' + controlID + '" class="dv-buttons-container" style="float:left;padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
    $("#mobile-fnClose" + controlID).append('<div id="mobile-Close' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="highlight dv-button dv-dropdown"  onclick="ConfirmationBeforeCancel();" title="Close Document"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469 c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304 c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path></svg></div>');
}

function fnOnmouseOver(e) {
    $(e).css('cursor', 'pointer');
    $(e).css('fill', '#A2A2A2');
}

function fnOnMouseOut(e) {
    $(e).css('cursor', 'default');
    $(e).css('fill', '#646464');
}
function toggleMouseMode(elem, addBookLink) {
    ////To Change Mouse mode
    pdfSessionStorage.AddBookLink = false;

    if (!$(elem).hasClass("button_active")) {
        pdfSessionStorage.AddBookLink = addBookLink;
        DocuViewareAPI.SetMouseMode(controlID, 3);
    } else {
        DocuViewareAPI.SetMouseMode(controlID, 0);

        dvJQuery(allPdfComp.dom.annotationsActionButtons).find("div").hide(); dvJQuery(allPdfComp.dom.annotationsActionButtons).hide();

    }
}
function removeHighlightOfBtn() {
    $(".highlight").removeClass("button_active");
    $(".highlight").css("fill", "rgb(100, 100, 100)");
    allPdfComp.dom.updateButtons();
}
function rgb2hex(rgb) { //rgba value to hex conversion
    rgb = rgb.replace("rgba(", "");
    rgb = rgb.replace(")", "");
    rgb = rgb.split(",");
    var hexval = ("0" + parseInt(rgb[0], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2);
    return ("#" + hexval);
}

getAnotTextJsonData = {};

function CreateAnnotation (a) { // To get selected area text
    if (a.action === "CopyPaste") {
        UpdateMoving(a,a.b.annots[0]);
    }
    else {
        Create(a)
    }
}

function Create(a)
{

    if (a.getAnotTextJsonData != undefined ? (a.getAnotTextJsonData.annotApp.properties.type == 8) ? true : false : false) {

        if (a.getAnotTextJsonData.annotApp.properties.type == 8)
        {
            let data = fnToFormInputToSaveTextAnnot(a.getAnotTextJsonData, "Create");
            if (data) {
          
                data["AnnotationID"] = a.id;

                var temp = data;

                //For to find the nearest Area text 
                var pagWidth = a.a.Internal.Pages.getPageWidth(DocuViewareAPI.GetCurrentPage(controlID));
                var pagHeight = a.a.Internal.Pages.getPageHeight(DocuViewareAPI.GetCurrentPage(controlID));

                var top1 = temp.TopCoordinate - 5;
                top1 = (top1 < 0) ? 0 : top1;
                var left = temp.LeftCoordinate - 5;
                left = (left < 0) ? 0 : left;
                var height = temp.AnnotationHeight + 5;
                height = (height > pagHeight) ? pagHeight : height;
                var width = temp.AnnotationWidth + 5;
                width = (width > pagWidth) ? pagWidth : width;


                var coordsJson = {
                    "left": left,
                    "top": top1,
                    "width": width,
                    "height": height
                };

                const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Create";
                //For CopyPaste
                data.ParentID = a.action ? a.parentID : "",
                    data.Action = a.action ? a.action : ""
                //This is the function to find the nearest area text 

                DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response) {
                    data.VicinityText = response.value;
                    window.showProgress();
                    $.ajax({
                        headers: {
                            "Authorization": sessionStorage.getItem("authorizeToken")
                        },
                        type: "POST",
                        url: urlBase,
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            window.hideProgress();
                            var e = document.getElementById(sessionStorage.controlID);
                            if (response.status == 1) {
                                window.predictText = "";
                                window.savedTextAnnotID.push(response.value);
                                e.control.Pop(response.message, "Create");
                            } else {
                                return new Promise((resolve, reject) => {
                                    window.DocuViewareAPI.RegisterOnAnnotationDeleted(controlID, () => { });

                                    e.control.message(response.message, "Create", resolve);

                                }).then(() => {

                                    a.a.DeleteAnnotationById(a.id);
                                    window.DocuViewareAPI.RegisterOnAnnotationDeleted(controlID, window.fnToDeleteAnnot);

                                }).catch((e) => {
                                    console.log(e);
                                })

                            }
                        },
                        beforeSend: function () { },
                        complete: function () {
                            getAnotTextJsonData = {};
                        },
                        error: function (x, status, error) {
                            console.log(x);
                            console.log(status)
                            console.log(error)
                        }

                    })
                })
            }
        }
    } else if (a.type == 6 || (a.getAnotTextJsonData != undefined ? (a.getAnotTextJsonData.annotApp.properties.type == 6) ? true : false : false)) {

        let datass = {
            currentPage: DocuViewareAPI.GetCurrentPage(sessionStorage.controlID),
            value: a.id,
            parentID: a.parentID,
            
        }

        if (a.circlePosition != "") {
            datass["circlePosition"] = a.circlePosition;
        }

        DocuViewareAPI.PostCustomServerAction(controlID, false, "SaveCircleAnnot", datass, function (response) {
            console.log(response);
        });
    }
}

function UpdateAnnotation(a) { // To get selected area text
    if (a.action === "Moving") {
        UpdateMoving(a,a.b);
    }
    else {
        Update(a)
    }
}

//UpdateMovingOnly
//CreateAnnotation By Copy Paste
function UpdateMoving(a,prop) { // To get selected area text

    const action = a.action === "CopyPaste" ? "Create" : "UpdateCoordinate";
    const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/" + action;

    if (prop) {
        let { properties } = prop.annotApp;

        if (properties.type == 8) {

            let data = {
                ParentID: a.action === "CopyPaste" ? a.parentID :"",
                Action: a.action,
                AnnotationID: prop.id,
                ChangeReason: "Update",
                StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                PageNumber: prop.pageNo,
                TopCoordinate: properties.top,
                LeftCoordinate: properties.left,
            }

            var temp = data;
            var pagWidth = a.a.Internal.Pages.getPageWidth(DocuViewareAPI.GetCurrentPage(controlID));
            var pagHeight = a.a.Internal.Pages.getPageHeight(DocuViewareAPI.GetCurrentPage(controlID));

            var top1 = temp.TopCoordinate - 5;
            top1 = (top1 < 0) ? 0 : top1;
            var left = temp.LeftCoordinate - 5;
            left = (left < 0) ? 0 : left;
            var height = properties.height + 5;
            height = (height > pagHeight) ? pagHeight : height;
            var width = properties.width + 5;
            width = (width > pagWidth) ? pagWidth : width;


            coordsJson = {
                "left": left,
                "top": top1,
                "width": width,
                "height": height
            };

            DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response) {
                data.VicinityText = response.value;
                $.ajax({
                    headers: {
                        "Authorization": sessionStorage.getItem("authorizeToken")
                    },
                    type: "POST",
                    url: urlBase,
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function (response)
                    {
                        var e = document.getElementById(sessionStorage.controlID);
                        (a.c.annotApp = a.b.annotApp, a.c.reset(), a.c.render(), a.a.updateThumbnails([a.b.pageNo]));

                        if (response.status == 1) {
                            //e.control.Pop(response.message, "Update");
                            console.log("Updated Successfully")

                        } else {

                            let msg = "Operation could not be completed. Contact Administrator";
                            if (response.message) {
                                msg = response.message;
                            }
                            //e.control.Pop(msg, "Update");
                            console.log(msg)
                        }

                    },
                    beforeSend: function () { },
                    complete: function () {
                        getAnotTextJsonData = {};
                    },
                    error: function (x, status, error) {
                        console.log(x);
                        console.log(status)
                        console.log(error)
                    }

                })
            })
        }
    }
}

//For Update 
function Update(a) { // To get selected area text

const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Update";
    if (a.b != undefined) {
        if (a.b.annotApp.properties.type == 8) {
            let data = fnToFormInputToSaveTextAnnot(a.getAnotTextJsonData,"Update");
            if (data) {
        

                data["AnnotationID"] = a.id;
                data["ChangeReason"] = "Updated";

                var temp = data;
                var pagWidth = a.a.Internal.Pages.getPageWidth(DocuViewareAPI.GetCurrentPage(controlID));
                var pagHeight = a.a.Internal.Pages.getPageHeight(DocuViewareAPI.GetCurrentPage(controlID));

                var top1 = temp.TopCoordinate - 5;
                top1 = (top1 < 0) ? 0 : top1;
                var left = temp.LeftCoordinate - 5;
                left = (left < 0) ? 0 : left;
                var height = temp.AnnotationHeight + 5;
                height = (height > pagHeight) ? pagHeight : height;
                var width = temp.AnnotationWidth + 5;
                width = (width > pagWidth) ? pagWidth : width;


                coordsJson = {
                    "left": left,
                    "top": top1,
                    "width": width,
                    "height": height
                };

                DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response) {
                    data.VicinityText = response.value;
                    window.showProgress();
                    $.ajax({
                        headers: {
                            "Authorization": sessionStorage.getItem("authorizeToken")
                        },
                        type: "POST",
                        url: urlBase,
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            window.hideProgress();
                            var e = document.getElementById(sessionStorage.controlID);
                            (a.c.annotApp = a.b.annotApp, a.c.reset(), a.c.render(), a.a.updateThumbnails([a.b.pageNo]));

                            if (response.status == 1) {
                                e.control.Pop(response.message, "Update");
                            } else {

                                let msg = "Operation could not be completed. Contact Administrator";
                                if (response.message) {
                                    msg = response.message;
                                }
                                //e.control.Pop(msg, "Update");
                                console.log(msg)
                            }

                        },
                        beforeSend: function () { },
                        complete: function () {
                            getAnotTextJsonData = {};
                        },
                        error: function (x, status, error) {
                            console.log(x);
                            console.log(status)
                            console.log(error)
                        }

                    })
                })
            }
        }
    }
}

function toUpperCaseFirstLetter(lower) {
    return lower.charAt(0).toUpperCase() + lower.substring(1);
}

 
function fnToSavePDFDetails(data = { msg: true })
{
    window.showProgress();
    var parseData = JSON.parse(sessionStorage.pdfDetails);
    var activityConfiguration = {

    };

    Object.keys(parseData.activityConfiguration).forEach(function (key) {
        var newKey = toUpperCaseFirstLetter(key);
        activityConfiguration[newKey] = parseData.activityConfiguration[key];
    });

    forsavecoordsJson = {
        "DocTempPath": parseData.docTempPath,
        "StudyID": parseData.studyID
    };

    DocuViewareAPI.PostCustomServerAction(controlID, true, "SaveAnnotPdf", forsavecoordsJson, function (response) {
        var e = document.getElementById(sessionStorage.controlID);
        if (response != null && response.Status == 1) {
            forsavecoordsJson["ObjectID"] = parseData.objectID;
            forsavecoordsJson["activityConfiguration"] = activityConfiguration;
            forsavecoordsJson["controlID"] = controlID;
            forsavecoordsJson["DocNewPath"] = response.DocNewPath;
            savePdfToDB(forsavecoordsJson, data);
            //AGjs__ changes remove highlight of the button when operation is done
            $(".highlight").removeClass("button_active");
            $(".highlight").css("fill", "rgb(100, 100, 100)");
            allPdfComp.dom.updateButtons();
            // end of remove highlight of the button when operation is done
        } else {
            window.hideProgress();
        }
    });

}

function savePdfToDB(postData, obj = {msg:true})
{
    const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/Pdf/SavePdf";
    postData["activityConfiguration"].UpdatedBy = JSON.parse(sessionStorage.userProfile).userID;
    var e = document.getElementById(sessionStorage.controlID);
    window.showProgress();

    $.ajax({
        headers: {
            "Authorization": sessionStorage.getItem("authorizeToken")
        },
        type: "POST",
        url: urlBase,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data: JSON.stringify(postData),
        success: function (response)
        {
            window.hideProgress();

            if (response.status == 1) {
                window.savedTextAnnotID = [];
                return new Promise((resolve, reject) => {
                    window.initializePDF(resolve, reject);

                }).then((result) => {
                    return obj.msg ?
                        e.control.Pop("Document saved successfully", "Save") :
                    obj.cb ? obj.cb() : false;
                }).catch(e =>
                {
                    e.control.Pop(response.value, "Save");
                });
                

               
            } else {
                e.control.Pop(response.value, "Save");
            }
        },
        beforeSend: function () { },
        error: function (x, status, error) {
            e.control.Pop("Unable to save CRF!", "Save CRF");
            console.log(x);
            console.log(status);
            console.log(error);
        }

    });
}

function fnToDeleteAnnot(a, resolve ="Delete", reject=null)
{
    if (a.type == 3) {
        fnTest(a);
    }
    if (a.type == 8)
    {
        const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Delete";
        var data = {
            annotationID: a.id,
            changeReason: "Deleted",
            TimeZone: "IST",
            UpdatedBy: JSON.parse(sessionStorage.userProfile).userID
        };
        var e = document.getElementById(sessionStorage.controlID);

        window.showProgress();
        $.ajax({
            headers: {
                "Authorization": sessionStorage.getItem("authorizeToken")
            },
            type: "POST",
            url: urlBase,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify(data),
            success: function (response)
            {
                window.hideProgress();

                if (response.status == 1)
                {
                    if (resolve === "Delete")
                    {
                        e.control.Pop("Annotation deleted successfully", "Delete");

                    } else
                    {
                        //if user update the annotation witohut Check the Add to Mapping checkbox means
                        //we have to delet the Annotation from Database
                       return typeof resolve === "function" ? resolve() : false;
                    }
                } else {
                    if (!reject)
                    {
                        e.control.Pop("Annotation not deleted successfully", "Delete");

                    } else
                    {
                        return typeof reject === "function" ? reject() : false;
                    }
                }
            },
            beforeSend: function () { },
            complete: function () {
                getAnotTextJsonData = {};
            },
            error: function (x, status, error) {
                console.log(x);
                console.log(status)
                console.log(error)
            }

        })
    }
}
window.textAnnotDelete = function (savedTextAnnotID) {
    if (savedTextAnnotID.length > 0) {
        const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/MultipleDelete";
        var data = {
            AnnotIDs: savedTextAnnotID.toString(),
            changeReason: "Deleted",
            TimeZone: "IST",
            UpdatedBy: JSON.parse(sessionStorage.userProfile).userID
        };
        var e = document.getElementById(sessionStorage.controlID);
        $.ajax({
            headers: {
                "Authorization": sessionStorage.getItem("authorizeToken")
            },
            type: "POST",
            url: urlBase,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.status == 1) {
                    console.log("Annotation deleted successfully");
                } else {
                    console.log("Annotation not deleted successfully");
                }
            },
            beforeSend: function () { },
            complete: function () {
                getAnotTextJsonData = {};
            },
            error: function (x, status, error) {
                console.log(x);
                console.log(status)
                console.log(error)
            }

        })
    }

}
$("#viewerContainer" + controlID).keyup(function (e) {
    if (e.ctrlKey) {
        if (e.keyCode == 86) {
            if (PasteWithCtrlKey) {

                tempObject.Internal.Annotations.addMultipleAnnotInteractive();

            }
        }
    }
})

function fnTest(a) {
    DocuViewareAPI.PostCustomServerAction(controlID, true, "DeleteOldCircleWhenMove", {
        value: a.id,
        isDelete: a.delete,
        currentPage: DocuViewareAPI.GetCurrentPage(sessionStorage.controlID),
    }, function (response) {
        if (!a.delete) {
            var prop = DocuViewareAPI.GetAnnotPropertiesValues(controlID, 6);
            prop.left = response.Left;
            prop.top = response.Left;
            allPdfComp.Internal.Annotations.addCustomCircleWithLine(prop);
        }
    });

}



function addAutoComplete() {
    //Adding auto complete suggestion to text box
    jQuery("#annot_text_input" + controlID).autocomplete({
        source: function (request, response) {
            var results = jQuery.ui.autocomplete.filter(allDomianVars, request.term);
            response(results.slice(0, 10));
        },
        minLength: 2,
        delay: 0,
        appendTo: "#annotationDialogForm" + controlID,
        select: function (e, ui) {
            jQuery(e.target).attr("data", JSON.stringify(ui.item.data)).removeClass("annot_tar_error");
            $("#var_text_errormessage_span" + controlID).text("");
        },
    
    });
    jQuery(".annot_SrcText_input" + controlID).autocomplete({
        source: function (request, response) {
            var results = jQuery.ui.autocomplete.filter(allSrcVars, request.term);
            response(results.slice(0, 10));
        },
        minLength: 2,
        delay: 0,
        appendTo: "#annotationDialogForm" + controlID,
        select: function (e, ui)
        {
            let src_textbox = e.target;
            $(src_textbox).removeClass("annot_src_error");
      
            let errormessage_span = $(src_textbox).parent().siblings().length > 0 ? $(src_textbox).parent().siblings()[0] : false;

            if (!errormessage_span)
            {
                return;
            }
            $(errormessage_span).text("");
        },
    });
    var autoCompElem = document.getElementsByClassName("ui-autocomplete");
    if (typeof autoCompElem != 'undefined' && autoCompElem.length > 0) {
        for (var i = 0; i < autoCompElem.length; i++) {
            var elemStyle = autoCompElem[i].style;
            if (elemStyle.backgroundColor == "") {
                elemStyle.backgroundColor = "#FFFFFF";
            }
        }
    }
}

//For to form a input for controller to save the annotation
function fnToFormInputToSaveTextAnnot(c,action) {
    let x = c.annotApp.properties;

    var sourcetarget = [];
        sourcetarget = fnToGetSourceValue();
    
    let src_text = $("#annot_text_input" + controlID).val();

    let idsOfMetaData = false;

    if (allDomianVars && typeof allDomianVars === "object" && src_text && src_text !== "")
    {
        let domain_data = allDomianVars.find(srcdom => srcdom.label.toLocaleLowerCase() === src_text.toLocaleLowerCase());
        idsOfMetaData = domain_data ? domain_data.data : false;
    }

        var data =
        {
            StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
            CRFDocumentID: 3,
            AnnotationText: x.text,
            CDISCDataStdDomainMetadataID: (idsOfMetaData) ? idsOfMetaData.StdDomainMetadataID : 0,
            CDISCDataStdVariableMetadataID: (idsOfMetaData) ? idsOfMetaData.StdVariableMetadataID : 0,
            SourceDataSet: (sourcetarget != "") ? (sourcetarget[0].split(".")[0] != undefined) ? sourcetarget[0].split(".")[0] : '' : '',
            SourceVariableName: sourcetarget.length != 0 ? (sourcetarget[0].split(".")[1] != undefined) ? sourcetarget[0].split(".")[1] : '' : "",
            TargetDataSet: x.text.split(".")[0] == undefined ? 'test' : x.text.split(".")[0],
            TargetVariableName: x.text.split(".")[1] == undefined ? 'test' : x.text.split(".")[1],
            VicinityText: 'test',
            PageNumber: c.annotApp.pageNo,
            AdditionalSourceData: sourcetarget.toString(),
            AnnotationShape: x.type,
            BorderColor: x.strokeColor,
            BorderWidth: x.borderWidth,
            FontSize: x.fontSize,
            FontStyle: x.fontStyle,
            FontColor: x.strokeColor,
            FillColor: x.fillColor,
            TopCoordinate: x.top,
            LeftCoordinate: x.left,
            AnnotationHeight: x.height,
            AnnotationWidth: x.width,
            TimeZone: "IST",
            UpdatedBy: JSON.parse(sessionStorage.userProfile).userID
        };
        $("#annot_SrcText_input" + controlID).attr("data", 0);
        $('.sorceFieldGroup').remove();
        return data;
   
}
var colorpick = 0;
$(".color").click(function (e) {
    colorpick = 1;
})

$("#main" + controlID).keydown(function (event) {
    if ((event.keyCode == 107 && event.ctrlKey == true) || (event.keyCode == 109 && event.ctrlKey == true)) {
        event.preventDefault();
    }

    $("#main" + controlID).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    });
});

$('#annot_text_input' + controlID).keyup(function () {
    $('#annot_text_input' + controlID).attr("data", 0);
});

//Fn for Adding Multiple Source TextBox
function fnToAddSourceTextbox() {
    jQuery("#annot_SrcText_control" + controlID).append('<div>'+
        '<div class = "input-group sorceFieldGroup" style="padding-top:5px">' +
        '<input onkeyup="validatesrctext(this)" type ="text" class= "form-control addsourcefield annot_SrcText_input' + controlID + '" name="annot_SrcText_input' + controlID + '" type="text" >' +
        '<span class = "input-group-addon" style="cursor:pointer" onclick="fnToDeleteSourceTextbox(this)" style="padding:4px 13px">-</span>' +
        '</div>' +
        '<span class="src_text_errormessage_span' + controlID + '" class="annot_spanerror"></span>' +
        '</div>');
    addAutoComplete();
}

function fnToFormTheSourceFieldByDBValue(data)
{
    $("#annot_SrcText_input" + controlID).val("");
    var tempData = (data != null && data != "" && data != '') ? data.split(',') : false;
    if (tempData) {
        tempData.forEach(function (key, index) {
            if (index === 0) {
                $("#annot_SrcText_input" + controlID).val(key);
            }
            else {
                jQuery("#annot_SrcText_control" + controlID).append(
                    '<div>'+
                        '<div class = "input-group sorceFieldGroup" style="padding-top:5px">' +
                            '<input onkeyup="validatesrctext(this)" type ="text" class= "form-control addsourcefield annot_SrcText_input' + controlID + '" name="annot_SrcText_input' + controlID + '" type="text" value=' + key + ' >' +
                            '<span class = "input-group-addon" style="cursor:pointer" onclick="fnToDeleteSourceTextbox(this)" style="padding:4px 13px">-</span>' +
                    '<span id="src_text_errormessage_span' + controlID + '" class="annot_spanerror"></span>' +
                        '</div>'+
                    '</div>');
            }
            addAutoComplete();
        });
    }
}

function fnToDeleteSourceTextbox(e) {
    $(e.parentElement.parentElement).remove()
}

function fnToGetSourceValue() 
{
    let tempAdditional = [];
    $('.annot_SrcText_input' + controlID).each(function ()
    {
        let tempStore = $(this).val();
        if (tempStore !== "") {

            tempAdditional.push(tempStore);
        }
    });
    return tempAdditional;
}
//fn for to create hyperlink panel
function addHyperLinkSnapIn() {
    let Element = "<div id=customHyperLinkSnapInPanel" + controlID + "><div style='float:left;margin-top:6px;margin-left:6px;'><div id=hyperLinksDocuVieware" + controlID + " style='height:100%'></div></div></div>";
    let icon = '<svg viewbox="0 0 512 512" style="height:100%;width:100%;">"<path d=\"m 219.2115,319.40794 c -6.81606,0 -13.63211,-2.58799 -18.84246,-7.79672 -48.69546,-48.68036 -48.69546,-127.92516 0,-176.63827 l 98.30847,-98.277972 c 23.59403,-23.586713 54.9872,-36.59216444 88.34654,-36.59216444 33.35934,0 64.75251,13.00545144 88.34654,36.59216444 48.69546,48.713114 48.69546,127.925162 0,176.638272 l -44.92697,44.91303 c -10.38793,10.38471 -27.26421,10.38471 -37.65214,0 -10.38793,-10.3847 -10.38793,-27.25576 0,-37.64046 l 44.92697,-44.91303 c 27.95237,-27.94371 27.95237,-73.41365 0,-101.35735 -13.5338,-13.5296 -31.55702,-20.998726 -50.6944,-20.998726 -19.13738,0 -37.1606,7.469126 -50.6944,20.998726 l -98.30847,98.27797 c -27.95237,27.9437 -27.95237,73.41364 0,101.35735 10.38793,10.3847 10.38793,27.25575 0,37.64046 -5.21035,5.20873 -12.0264,7.79672 -18.84245,7.79672 z\"></path><path d=\"m 124.86814,512 c -33.359342,0 -64.752513,-13.00545 -88.346545,-36.59216 -48.69546,-48.68036 -48.69546,-127.92516 0,-176.63828 l 44.92697,-44.91303 c 10.387928,-10.3847 27.264215,-10.3847 37.652145,0 10.38793,10.38471 10.38793,27.25576 0,37.64046 l -44.926972,44.91304 c -27.952374,27.9437 -27.952374,73.41364 0,101.35734 13.533799,13.5296 31.524252,20.99873 50.694402,20.99873 19.17015,0 37.1606,-7.46913 50.6944,-20.99873 L 273.871,339.4894 c 27.95238,-27.9437 27.95238,-73.41364 0,-101.35734 -10.38792,-10.38471 -10.38792,-27.25576 0,-37.64047 10.38793,-10.3847 27.26422,-10.3847 37.65215,0 48.69546,48.68036 48.69546,127.92516 0,176.63828 l -98.30847,98.27797 C 189.62065,498.99455 158.22748,512 124.86814,512 Z\"></path></svg>';
    DocuViewareAPI.AddCustomSnapIn(controlID, "HyperLinks", "Link", icon, null, true, "");
}

//CustomSnapIN ToolBar
function addToolBarSnapIn() {
    let Element = "<div id=CustomToolBar" + controlID + "><div style='float:left;margin-top:6px;margin-left:6px;'><div id=customToolBarDocuVieware" + controlID + " style='height:100%'></div></div></div>";
    let icon = '<svg viewbox="0 0 512 512" style="height:100%;width:100%;">' +
                    '<g>' +
                        '<path d="M467.606,92.918c-4.852,4.691-12.607,4.576-17.313-0.276l-42.708-44.088c-4.706-4.866-4.591-12.638,0.29-17.374l26.467-25.581c4.882-4.707,12.639-4.576,17.346,0.291l42.707,44.103c4.679,4.852,4.562,12.638-0.318,17.345L467.606,92.918z"></path>' +
                        '<path d="M105.159,325.24c-8.513,1.54-25.407,83.729-25.407,83.729s83.208-14.438,84.544-22.632L105.159,325.24z"></path><path d="M123.927,305.948L370.862,67.003c4.881-4.692,12.668-4.576,17.374,0.276l42.679,44.088c4.707,4.865,4.591,12.667-0.291,17.345L183.66,367.657"></path><path d="M400.932,238.009v244.35H43.93V29.642h278.006v-29.75H29.054c-3.922,0-7.772,1.599-10.532,4.343c-2.775,2.789-4.344,6.596-4.344,10.532v482.467c0,3.894,1.598,7.729,4.344,10.519c2.76,2.789,6.609,4.356,10.532,4.356h386.751c3.922,0,7.758-1.627,10.547-4.356c2.73-2.789,4.328-6.625,4.328-10.519V238.009H400.932z"></path>' +
                    '</g>' +
              '</svg>';
    DocuViewareAPI.AddCustomSnapIn(controlID, "Annotation", "Annotations", icon, null, true, "");
}

function exapand(b, i) {
    //
    //var c = jQuery(b).parent().find("ul");
    if (jQuery(b).hasClass("collapsed")) {
        jQuery(b).removeClass("collapsed").addClass("expanded");
        $("#childs" + i).show();
    } else {
        jQuery(b).removeClass("expanded").addClass("collapsed");
        $("#childs" + i).hide();
    }

    //console.log(c);
}


function selectHyperLink(b) {
    resetBookmarkStyle();
    jQuery(b).css("background-color", allPdfComp.dom.UIconfig.activeSelectedBackgroundColor).addClass("selected");
    var mouseMode = DocuViewareAPI.GetMouseMode(controlID);
    if (mouseMode != 0) {
        DocuViewareAPI.SetMouseMode(controlID, 0);
    }

    DocuViewareAPI.SelectPage(controlID, jQuery.parseJSON(jQuery(b).attr("action")).page);
}
function resetBookmarkStyle() {
    jQuery(".internalLink").removeClass("selected").css("background-color", "transparent");
}

function fnForToAddBookmarkOrInternalLink(forWhat) {
    //if forWhat 0 means bookmark else if 1 means Internal Hyper Link

    var coords = DocuViewareAPI.GetSelectionAreaCoordinates(controlID);
    DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coords, function (response) {

        if (forWhat === 0) {
            var e = document.getElementById(sessionStorage.controlID);
            let textBook = (response.value != "" && response.value != null) ? response.value : "Untitled Bookmark";

            e.control.BookLinkPop("<input id='AddBookMark' value='" + textBook + "'  placeholder=' Enter a title' style='width:100%' />", "Bookmark", "AddBookMark");
        }
        else if (forWhat === 1) {
            let textLink = (response.value != "" && response.value != null) ? response.value : "Untitled Link";

            var e = document.getElementById(sessionStorage.controlID);
            e.control.BookLinkPop("<div><input style='width:100%;font-size:12px;color:#000000;' id='AddInternalLink' placeholder=' Enter a title' value='" + textLink + "' /></div>" +
                "<div style='margin-top:10px'><input style='width:100%;font-size:12px;color:#000000;' type='number' placeholder=' Enter page number to link' id='destPageNo' /></div >", "Internal Link", "AddInternalLink");
        }
    });
}

function saveBookLink(value, destpageNo, forBookOrLink, AnnotationID) {
    if (value && value !== "") {
        var parseData = JSON.parse(sessionStorage.pdfDetails);
        var coordsJson = DocuViewareAPI.GetSelectionAreaCoordinates(controlID);
        coordsJson.value = value;
        coordsJson.destinationPage = destpageNo;
        coordsJson.docTempPath = parseData.docTempPath;
        coordsJson.controlID = sessionStorage.controlID;
        coordsJson.currentPage = DocuViewareAPI.GetCurrentPage(sessionStorage.controlID);
        coordsJson.full = false;
        if (allPdfComp.IsFullScreenMode()) {
            sessionStorage.full = true;
        }

        if (forBookOrLink == "UpdateInternalLink") {
            coordsJson.annotID = AnnotationID;
        }
        DocuViewareAPI.PostCustomServerAction(controlID, true, forBookOrLink, coordsJson, function (response) {
            if (forBookOrLink == "AddBookMark") {

                fnToBookListMake(response, "Add New Bookmark");

            }
            else {
                dvJQuery(allPdfComp.dom.annotationsActionButtons).hide();

                $("#" + controlID + "_snapin_panel_HyperLinks").html(response.htmlContent);
                window.resetMouseMode(document.getElementById("selectMouseModeButton" + controlID));
                var e = document.getElementById(sessionStorage.controlID);

                e.control.Pop(response.message, "Internallink");

            }
            dvJQuery(allPdfComp.dom.passwordDialogForm).dvDialog("close");

        });
    } else {
        var e = document.getElementById(sessionStorage.controlID);

        if (forBookOrLink == "AddBookMark")
        {

            e.control.Pop("Enter a title", "Bookmark");
        }
        else {
            e.control.Pop("Enter a title", "Internallink");
        }
    }
}

//For to delte and Edit link
function fnForToEditAndDeleteInternalLink(forWhat) {
    //Edit the Link if forWhat is 0
    if (forWhat == 0) {

        var currentPage = DocuViewareAPI.GetCurrentPage(sessionStorage.controlID);
        let linkID = parseInt($(".internalLinkContext").attr("data"));

        var getLinkDetails = $($("#childs" + currentPage).children()[linkID].innerHTML);
        if (getLinkDetails != undefined) {
            getLinkDetails = JSON.parse(getLinkDetails.attr("action"));
            var e = document.getElementById(sessionStorage.controlID);
            e.control.BookLinkPop("<div><input style='width:100%;font-size:12px;color:#000000;' id='UpdateInternalLink' placeholder=' Enter a title' AnnotationID=" + getLinkDetails.id + " value='" + getLinkDetails.title + "' /></div>" +
                "<div style='margin-top:10px'><input style='width:100%;font-size:12px;color:#000000;' placeholder=' Enter page number to link' value='" + getLinkDetails.targetPage + "' id='destPageNo' /></div >", "Internallink", "UpdateInternalLink");
        }
    }
    else if (forWhat == 1) {
        var data = {};
        data.currentPage = DocuViewareAPI.GetCurrentPage(sessionStorage.controlID);

        var parseData = JSON.parse(sessionStorage.pdfDetails);
        var linkId = parseInt($(".internalLinkContext").attr("data"));
        data.annotID = linkId;
        data.docTempPath = parseData.docTempPath;

        DocuViewareAPI.PostCustomServerAction(controlID, true, "DeleteLink", data, function (result) {
            fnToReinitDocuvieware(result);
            $("#" + controlID + "_snapin_panel_HyperLinks").html(result.resultdata);
        });
    }
}

function fnToReinitDocuvieware(result) {

    dvJQuery(allPdfComp.dom.annotationsActionButtons).hide();

    $("#" + controlID + "_snapin_panel_HyperLinks").html(result.htmlContent);
    window.resetMouseMode(document.getElementById("selectMouseModeButton" + controlID));
    var e = document.getElementById(sessionStorage.controlID);

    e.control.Pop(result.message, "Internallink");

}
function fnToBookListMake(data, header) {

    if (data.status == 1) {
        var result = data.htmlContent;
        allPdfComp.serverCtx.bookmarks = result;
        $("#bookmarksTree" + controlID).html("");
        dvJQuery(allPdfComp.dom.annotationsActionButtons).find("div").hide();
        if (null != allPdfComp.serverCtx.bookmarks && allPdfComp.dom.bookmarksArea) {
            for (m = 0; m <
                allPdfComp.serverCtx.bookmarks.length; m++) e = allPdfComp.serverCtx.bookmarks[m], allPdfComp.dom.createBookmarkNode(dvJQuery(allPdfComp.dom.bookmarksTree), e);
            allPdfComp.SetSnapInVisibility("bookmarks", !0)
        }

        var e = document.getElementById(sessionStorage.controlID);

        e.control.Pop(data.message, header);

    } else {
        var e = document.getElementById(sessionStorage.controlID);

        e.control.Pop(data.message, header);

    }
    dvJQuery(allPdfComp.dom.annotationsActionButtons).hide();
    window.resetMouseMode(document.getElementById("selectMouseModeButton" + controlID));

}
var getSelectedAreaText = function () { // To get selected area text

    if (pdfSessionStorage.AddBookLink) {
        var g = allPdfComp.Internal.Pages.getRenderingState(allPdfComp.GetCurrentPage()),
            c = allPdfComp.dom.viewerArea.getBoundingClientRect(),
            e = allPdfComp.dom.rselect.getBoundingClientRect();
        c = {
            left: e.left - c.left - g.pageLeft + allPdfComp.Internal.Coordinates.getViewerScrollLeft(),
            top: e.top - c.top - g.pageTop + allPdfComp.Internal.Coordinates.getViewerScrollTop(),
            width: dvJQuery(allPdfComp.dom.rselect).width(),
            height: dvJQuery(allPdfComp.dom.rselect).height()
        };

        allPdfComp.ShowBookmarkHyperlinkContext(c.left + c.width + g.pageLeft, c.top + c.height + g.pageTop);
    }
}

function fnShowDeleteEditContextMenuForInternalLink(left, top, id) {
    // To show context when click page link

    allPdfComp.ShowCotextWhenClickInternalLink(left, top, id);
}
function fnForMoveUpDelete(url, data, element) {
    DocuViewareAPI.PostCustomServerAction(controlID, true, url, data, function (result) {

        fnToBookListMake(result, data.isDelete ? "Delete Bookmark" : "Move Bookmark");
    });

}

function handleBookmarkConextMenu(key, options) {

    var e = document.getElementById(sessionStorage.controlID);
    $("#modalOverlayDiv" + controlID).css("z-index", 16777271);

    var elem = $(options.$trigger[0]);
    var id = elem[0].action.replace("PdfPageDest:", "").trim();
    switch (key) {
        case "edit":
            var text = elem.text();
            var thiselem = elem;
            elem.text('');
            var input = $('<input type=text>');
            input.prop('value', text);
            elem.append(input);
            input.select();
            input.focus();
            var id = elem[0].action.replace("PdfPageDest:", "").trim();

            elem.focusout(function (e) {

                var currTextValue = e.target.value;
                if (currTextValue != null && $.trim(currTextValue) != "") {
                    if (text != currTextValue) {
                        saveEditedBookMark(currTextValue, id, "Edit Bookmark Title");
                    } else {
                        resetBookmarkElement(elem, text);
                    }
                } 
                return false;

            });
            elem.keyup(function (e) {
                var key = e.which;
                if (key == 13) {
                    var currTextValue = e.target.value;
                    if (currTextValue != null && $.trim(currTextValue) != "") {
                        if (text != currTextValue) {
                            saveEditedBookMark(currTextValue, id, "Edit Bookmark Title");
                        } else {

                            resetBookmarkElement(elem, text);
                        }
                    } else {

                    }
                    return false;
                } else if (key == 27) {
                    resetBookmarkElement(elem, text);
                    return false;
                }
            });
            break;
        case "moveup":
            $(elem[0]).addClass('lidisable');

            e.control.Pop("Selected Bookmark : " + elem.text(), "Move Bookmark One Step Up ?", { action: "MoveBookMarkOneStep", data: { up: true, bookmarkID: id } });
            break;
        case "movedown":
            e.control.Pop("Selected Bookmark : " + elem.text(), "Move Bookmark One Step Down ?", { action: "MoveBookMarkOneStep", data: { down: true, bookmarkID: id } });

            break;
        case "movearoundup":
            $(elem[0]).addClass('lidisable');

            $("#modalOverlayDiv" + controlID).css("z-index", 0);

            $($(elem[0]).parent().children()[2]).addClass('lidisable');

            e.control.BookLinkPop("<div><span id='targetBookmark'>Selected Bookmark : " + elem.text() + "</span></div>" +
                "<div style='margin-top:10px'><span id='doingBookMoveOperation'>Please Select Target Bookmark : </span></div >", "Move Around Up", "targetBookmark", { ele: $($(elem[0]).parent().children()[2]), action: "MoveBookMarkAround", data: { up: true, MoveAround: true, bookmarkID: id } });
            break;
        case "movearounddown":
            $(elem[0]).addClass('lidisable');

            $("#modalOverlayDiv" + controlID).css("z-index", 0);
            $($(elem[0]).parent().children()[2]).addClass('lidisable');

            e.control.BookLinkPop("<div><span id='targetBookmark'>Selected Bookmark : " + elem.text() + "</span></div>" +
                "<div style='margin-top:10px'><span id='doingBookMoveOperation'>Please Select Target Bookmark : </span></div >", "Move Around Down", "targetBookmark", { ele: $($(elem[0]).parent().children()[2]), action: "MoveBookMarkAround", data: { up: false, MoveAround: true, bookmarkID: id } });
            break;
        case "child":

            $("#modalOverlayDiv" + controlID).css("z-index", 0);
            $(elem[0]).addClass('lidisable');
            $($(elem[0]).parent().children()[2]).addClass('lidisable');

            e.control.BookLinkPop("<div><span id='targetBookmark'>Selected Bookmark : " + elem.text() + "</span></div>" +
                "<div style='margin-top:10px'><span id='doingBookMoveOperation'>Please Select Target Bookmark : </span></div >", "Move as Child", "targetBookmark", { ele: $($(elem[0]).parent().children()[2]), action: "MoveBookMarkAround", data: { isChild: true, up: false, MoveAround: true, bookmarkID: id } });
            break;
        case "delete":
            e.control.Pop("Delete Bookmark : " + elem.text(), "Delete Bookmark ?", { action: "EditAndDeleteBookmark", data: { isDelete: true, bookmarkID: id } });
            break;
    }

}

function resetBookmarkElement(elem, value) {
    elem.html(value);
    elem.off("focusout");
    elem.off("keyup");
}

function saveEditedBookMark(bTitle, bID) {
    editMode = false;
    var pageNum = DocuViewareAPI.GetCurrentPage(controlID);
    if (bTitle != null && $.trim(bTitle) != "") {
        var data = {
            "bookmarkID": bID,
            "title": bTitle,
            "currentPage": pageNum
        };
        DocuViewareAPI.PostCustomServerAction(controlID, true, "EditAndDeleteBookmark", data, function (response) {
            fnToBookListMake(response, "Edit Bookmark Title");
        });

    } else {
        e.control.Pop("Title Must Not Be Empty!", "Edit Bookmark");
    }
}

function addContextMenuForBookmark() {
    //$(".context-menu-list").remove();    
    let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
    let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
    let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
    //workflowActivityStatusID =3 means  Annotation Inprogress
    //workflowActivityStatusID =3 means  Annotation Review
    //adminType User admin
    //ADMIN ,Annotation Inprogress & Review only can annotate only we can annotate
    if (window.annotationPermission()) {
        $.contextMenu({
            selector: '.internal',

            build: function ($trigger, e) {
                return {
                    appendTo: "#main" + controlID,

                    callback: function (key, options) {
                        var m = "clicked: " + key;
                        console.log(m);
                        handleBookmarkConextMenu(key, options);
                    },
                    items: dynamicMenu($trigger)
                };

            }

        });
    }
};

function dynamicMenu($trigger) {
    console.log("d");
    var item = {};

    item["edit"] = { name: "Edit" };
    item["delete"] = { name: "Delete" };
    if ($(".treeview .internal").length >= 2) {
        item["child"] = { name: "Move as Child" }
    }



    if ($trigger.parents().prevAll("li").length > 1) {
        item["movearoundup"] = { name: "Move Around Up" };
        item["movearounddown"] = { name: "Move Around Down" };
    }
    else if ($trigger.parents().nextAll("li").length > 1) {
        item["movearoundup"] = { name: "Move Around Up" };
        item["movearounddown"] = { name: "Move Around Down" };
    }
    else if ($trigger.parent().parent().parent('li').hasClass("hasChildren")) {
        item["movearoundup"] = { name: "Move Around Up" };
        item["movearounddown"] = { name: "Move Around Down" };
    }





    if ($trigger.parent().prev('li').length == 1) {

        item["moveup"] = { name: "Move Up" };

    }



    if ($trigger.parent().next('li').length == 1) {

        item["movedown"] = { name: "Move Down" };

    }

    return item;
}

function fnToGetLinkList() {
    DocuViewareAPI.PostCustomServerAction(controlID, true, "GetLinkList", {}, function (response) {
        $("#" + controlID + "_snapin_panel_HyperLinks").html(response);
        window.resetMouseMode(document.getElementById("selectMouseModeButton" + controlID));
    })
}

function getTextForPredict(a,resolve,reject)
{
    let property = a.Internal.Annotations.currentAnnotProperties;

    var b = DocuViewareAPI.GetCurrentPage(sessionStorage.controlID),
        c = a.Internal.Pages.getRenderingState(b),
        e = a.Internal.Selection.selectionArea.getPageBounds(),
        f = a.Internal.Matrix.scale(a.Internal.Matrix.invert(c.contentMatrix), 1 / 96, 1 / 96, !1);
    a.Internal.Matrix.transformBBox(f, 0, e);
    property.left = a.Internal.Utilities.roundEx(e.left, 7);
    property.top = a.Internal.Utilities.roundEx(e.top, 7);
    property.width = a.Internal.Utilities.roundEx(e.width, 7);

    property.height = a.Internal.Utilities.roundEx(e.height, 7);
    e = a.Internal.Selection.selectionArea.getStartPosition();
    a.Internal.Matrix.transformPoint(f, e);

    var top = property.top;
    var left = property.left;
    var height = property.height;
    var width = property.width;
    var coordsJson = {
        "left": left,
        "top": top,
        "width": width,
        "height": height
    };

    window.predictText = null;

    //This is the function to find the nearest area text

    window.showProgress();
    DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response)
    {
        window.hideProgress();

        if (response.value && response.value) {
            window.predictText = response.value;
            $("#annot_PredictText_input" + sessionStorage.controlID).text(response.value);
            $("#annot_PredictText" + sessionStorage.controlID).show();
        } else {
            $("#annot_PredictText_input" + sessionStorage.controlID).text("");
            $("#annot_PredictText" + sessionStorage.controlID).hide();
        }
        resolve();
      
    });

}
function fnPredict(a)
{
    var sourceDomain = [];
    sourceDomain = getSourceValue();

    if (sourceDomain !== "" &&  $(".annot_src_error").length === 0)
    {
     
        const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/Py/GetPrediction";

        window.showProgress();
        $.ajax({
            headers: {
                "Authorization": sessionStorage.getItem("authorizeToken")
            },
            type: "POST",
            url: urlBase,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify({ text: window.predictText, variable: sourceDomain }),
            success: function (response)
            {
                window.hideProgress();
                if (response.value) {
                    let data = (response.value && typeof response.value === "object") ? response.value : null;
                    if (data && data[0] && typeof data[0] === "string" && data[0].toLocaleLowerCase() !== "drop") {
                        $('#annot_text_input' + controlID).val(data[0]);

                        $('#annotTextParentSpan' + controlID).show();
                    }
                    else {
                        $('#annot_text_input' + controlID).val("No Prediction");
                        //var e = document.getElementById(sessionStorage.controlID);
                        //let mess = response.message;
                        //e.control.Pop(mess !== null ? mess : "Operation could not be completed.Contact Administrator", "Predict");
                    }
                }
                else {
                    $('#annot_text_input' + controlID).val("No Prediction");
                    //var e = document.getElementById(sessionStorage.controlID);
                    //let mess = response.message;
                    //e.control.Pop(mess !== null ? mess : "Operation could not be completed.Contact Administrator", "Predict");
                }
            }, beforeSend: function () {

            },
            complete: function () {
                getAnotTextJsonData = {};
            },
            error: function (x, status, error) {
                console.log(x);
                console.log(status)
                console.log(error)
            }
        });
    } else if ($(".annot_src_error").length === 0)
    {
        $("#annot_SrcText_input" + sessionStorage.controlID).addClass("annot_src_error");
        $("#src_text_errormessage_span" + sessionStorage.controlID).text("Source Domain/Variable is mandatory");

    }
}

function getSourceValue() {
    let tempAdditional = "";
    $('.annot_SrcText_input' + controlID).each(function () {
        let tempStore = $(this).val();
        if (tempStore !== "") {

            tempAdditional += tempAdditional !== "" ? " " + tempStore : tempStore;
        }
    });
    return tempAdditional;
}

function fnToClearAnnotText() {
    $('#annot_text_input' + controlID).val('');

    $('#annotTextParentSpan' + controlID).hide();

}

function toggleAnnotTextBoxIcon() {
   $('#annotTextParentSpan' + controlID).hide();
}

//checkbox onchange funcation
function fnAddToMapping(e)
{
    if (e && e.checked)
    {
        $("#annot_SrcText" + sessionStorage.controlID).show();
        let value = window.predictText;
        if (value && value !== "" && typeof value === "string" && value.trim() !== "")
        {
            $("#annot_PredictText" + sessionStorage.controlID).show();

            $("#annot_PredictText_btn").show();
        }
    }
    else
    {
        $("#annot_SrcText" + sessionStorage.controlID).hide();

        $("#annot_PredictText" + sessionStorage.controlID).hide();

        $("#annot_PredictText_btn").hide();

        let annot_var_text = $("#annot_text_input" + controlID).val();
        if (annot_var_text != "")
        {
            $("#annot_text_input" + controlID).removeClass("annot_tar_error");

            $("#var_text_errormessage_span" + controlID).text("");
        }
        $("#annot_Srctext_input" + controlID).removeClass("annot_src_error");

    }
}

function validatevartext(e)
{
    let annot_var_text = e.value;

    let idsOfMetaData = false;

    $("#var_text_errormessage_span" + controlID).text("");
    $("#annot_text_input" + controlID).removeClass("annot_tar_error");

    //Mandatory Validation
    if (annot_var_text === "")
    {
        $("#annot_text_input" + controlID).addClass("annot_tar_error");
        $("#var_text_errormessage_span" + controlID).text("Annotation Text is mandatory");
        return;
    }

    //Based on Checkbox vlaidation
    if ($("#annot_Mapcheck_input" + sessionStorage.controlID).is(":visible") &&
        $("#annot_Mapcheck_input" + sessionStorage.controlID).prop("checked"))
    {
        if (allDomianVars &&
            typeof allDomianVars === "object" &&
            annot_var_text && annot_var_text !== "")
        {
            let domain_data = allDomianVars.find(srcdom => srcdom.label === annot_var_text);
            idsOfMetaData = domain_data ? domain_data.data : false;
            if (!idsOfMetaData)
            {
                $("#annot_text_input" + controlID).addClass("annot_tar_error");
                $("#var_text_errormessage_span" + controlID).text("Invalid Target Domain/Variable");
                return;
            }
        }
    } 
}


function validatesrctext(e)
{
    let annot_src_text = e.value;
    let errormessage_span = $(e).parent().siblings().length > 0 ? $(e).parent().siblings()[0] : false;

    if (!e.value) {
        $(e).addClass("annot_src_error");
        $(errormessage_span).text("Source Domain/Variable is mandatory");
        return;
    }
    $(errormessage_span).text("");
    $(e).removeClass("annot_src_error");

    //Mandatory Validation
    //if (!annot_src_text && annot_src_text === "")
    //{
    //    $(e).css("border-color", "red");
    //    $(errormessage_span).text("Annotation Text is mandatory");
    //    return;
    //}

    if(allSrcVars &&
        typeof allSrcVars === "object" &&
        annot_src_text && annot_src_text !== "")
    {
        if (allSrcVars.indexOf(annot_src_text) === -1)
        {
            $(e).addClass("annot_src_error");
            $(errormessage_span).text("Invalid Source Domain/Variable");
        }
    } 
}


//when overall save and update
function fnValidateWhenAddUpdate(resolve, reject)
{
    //Mandatory Validation
    let annot_text = $("#annot_text_input" + controlID).val();
   
    let mapCheckbox = $("#annot_Mapcheck_input" + sessionStorage.controlID);
    let isAddToMap = (mapCheckbox.is(":visible") && mapCheckbox.prop("checked"));

    //validtaion 
    //if it is not connected to the mapping means validate only Annot Text Textbox only
    if ($(".annot_tar_error").length > 0 || (isAddToMap && $(".annot_src_error").length > 0)) {
        reject();
    }
    if (annot_text === "" || (isAddToMap && getSourceValue() === ""))
    {
        if (annot_text === "") {
            $("#annot_text_input" + controlID).addClass("annot_tar_error");
            $("#var_text_errormessage_span" + controlID).text("Annotation Text is mandatory");
        }
        if (getSourceValue() === "") {
            $("#annot_SrcText_input" + sessionStorage.controlID).addClass("annot_src_error");
            $("#src_text_errormessage_span" + sessionStorage.controlID).text("Source Domain/Variable is mandatory");
            reject();
        }
        reject();
    }
    
      
    //validtaion 
    //if it is connected to the mapping means
    //validate  Annot Text Textbox 
    //validate  Source/Domain Variable Textbox 

    else if (isAddToMap)
    {

        if (allDomianVars &&
            typeof allDomianVars === "object" &&
            annot_text && annot_text !== "")
        {
            let domain_data = allDomianVars.find(srcdom => srcdom.label === annot_text);
            idsOfMetaData = domain_data ? domain_data.data : false;

            if (!idsOfMetaData || annot_text.toLowerCase().replace(/ /g, "") === "noprediction")
            {
                $("#annot_text_input" + controlID).addClass("annot_tar_error");
                $("#var_text_errormessage_span" + controlID).text("Invalid Target Domain/Variable");
                reject();
                return;
            }
            resolve();
        }
    }
  
    else
    {
        resolve();
    }
}

//valid Json
function validJSON(jso) {
    try {
        return JSON.parse(jso);
    } catch(e) {
        return null;
    }
}

//Refresh
function when_open_TextAnnot_popup(custom)
{
    //Refresh 

    //Annotation textbox initialization
    $("#annot_text_input" + controlID).removeClass("annot_tar_error");
    $("#var_text_errormessage_span" + controlID).text("");

    //Map checkbox initialization
    const studyDetails = validJSON(sessionStorage.getItem("studyDetails"));

    if (studyDetails && typeof studyDetails === "object" && studyDetails.mappingRequried)
    {
        $("#annot_Mapcheck" + sessionStorage.controlID).show().prop("disabled", false);
        $("#annot_Mapcheck_input" + sessionStorage.controlID).prop('checked', true);

        //For Showing Predict Text when selected Area have some value
        if (window.predictText && window.predictText !== "" && custom !== "Edit") {
            $("#annot_PredictText" + sessionStorage.controlID).show();
            $("#annot_PredictText_btn").show();
        }
        else {
            $("#annot_PredictText" + sessionStorage.controlID).hide();
            $("#annot_PredictText_btn").hide();
        }

        //Source textbox initialization
        $('.sorceFieldGroup').remove();
        $("#annot_SrcText" + sessionStorage.controlID).css("display", "inline-block");
        $("#annot_SrcText_input" + sessionStorage.controlID).val("").removeClass("annot_src_error");
        $("#src_text_errormessage_span" + sessionStorage.controlID).text("");

        $("#annot_SrcText_control" + sessionStorage.controlID + " input").prop("disabled", false);
        $("#annot_SrcText_control" + sessionStorage.controlID + " span").css("pointer-events", "auto");              
    }
    else
    {
        $("#annot_PredictText_btn").hide();   
        $("#annot_Mapcheck" + sessionStorage.controlID).hide();
    }
}
function ConfirmationBeforeCancel()
{
    CloseDocuoment(fnToSavePDFDetails);
}