export const FnScript = `

    var controlID = sessionStorage.getItem("controlID");
    forsavecoordsJson ="";
    window.savedTextAnnotID =[];
    function slideupAdvancedOptions(){
        
        jQuery("#advancedOptionsPdfBody").slideUp();
        var faf = jQuery("#pdfCollapseFa");
        if(faf.hasClass('fa fa-fw fa-chevron-down')){
            faf.removeClass("fa fa-fw fa-chevron-down").addClass("fa fa-fw fa-chevron-right");
        }
    }
    function addTextAnnotation(elem) { //To Show text annotation dialog
        defaultAnnotStyle = {
            fill: true,
            annot_fillColor:"#FFFFFF",
            autoSize: true,
            borderWidth: 0.015,
            annot_strokeColor: "#0000FF",
            fontStyle: 0,
            fontSize: 10,
            annot_foreColor: "#0000FF",
            opacity: 1,
            annotText: "",
            alignment: 1,
            lineAlignment: 0
        };
         customEllipseVar=0;
        DocuViewareAPI.AddTextAnnotInteractive(controlID, defaultAnnotStyle, true, ["annotText","annot_foreColor","annot_fillColor","annot_strokeColor","stroke"]);
        var linkCheckbox = jQuery("#annot_linkCheck" + controlID);
        linkCheckbox.css("display", "inline-block");
         var strokeCheckbox = jQuery("#annot_strokeCheck" + controlID);
        strokeCheckbox.css("display", "inline-block");
        slideupAdvancedOptions();
       $("#annotationDialogForm"+controlID).addClass("customtextannotclass");
       }

   
    function addLineArrow(elem){ //To show line annotation dialog
        defaultStyle = {
          annot_strokeColor: "#0000FF",
            borderWidth:0.01,
        };
        customEllipseVar=0;
        DocuViewareAPI.AddLineAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor"]);
        slideupAdvancedOptions();
    }
    function addEclipse(elem){ //To show eclipse annotation dialog
        defaultStyle = {
         annot_strokeColor: "#0000FF",
            borderWidth:0.01,
            fill: true,
            annot_fillColor:"#FFFFFF",
            squaredBox: false,
            opacity:1,
            stroke:true,
        };
        customEllipseVar=0;
        DocuViewareAPI.AddEllipseAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor","annot_fillColor","fill", "opacity"]);
        slideupAdvancedOptions();
    }

customEllipseVar=0;
     function addEclipse1(elem){ //To show eclipse annotation dialog
       defaultStyle = {
          annot_strokeColor: "#0000FF",
            borderWidth:0.01,
           squaredBox: true,
        };
 
     customEllipseVar=1;
        DocuViewareAPI.AddCustomCircleLineAnnotInteractive(controlID, defaultStyle, false, []);
    }
     function addRect(elem){ //To show react annotatation dialog
        defaultStyle = {
           annot_strokeColor: "#0000FF",
            borderWidth:0.01,
            fill: true,
            annot_fillColor:"#FFFFFF",
            opacity:1
        };
            customEllipseVar=0;
        DocuViewareAPI.AddRectangleAnnotInteractive(controlID, defaultStyle, true, ["annot_strokeColor","annot_fillColor", "fill", "opacity"]);
        slideupAdvancedOptions();
    }
    function resetMouseMode(elem) { //To reset button css on mouse out
        jQuery(elem).removeClass("button_active");
        jQuery(elem).css("fill", "rgb(100, 100, 100)");
        DocuViewareAPI.SetMouseMode(controlID, 0);
        allPdfComp.dom.updateButtons();
    }
    function toggleMouseMode(elem) { //To Change Mouse mode
        var mouseMode = DocuViewareAPI.GetMouseMode(controlID);
        if(mouseMode == 0){
            jQuery(elem).addClass("button_active");
            jQuery(elem).css("fill", "rgb(3, 130, 212)");
            DocuViewareAPI.SetMouseMode(controlID,3);
        }else{
            resetMouseMode(elem);
        }
    }
    function addButtonHover(elem){ //add button hover css style
        jQuery(elem).addClass("button_hover");
        allPdfComp.dom.updateButtons();
    }
    function removeButtonHover(elem){ //Removing button hover on mouse out
        jQuery(elem).removeClass("button_hover");
        allPdfComp.dom.updateButtons();
    } 
    
   
    function linkSource(checkBox){ //on check box clicked
        var srcDomainVarElem = jQuery("#annot_SrcText" + controlID);
        if (checkBox.checked == true){
            srcDomainVarElem.val("");
            srcDomainVarElem.css("display", "inline-block");
        } else {
            srcDomainVarElem.css("display", "none");
        }
    }


function fnCopyAnnot(){
    var e = document.getElementById(controlID); if (e) { e.control.CustomCopyAnnotationButton_Click(); }
}

    function addButtons() { //Adding all required buttons to pdf viewer
        //console.log("AddingButtons");
        //Adding ToggleMouse Button
        jQuery(".dv-toolbar-buttons").append('<div id="ToggleMouseMode'+controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#ToggleMouseMode"+controlID).append('<button id="selectMouseModeButton'+controlID +'" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="toggleMouseMode(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Toggle Select Mode"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M0 2.655c0 44.976 0 89.952 0 134.929 18.57 0 37.141 0 55.712 0 0 78.942 0 157.883 0 236.825-18.57 0-37.141 0-55.712 0 0 45.864 0 91.728 0 137.591 45.861 0 91.722 0 137.583 0 0-18.57 0-37.141 0-55.712 78.945 0 157.888 0 236.833 0 0 18.57 0 37.141 0 55.712 45.861 0 91.722 0 137.584 0 0-45.861 0-91.722 0-137.583-18.568 0-37.135 0-55.704 0 0-78.945 0-157.888 0-236.833 18.567 0 37.135 0 55.702 0 0-45.862 0-91.722 0-137.583-45.861 0-91.721 0-137.58 0 0 18.57 0 37.141 0 55.712-78.942 0-157.885 0-236.827 0 0-18.57 0-37.141 0-55.712-45.863 0-91.725 0-137.589 0v2.655zM111.413 26.169c0 28.417 0 56.836 0 85.253-28.415 0-56.83 0-85.245 0 0-28.418 0-56.836 0-85.253 28.415 0 56.83 0 85.245 0zM485.832 26.169c0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 28.416 0 56.832 0 85.248 0zM374.416 81.872c0 18.57 0 37.141 0 55.712 18.57 0 37.141 0 55.712 0 0 78.945 0 157.888 0 236.833-18.57 0-37.141 0-55.712 0 0 18.568 0 37.135 0 55.704-78.942 0-157.885 0-236.827 0 0-18.568 0-37.135 0-55.704-18.57 0-37.139 0-55.709 0 0-78.945 0-157.888 0-236.833 18.57 0 37.139 0 55.709 0 0-18.57 0-37.141 0-55.712 78.942 0 157.885 0 236.827 0zM61.023 400.584c16.8 0 33.599 0 50.398 0 0 28.416 0 56.832 0 85.248-28.418 0-56.836 0-85.253 0 0-28.416 0-56.832 0-85.248 11.618 0 23.236 0 34.854 0zM450.983 400.584c11.616 0 23.233 0 34.849 0 0 28.416 0 56.832 0 85.248-28.416 0-56.832 0-85.248 0 0-28.416 0-56.832 0-85.248 16.8 0 33.599 0 50.399 0z"></path></svg></button>');
        
        //Adding TextAnnotation Button
        jQuery(".dv-toolbar-buttons").append('<div id="TextAnnotBtn'+controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#TextAnnotBtn"+controlID).append('<button id="AddtextAnnotBtn" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="addTextAnnotation(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Annotation"><svg viewBox="0 0 512 512" width="100%" height="100%"><g><path d="M43.419,109l-2.444,88h30.453l3.074-27.874c0.604-4.992,1.576-9.444,2.995-13.384c1.394-3.995,3.521-7.271,6.385-10.003c2.864-2.732,6.595-4.948,11.14-6.418c4.573-1.472,10.221-2.32,17-2.32H149v241.824c0,6.463-0.991,11.612-2.174,15.448c-1.182,3.836-2.992,6.727-5.041,8.829c-2.075,2.049-4.596,3.343-7.38,3.973c-2.811,0.683-5.99,0.926-9.378,0.926H107v24h155v-24h-18.951c-3.258,0-6.252-0.243-9.063-0.926c-2.785-0.63-5.256-1.961-7.384-4.009c-2.128-2.103-3.721-4.976-4.903-8.812c-1.182-3.836-1.698-8.967-1.698-15.43V137h36.056c6.751,0,12.428,0.865,16.973,2.337c4.572,1.471,8.275,3.638,11.142,6.371c2.889,2.733,5.018,6.075,6.41,10.069c1.392,3.94,2.391,8.342,2.968,13.333L296.86,197h30.215l-2.208-88H43.419z"></path><polygon points="471,28 471,0 416.925,0 389.875,0 336,0 336,28 390,28 390,485 336,485 336,512 471,512 471,485 417,485 417,28 	"></polygon></g></svg></button>');
        jQuery(".dv-toolbar-buttons").prepend('<div id="fnSave'+controlID+ '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#fnSave"+controlID).prepend('<div id="Save'+controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="dv-button dv-dropdown"  onclick="fnToSavePDFDetails();" title="Save"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path></svg></div>');

        //Adding Line Annotation Button
        jQuery(".dv-toolbar-buttons").append('<div id="ArrowBtn'+controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#ArrowBtn"+controlID).append('<button id="AddArrowBtn'+controlID +'" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="addLineArrow(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Line With Round Cap"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M18.027,508.886c-3.465,0-6.93-1.322-9.574-3.968c-5.29-5.289-5.29-13.858,0-19.147L484.646,9.604c5.289-5.29,13.858-5.29,19.147,0c5.289,5.289,5.289,13.858,0,19.148L27.601,504.918C24.956,507.563,21.491,508.886,18.027,508.886z"></path></svg></button>');
        
        //Adding Eclipse Annotation Button
        jQuery(".dv-toolbar-buttons").append('<div id="EclipseBtn'+controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#EclipseBtn"+controlID).append('<button id="AddEclipseBtn'+controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="addEclipse(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Eclipse"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M256,475C114.579,475-0.474,375.635-0.474,253.5S114.579,32,256,32c141.42,0,256.475,99.365,256.475,221.5S397.42,475,256,475z M256,55.315c-128.567,0-233.158,88.914-233.158,198.185c0,109.293,104.591,198.185,233.158,198.185c128.555,0,233.157-88.892,233.157-198.185C489.156,144.229,384.555,55.315,256,55.315z"></path></svg></button>');
        
        //Adding Round Annotation Button
        jQuery(".dv-toolbar-buttons").append('<div id="EclipseBtn1'+controlID + '"class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#EclipseBtn1"+controlID).append('<button id="AddEclipseBtn1'+controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="addEclipse1(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Round"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M256,475C114.579,475-0.474,375.635-0.474,253.5S114.579,32,256,32c141.42,0,256.475,99.365,256.475,221.5S397.42,475,256,475z M256,55.315c-128.567,0-233.158,88.914-233.158,198.185c0,109.293,104.591,198.185,233.158,198.185c128.555,0,233.157-88.892,233.157-198.185C489.156,144.229,384.555,55.315,256,55.315z"></path></svg></button>');
       
        //Adding Rectangle Annotation Button
        jQuery(".dv-toolbar-buttons").append('<div id="RectBtn'+controlID + '"class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
        jQuery("#RectBtn"+controlID).append('<button id="AddRectBtn'+controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid rgb(220, 220, 220); background-image: linear-gradient(rgb(255, 255, 255), rgb(215, 215, 215)); border-radius: 2px; background-repeat: repeat-x;" class="dv-button" type="button" onclick="addRect(this);" onmouseover="addButtonHover(this)" onmouseout="removeButtonHover(this)" title="Add Rectangle"><svg viewBox="0 0 512 512" width="100%" height="100%"><path d="M500.984,475H12.015C5.58,475,1,470.943,1,464.485V45.368C1,38.955,5.58,32,12.015,32h488.97C507.42,32,512,38.955,512,45.368v419.117C512,470.943,507.42,475,500.984,475z M23,451h467V56H23V451z"></path></svg></button>');
   
       //for Close
       $(".dv-toolbar-buttons").append('<div id="fnClose' + controlID + '" class="dv-buttons-container" style="padding-right:12px;border-left:1px solid #DCDCDC;"></div>');
       $("#fnClose" + controlID).append('<div id="Close' + controlID + '" style="margin-left: 12px; fill: rgb(100, 100, 100); width: 20px; height: 20px; background-color: transparent; border: 1px solid transparent; background-image: none; border-radius: 2px;" class="dv-button dv-dropdown"  onclick="CloseDoc();" title="Close Document"><svg viewBox="0 0 17 17" width="100%" height="100%"><path d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469 c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304 c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path></svg></div>');

        //Adding Text Annotaion Input to dialoglin
        jQuery("#annotationDialogFormContainer"+controlID).append('<div id="annot_text'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_text_label'+controlID + '" class="dv-form-line-label"><label for="annot_text_input'+controlID + '">Annotation Text</label></div><div id="annot_text_control'+controlID + '" class="dv-form-line-control-large"><input name="annot_text_input'+controlID + '" type="text" id="annot_text_input'+controlID + '" style="width: 100%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
        
        //Adding Check Box
        jQuery("#annotationDialogFormContainer"+controlID).append('<div id="annot_linkCheck'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_linkCheck_label'+controlID + '" class="dv-form-line-label"><label for="annot_linkCheck_input'+controlID + '">Link with Source Variable?</label></div><div id="annot_linkCheck_control'+controlID + '" class="dv-form-line-control-large"><input name="annot_linkCheck_input'+controlID + '" type="checkbox" onclick="linkSource(this)" id="annot_linkCheck_input'+controlID + '" style="width: 93%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
        jQuery("#annotationDialogFormContainer"+controlID).append('<div id="annot_strokeCheck'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_strokeCheck_label'+controlID + '" class="dv-form-line-label"><label for="annot_strokeCheck_input'+controlID + '">Stroke</label></div><div id="annot_strokeCheck_control'+controlID + '" class="dv-form-line-control-large"><input name="annot_strokeCheck_input'+controlID + '" type="checkbox"  id="annot_strokeCheck_input'+controlID + '" style="width: 93%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
       
         //Adding Text Annotaion Input to dialog
        jQuery("#annotationDialogFormContainer"+controlID).append('<div id="annot_SrcText'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_SrcText_label'+controlID + '" class="dv-form-line-label"><label for="annot_SrcText_input'+controlID + '">Source Domain/Variable</label></div><div id="annot_SrcText_control'+controlID + '" class="dv-form-line-control-large">'+
        '<div class = "input-group">'+
            '<input type ="text" class= "form-control addsourcefield annot_SrcText_input'+controlID + '" name="annot_SrcText_input'+controlID + '" type="text" id="annot_SrcText_input'+controlID + '" >'+
            '<span class = "input-group-addon" style="cursor:pointer" onclick="fnToAddSourceTextbox()">+</span>'+
        '</div>'+

'</div></div>');
        
        var collpasePanel =     '   <div class="pdfCollapseContainer" class="dv-form-line dv-annotation-control" >  '  + 
                                '       <div id="pdfCollapseContainerHeader" style="margin-top:20px; margin-bottom:20px"><span><i id="pdfCollapseFa" class="fa fa-fw fa-chevron-right"></i> Advanced Options</span>  '  + 
                                '       </div>  '  + 
                                '       <div id="advancedOptionsPdfBody" class="content">  '  + 
                                '       </div>  '  + 
                                '  </div>  ' ; 
        
        jQuery("#annotationDialogFormContainer"+controlID).append(collpasePanel);
        
        jQuery("#pdfCollapseContainerHeader").click(function () {
            $header = jQuery(this);
            $content = $header.next();
            $content.slideToggle(500, function () {
                if($content.is(":visible")){
                    jQuery("#pdfCollapseFa").removeClass("fa fa-fw fa-chevron-right").addClass("fa fa-fw fa-chevron-down");
                }else{
                    jQuery("#pdfCollapseFa").removeClass("fa fa-fw fa-chevron-down").addClass("fa fa-fw fa-chevron-right");
                }
            });
        });
        jQuery("#annot_text"+controlID).on('show', function() {
              $header = jQuery("#pdfCollapseContainerHeader");
            $content = $header.next();
            $content.slideUp();
        });
      
        //Adding Fore Color Input to dialog
        jQuery("#advancedOptionsPdfBody").append('<div id="annot_foreColor'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_foreColor_label'+controlID + '" class="dv-form-line-label"><label for="annot_foreColor_input'+controlID + '">Text Color</label></div><div id="annot_foreColor_control'+controlID + '" class="dv-form-line-control-large"><input name="annot_foreColor_input'+controlID + '" type="color" class="color" id="annot_foreColor_input'+controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
        
        //Adding Fill Color Input to dialog
        jQuery("#advancedOptionsPdfBody").append('<div id="annot_fillColor'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_fillColor_label'+controlID + '" class="dv-form-line-label"><label for="annot_fillColor_input'+controlID + '">Fill Color</label></div><div id="annot_fillColor_control'+controlID + '" class="dv-form-line-control-large"><input  name="annot_fillColor_input'+controlID + '" type="color"  class="color" id="annot_fillColor_input'+controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
        
        //Adding Stroke Color Input to dialog
        jQuery("#advancedOptionsPdfBody").append('<div id="annot_strokeColor'+controlID + '" class="dv-form-line dv-annotation-control" style="display: none;"><div id="annot_strokeColor_label'+controlID + '" class="dv-form-line-label"><label for="annot_strokeColor_input'+controlID + '">Stroke Color</label></div><div id="annot_strokeColor_control'+controlID + '" class="dv-form-line-control-large"><input name="annot_strokeColor_input'+controlID + '" class="color" type="color" id="annot_strokeColor_input'+controlID + '" style="width: 50%; border-color: rgb(100, 100, 100); color: rgb(100, 100, 100);"></div></div>');
       
       

        jQuery("#annotationActionButtons"+controlID).append('<div  style="display: none;" class="agjscustomcopy" id="annotationActionButtonsSplitter1'+controlID + '" style="cursor:pointer;fill: rgb(100, 100, 100); height: 16px; width: 1px; margin-left: 8px; margin-right: 8px; float: left; border-right: 1px solid rgb(100, 100, 100); display: none;"></div><div id="AddCopyAnnot'+controlID + '" style="fill: rgb(100, 100, 100); height: 16px; width: 16px; float: left;" title="Copy Annotation" onmouseover="fnOnmouseOver(this)" onmouseout="fnOnMouseOut(this)" onclick="fnCopyAnnot();"><svg class="svg-icon" viewBox="0 0 20 20"><path d="M17.927,5.828h-4.41l-1.929-1.961c-0.078-0.079-0.186-0.125-0.297-0.125H4.159c-0.229,0-0.417,0.188-0.417,0.417v1.669H2.073c-0.229,0-0.417,0.188-0.417,0.417v9.596c0,0.229,0.188,0.417,0.417,0.417h15.854c0.229,0,0.417-0.188,0.417-0.417V6.245C18.344,6.016,18.156,5.828,17.927,5.828 M4.577,4.577h6.539l1.231,1.251h-7.77V4.577z M17.51,15.424H2.491V6.663H17.51V15.424z"></path></svg></div>');
    }

function fnOnmouseOver(e)
{
$(e).css('cursor','pointer');
$(e).css('fill','#A2A2A2');
}

function fnOnMouseOut(e){
$(e).css('cursor','default');$(e).css('fill','#646464');
}
    var getSelectedAreaText = function () { // To get selected area text
        var coords = DocuViewareAPI.GetSelectionAreaCoordinates(controlID);

            var top1 = coords.top - 5;
            top1 = (top1 < 0)?0:top1;
            var left = coords.left - 5;
            left = (left < 0)?0:left;
            var height= coords.height + 5;
            height=(height > 11)?11:height;
            var width= coords.width + 5;
            width=(width > 8.5)?8.5:width;


        var coordsJson = {
            "left": left,
            "top": top1,
            "width": width,
            "height": height
        };
        DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response) {
                //console.log(response.value);
            }); 
    }
    function rgb2hex(rgb){ //rgba value to hex conversion
        rgb = rgb.replace("rgba(", "");
        rgb = rgb.replace(")", "");
        rgb = rgb.split(",");
        var hexval = ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2);
        return ("#"+hexval);
    }

   getAnotTextJsonData={};

   var fnToSaveAnnotText = function (a) { 

    if(a.getAnotTextJsonData != undefined)
    {
      let data = fnToFormInputToSaveTextAnnot(a.getAnotTextJsonData);
       if(a.getAnotTextJsonData.annotApp.properties.type == 8)
        {
            document.getElementById("annot_linkCheck_input"+controlID).checked=false;       
            document.getElementById("annot_SrcText_input"+controlID).value=null;
            $("#annot_SrcText_input"+controlID).attr("data",0);
            $('.sorceFieldGroup').remove();
            data["AnnotationID"]=a.id;
       
            var temp=data;
            
             //For to find the nearest Area text 
             var pagWidth=a.a.Internal.Pages.getPageWidth(DocuViewareAPI.GetCurrentPage(controlID));
             var pagHeight=a.a.Internal.Pages.getPageHeight(DocuViewareAPI.GetCurrentPage(controlID));

            var top1 = temp.TopCoordinate - 5;
                top1 = (top1 < 0)?0:top1;
                var left = temp.LeftCoordinate - 5;
                left = (left < 0)?0:left;
                var height= temp.AnnotationHeight + 5;
                height=(height > pagHeight)?pagHeight:height;
                var width= temp.AnnotationWidth+ 5;
                width=(width > pagWidth)?pagWidth:width;


            var coordsJson = {
                "left": left,
                "top": top1,
                "width": width,
                "height": height
            };

         const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Create";

          //This is the function to find the nearest area text 
          
           DocuViewareAPI.PostCustomServerAction(controlID, true, "GetSelectedText", coordsJson, function (response) {
            data.VicinityText = response.value;
             $.ajax({
                headers: {
                "Authorization": sessionStorage.getItem("authorizeToken")
                },
                 type: "POST",
                    url: urlBase,
                    contentType: 'application/json; charset=utf-8',
                    dataType:"json",
                    data: JSON.stringify(data),            
                    success: function (response)
                    {
                        var e = document.getElementById(sessionStorage.controlID);                             
                          if(response.status == 1)
                         {
                             window.savedTextAnnotID.push(response.value);
                             //console.log("success");    
                          }
                        else{
                             //console.log("error");    
                            a.a.DeleteAnnotationById(a.id)
                        }
                    },
                    beforeSend: function ()
                    {
                    },
                    complete: function ()
                    {
                        getAnotTextJsonData={};
                    },
                    error: function (x, status, error)
                    {
                     //console.log(x);
                        //console.log(status)
                        //console.log(error)
                    }

              })
             })
            }
   }   
  }

  var fnToUpdateAnnotText = function (a) { // To get selected area text
       const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Update";

    if(a.b != undefined){
       if(a.b.annotApp.properties.type == 8){
      let data = fnToFormInputToSaveTextAnnot(a.getAnotTextJsonData);

       document.getElementById("annot_linkCheck_input"+controlID).checked=false;       
       document.getElementById("annot_SrcText_input"+controlID).value=null;
       $("#annot_SrcText_input"+controlID).attr("data",0);

        $('.sorceFieldGroup').remove();

       data["AnnotationID"]=a.id;
       data["ChangeReason"]="Updated";
     (a.c.annotApp = a.b.annotApp,a.c.reset(), a.c.render(), a.a.updateThumbnails([a.b.pageNo]))

      var temp=data;
     var pagWidth=a.a.Internal.Pages.getPageWidth(DocuViewareAPI.GetCurrentPage(controlID));
     var pagHeight=a.a.Internal.Pages.getPageHeight(DocuViewareAPI.GetCurrentPage(controlID));

     var top1 = temp.TopCoordinate - 5;
            top1 = (top1 < 0)?0:top1;
            var left = temp.LeftCoordinate - 5;
            left = (left < 0)?0:left;
            var height= temp.AnnotationHeight + 5;
            height=(height > pagHeight)?pagHeight:height;
            var width= temp.AnnotationWidth+ 5;
            width=(width > pagWidth)?pagWidth:width;


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
            dataType:"json",
            data: JSON.stringify(data),            
            success: function (response)
            {
                var e = document.getElementById(sessionStorage.controlID);                             
                  if(response.status == 1){
                        (a.c.annotApp = a.b.annotApp,a.c.reset(), a.c.render(), a.a.updateThumbnails([a.b.pageNo]));
                     //console.log("success");    
                  }
                else{
                     //console.log("error");    

                }
              
            },
            beforeSend: function ()
            {
            },
            complete: function ()
            {
                getAnotTextJsonData={};
            },
            error: function (x, status, error)
            {
                //console.log(x);
                //console.log(status)
                //console.log(error)
            }

      })
    })
    }
   }
  }

    function toUpperCaseFirstLetter(lower){
        return lower.charAt(0).toUpperCase() + lower.substring(1);
    }
  function fnToSavePDFDetails() {
        var parseData=JSON.parse(sessionStorage.pdfDetails);
        var studyFile = {
            
        };
        
        Object.keys(parseData.studyFile).forEach(function(key) {
          var newKey = toUpperCaseFirstLetter(key);
            studyFile[newKey] = parseData.studyFile[key];
        });

         forsavecoordsJson = {
            "DocTempPath": parseData.docTempPath,
            "StudyID":parseData.studyID
        };
        
        DocuViewareAPI.PostCustomServerAction(controlID, true, "SaveAnnotPdf", forsavecoordsJson, function (response) {
        var e = document.getElementById(sessionStorage.controlID);                             
            if(response != null && response.Status == 1){
              forsavecoordsJson["ObjectID"] = parseData.objectID;
              forsavecoordsJson["studyFile"] = studyFile;
              forsavecoordsJson["controlID"] = controlID;
              forsavecoordsJson["DocNewPath"] = response.DocNewPath;
              savePdfToDB(forsavecoordsJson);
            }
       });
        
     }

    function savePdfToDB(postData){
        const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/Pdf/SavePdf";
        postData["studyFile"].UpdatedBy = JSON.parse(sessionStorage.userProfile).userID;
           var e = document.getElementById(sessionStorage.controlID);       
           $.ajax({
            headers: {
            "Authorization": sessionStorage.getItem("authorizeToken")
            },
             type: "POST",
                url: urlBase,
                contentType: 'application/json; charset=utf-8',
                dataType:"json",
                data: JSON.stringify(postData),            
                success: function (response)
                { 
                 if(response.status == 1){
                     window.savedTextAnnotID =[];
                     e.control.Pop("Document saved successfully","Save");    
                  }
                },
                beforeSend: function ()
                {
                },
                error: function (x, status, error)
                {
                    e.control.Pop("Unable to save CRF!","Save CRF");    
                    //console.log(x);
                    //console.log(status);
                    //console.log(error);
                }

          });
    }

   function fnToDeleteAnnot(a) {
      if(a.type == 3){
        const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/Delete";
       fnTest(a);
       var data ={annotationID:a.id,changeReason:"Deleted",TimeZone:"IST",UpdatedBy:JSON.parse(sessionStorage.userProfile).userID};
           var e = document.getElementById(sessionStorage.controlID);       
           $.ajax({
            headers: {
            "Authorization": sessionStorage.getItem("authorizeToken")
            },
             type: "POST",
                url: urlBase,
                contentType: 'application/json; charset=utf-8',
                dataType:"json",
                data: JSON.stringify(data),            
                success: function (response)
                { 
                  if(response.status == 1){
                     //console.log("Annotation deleted successfully");    
                  }
                  else{
                     //console.log("Annotation not deleted successfully");    
                  }
                },
                beforeSend: function ()
                {
                },
                complete: function ()
                {
                    getAnotTextJsonData={};
                },
                error: function (x, status, error)
                {
                    //console.log(x);
                    //console.log(status)
                    //console.log(error)
                }

          })
         }
     }
     window.textAnnotDelete =function (savedTextAnnotID) {
      if(savedTextAnnotID.length > 0){
       const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/AnnotationData/MultipleDelete";
       var data ={AnnotIDs:savedTextAnnotID.toString(),changeReason:"Deleted",TimeZone:"IST",UpdatedBy:JSON.parse(sessionStorage.userProfile).userID};
           var e = document.getElementById(sessionStorage.controlID);       
           $.ajax({
            headers: {
            "Authorization": sessionStorage.getItem("authorizeToken")
            },
             type: "POST",
                url: urlBase,
                contentType: 'application/json; charset=utf-8',
                dataType:"json",
                data: JSON.stringify(data),            
                success: function (response)
                { 
                  if(response.status == 1){
                     //console.log("Annotation deleted successfully");    
                  }
                  else{
                     //console.log("Annotation not deleted successfully");    
                  }
                },
                beforeSend: function ()
                {
                },
                complete: function ()
                {
                    getAnotTextJsonData={};
                },
                error: function (x, status, error)
                {
                    //console.log(x);
                    //console.log(status)
                    //console.log(error)
                }

          })
    }
         
     }
$("#viewerContainer"+controlID).keyup(function (e) {
    if (e.ctrlKey) {
        if (e.keyCode == 86) {
            if (PasteWithCtrlKey) {
            
                tempObject.Internal.Annotations.addMultipleAnnotInteractive();

             }
        }
    }
})
function fnTest(a){
    DocuViewareAPI.PostCustomServerAction(controlID, true, "DeleteOldCircleWhenMove", {value:a.id,isDelete:a.delete} , function (response) { 
       if(!a.delete)
        var prop=DocuViewareAPI.GetAnnotPropertiesValues(controlID,6);
          prop.left=response.Left;
          prop.top=response.Left;
        allPdfComp.Internal.Annotations.addCustomCircleWithLine(prop)

    });

}
    DocuViewareAPI.RegisterOnAnnotationEdited(controlID,fnToUpdateAnnotText);
    DocuViewareAPI.RegisterOnAnnotationAdded(controlID,fnToSaveAnnotText);
    DocuViewareAPI.RegisterOnAnnotationDeleted(controlID,fnToDeleteAnnot);
    DocuViewareAPI.RegisterOnAreaSelected(controlID, getSelectedAreaText);
    resetMouseMode(document.getElementById("selectMouseModeButton"+controlID));
    DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID,8,["annotText","annot_foreColor","annot_fillColor","annot_strokeColor"]);
    DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID,3,["annot_strokeColor","squaredBox"]);
    DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID,6,["annot_fillColor","annot_strokeColor","fill", "opacity"]);
    DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID,1,["annot_fillColor","annot_strokeColor","fill", "opacity"]);
    DocuViewareAPI.CollapseSnapInPanel(controlID);
    allPdfComp.Internal.Annotations.defaultProperties[8]["annotText"] = "Text";
    allPdfComp.Internal.Annotations.defaultProperties[8]["annot_fillColor"] = "#FFFFFF";
    allPdfComp.Internal.Annotations.defaultProperties[8]["annot_foreColor"] = "#0000FF";
    allPdfComp.Internal.Annotations.defaultProperties[8]["annot_strokeColor"] = "#0000FF";
    allPdfComp.Internal.Annotations.defaultProperties[3]["annot_strokeColor"] = "#0000FF";
    allPdfComp.Internal.Annotations.defaultProperties[6]["annot_fillColor"] = "#FFFFFF";
    allPdfComp.Internal.Annotations.defaultProperties[6]["annot_strokeColor"] = "#0000FF";
    allPdfComp.Internal.Annotations.defaultProperties[1]["annot_fillColor"] = "#FFFFFF";
    allPdfComp.Internal.Annotations.defaultProperties[1]["annot_strokeColor"] = "#0000FF";
    addButtons();
    addAutoComplete();
  
function addAutoComplete() {
    //Adding auto complete suggestion to text box
    jQuery("#annot_text_input"+controlID).autocomplete({
        source: function (request, response) {
            var results = jQuery.ui.autocomplete.filter(allDomianVars, request.term);
            response(results.slice(0, 25));
        },
        minLength: 2,
        delay: 0,
        appendTo: "#annotationDialogForm"+controlID,
        select: function (e, ui) {
            jQuery("#annot_text_input"+controlID).attr("data",JSON.stringify(ui.item.data))
        },

    });
    jQuery(".annot_SrcText_input"+controlID).autocomplete({
        source: function (request, response) {
            var results = jQuery.ui.autocomplete.filter(allSrcVars, request.term);
            response(results.slice(0, 25));
        },
        minLength: 2,
        delay: 0,
        appendTo: "#annotationDialogForm"+controlID
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
function fnToFormInputToSaveTextAnnot(c) {
    //console.log(c);
  let x=c.annotApp.properties;

    var sourcetarget = "";
    if (document.getElementById("annot_linkCheck_input"+controlID).checked) {
        sourcetarget = fnToGetSourceValue();
    }
    let tempStore = $("#annot_text_input"+controlID).attr("data");

    let idsOfMetaData=(tempStore != 0 || tempStore != '')?JSON.parse($("#annot_text_input"+controlID).attr("data")):0;

    var data = 

   {
    StudyID:JSON.parse(sessionStorage.studyDetails).studyID,CRFDocumentID:3,
    AnnotationText:x.text,
    CDISCDataStdDomainMetadataID:(idsOfMetaData != 0)? idsOfMetaData.StdDomainMetadataID:0,
    CDISCDataStdVariableMetadataID:(idsOfMetaData != 0)? idsOfMetaData.StdVariableMetadataID:0,
    SourceDataSet:(sourcetarget != "")? sourcetarget[0].toString():"test",
    SourceVariableName:(sourcetarget != "")? sourcetarget[1].toString():"test",
    TargetDataSet:x.text.split(".")[0] == undefined ? 'test' : x.text.split(".")[0],
    TargetVariableName:x.text.split(".")[1] == undefined ? 'test' : x.text.split(".")[1],
    VicinityText:'test',
    PageNumber: c.annotApp.pageNo,PageOrientation:x.fontStyle,AnnotationShape:x.type,BorderColor:x.strokeColor,BorderWidth:x.borderWidth,FontSize:x.fontSize,FontStyle:x.fontStyle,
    FontColor:x.strokeColor,FillColor:x.fillColor,TopCoordinate:x.top,LeftCoordinate:x.left,AnnotationHeight:x.height,AnnotationWidth:x.width,
    TimeZone:"IST",UpdatedBy:JSON.parse(sessionStorage.userProfile).userID
   };
    $("#annot_SrcText_input"+controlID).attr("data",0);
    $('.sorceFieldGroup').remove();
    return data;
}
var colorpick=0;
$(".color").click(function(e){
colorpick=1;
})

$("#main"+controlID).keydown(function (event) {
    if ((event.keyCode == 107 && event.ctrlKey == true) || (event.keyCode == 109 && event.ctrlKey == true)) {
        event.preventDefault();
    }

    $("#main"+controlID).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    });
});

$('#annot_text_input'+controlID).keyup(function(){
  $('#annot_text_input'+controlID).attr("data",0);
});

//Fn for Adding Multiple Source TextBox
function fnToAddSourceTextbox()
{
    jQuery("#annot_SrcText_control"+controlID).append(
        '<div class = "input-group sorceFieldGroup" style="padding-top:5px">'+
            '<input type ="text" class= "form-control addsourcefield annot_SrcText_input'+controlID + '" name="annot_SrcText_input'+controlID + '" type="text" id="annot_SrcText_input'+controlID + '" >'+
            '<span class = "input-group-addon" style="cursor:pointer" onclick="fnToDeleteSourceTextbox(this)" style="padding:4px 13px">-</span>'+
        '</div>');
        addAutoComplete();
}
function fnToDeleteSourceTextbox(e){
  $(e.parentElement).remove()
}
function fnToGetSourceValue (){
  let tempTargetDataSetValue=[];
  let tempTargetVariableNameValue=[];
   $('.annot_SrcText_input'+controlID).each(function (){
      let tempStore = $(this).val();
      if(tempStore != "")
      {
        
        (tempStore.split('.')[0] != undefined)? tempTargetDataSetValue.push(tempStore.split('.')[0]) :  "TEST";
        (tempStore.split('.')[1] != undefined)? tempTargetVariableNameValue.push(tempStore.split('.')[1]) :  "TEST"
      }
    })
   return [tempTargetDataSetValue,tempTargetVariableNameValue];
}
`;
