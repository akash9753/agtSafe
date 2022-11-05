
export function fnForSelect(value, prop, id, node) {
    
    //Both Variable and Value List
    if (id == "Origin") {
        fnOrigin(value, prop.formData, prop.props);  
    }
    //End
    //else 
    if (id == "CodeListName") {
        prop.props.GetCodeListGroupData(value, ({ formData: prop.formData, selectOptions: prop.selectOptions }));
    }
   else if (id == "DocumentType") {
        if (prop.props.getDropSelectedText != undefined)
        {
            prop.props.getDropSelectedText(value, node.props.children);
        }
    }//Method
    else if (id == "leafID")
    {
        fnToGetConditionOptions(value, prop.formData, prop.props);
    }
   else if (id == "ShortName") {
        if (prop.props.shortNameChange != undefined) {
            prop.props.shortNameChange(value);
        }
    }
    //variableName field change in ComplexWhereclause/AdvanceWhereClause modal
  else  if (id == "VariableName") {
        if (prop.props.variableNameChange != undefined) {
            prop.props.variableNameChange(value);
        }
    }
    else if (id == "Comparator") {
        if (value == "IN" || value == "NOT IN") {
            prop.formData.find(x => x.attributeName.replace(/ /g, "") === "Value").controlTypeText = "MultipleDropdown"
        } else {
            prop.formData.find(x => x.attributeName.replace(/ /g, "") === "Value").controlTypeText = "DropDown"

        }
        if (prop.props.comparatorChange != undefined) {
            prop.props.comparatorChange();
        }
    }
    else if (id == "Domain") {
        if (prop.props.domainNameChange != undefined) {
            prop.props.domainNameChange(value, "Change");
        }
    }
   
}

export function fnLoadOrigin(value, data, prop) {
    //for that metd decription button vaildation
    let methoddefaultvalue = data.find(x => x.displayName.replace(/ /g, "") === "MethodDescription").defaultValue;
    data.find(x => x.displayName.replace(/ /g, "") === "MethodDescription").defaultText = methoddefaultvalue;
    fnOrigin(value, data, prop);
}

export function fnCheck(e, prop, id)
{
    if (id == "ValueListID") {
        prop.ValueListValidation(e.target.checked);
    }
}

export function fnKeyUp(e,prop,id)
{
    if (id == "Title") {
        if(prop.fnTitleValidation != undefined){
            prop.fnTitleValidation(e.target.value);
        }
    }
    if (id == "SourceUnit") {
        var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
        if (!notAllowSymboAtBeginAndEnd.test(e.target.value)) {
            prop.props.form.setFields({
                SourceUnit: {
                    value: e.target.value,
                    errors: [new Error("Field cannot begins/ends with space")],
                }
            });
        }
    }
}
function fnToGetConditionOptions(value, data, prop, srcElem) {
    var temp = [];
    let tempFlag = prop.state.ConditionOptions;
    let conditionOptionsID = [];
    for (var i in tempFlag) {
        conditionOptionsID.push(tempFlag[i]);
    }
    // to update the affected Fileds based on the source field's selected value
    conditionOptionsID.map(function (condField) {
        (condField.fieldValueConditionList || []).map(function (item) {
            // to update the affected Filed's values(If DDL) based on the source field's selected value
            if (item.typeID == 12) {
                if (item.dropDownList != undefined && item.dropDownList.length > 0) {                
                    temp = [];
                    item.dropDownList.map(function (option) {

                        if (srcElem !== undefined && value === "CRF") {//only for origin field if value is "CRF"
                            option.sourceElement = "CRF";
                        }

                        if (value != null && (value == option.sourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                            temp.push(option);
                        }
                    });
                }
                if (prop.state.selectOptions != undefined) {
                    prop.state.selectOptions[item.affectedAttributeName.toLocaleLowerCase()] = temp;
                } else {
                    prop.state.responseData.selectOptions[item.affectedAttributeName.toLocaleLowerCase()] = temp;
                }
            }

            // to update the affected Filed's Editable Property based on the source field's selected value
            data.map(function (field) {
                if (field.defineFormFieldAttributeID == item.affectedFormFieldAttributeID) {
                    //Edit List
                    for (var i = 0; i < item.editableList.length; i++) {
                            //static                                                             //Dynamic
                            if (value != null && (value == item.editableList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                                field.editable = item.editableList[i].value;
                                break;
                            } else {
                                field.editable = !item.editableList[i].value;
                            }                      
                    }
                    //Hide List
                    for (var i = 0; i < item.hideList.length; i++) {
                        if (value != null && (value == item.hideList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                            field.hide = item.hideList[i].value;
                            break;
                        } else {
                            field.hide = !item.hideList[i].value;
                        }
                    }
                    //Mandatory List
                    for (var i = 0; i < item.mandatoryList.length; i++) {
                        if (value != null && (value == item.mandatoryList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                            field.mandatory = item.mandatoryList[i].value;
                            break;
                        } else {
                            field.mandatory = !item.mandatoryList[i].value;
                        }
                    }
                }
            });
        });
    });
}

function fnOrigin(value, data, prop) {

    fnToGetConditionOptions(value, data, prop, value);
     //For Method Description field
    if ( value != "CRF") {
         let methoddefaultvalue = data.find(x => x.displayName.replace(/ /g, "") === "MethodDescription").defaultText;
         data.find(x => x.displayName.replace(/ /g, "") === "MethodDescription").defaultValue = methoddefaultvalue;
         if (prop) {
             prop.props.form.setFieldsValue({ "MethodDescription": methoddefaultvalue, "DestinationType": null, "Pages": "", "LastPage": "", "FirstPage": ""});
            
         }
     } else {

         data.find(x => x.displayName.replace(/ /g, "") === "MethodDescription").defaultValue = "";
         if (prop) {
             document.getElementById("MethodDescriptionConfirm").disabled = true;
             let datas = { MethodDescription: "", PageRefs: "", LastPage: "", Type: "", FirstPage: "" };
            
             data.forEach(function (ke, ind) {
                 if (ke.attributeName == "PageRefs" || ke.attributeName == "MethodDescription" ||  ke.attributeName == "LastPage" || ke.attributeName == "FirstPage" || ke.attributeName == "Type") {
                     datas[ke.attributeName] = ke.defaultValue;     
                 }
             })
             prop.props.form.setFieldsValue({ "MethodDescription": datas.MethodDescription, "DestinationType": datas.Type, "Pages": datas.PageRefs, "LastPage": datas.LastPage, "FirstPage": datas.FirstPage});
         }
     }
}
export function fnForCheckBox(e, prop) {

    ////based on the origin dropdown disable and enable the @DataType field and @MethodDescription field
    if (e.target.id == "ValueListID") {
        if (e.target.checked) {
            prop.state.responseData.formData.find(x => x.displayName.replace(/ /g, "") === e.target.id).defaultValue = true;
        }
        else {
            prop.state.responseData.formData.find(x => x.displayName.replace(/ /g, "") === e.target.id).defaultValue = false;
            document.getElementById(e.target.id + "Text").value = "";
        }
    }
    ////End
}

function checkNullorbalnk(value) {
    if (typeof value == 'undefined') {
        return true;
    }
    if (value == "" || value == null) {
        return true;
    }
    return false;
}
export function dependencyValidation(rule, value, callback) {
    var check = true;
    if (checkNullorbalnk(value)) {
        check = false;
        executedependency(rule, value, check);
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;;

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        check = false;
        executedependency(rule, "", check);
        callback('');
        return;
    }
    if (regx.test(value)) {
        check = true;
        callback();
        executedependency(rule, value, check);
        return;
    }
    else {
        check = false;
        executedependency(rule, value, check);
    }
    callback('');
}





function executedependency(rule, value, check) {
    if (check) {
        //DefineBot Domain page CommentDescription text Area 
        if (rule.field == 'CommentDescription' || rule.field == 'MethodDescription') {
            document.getElementById(rule.field + "Confirm").disabled = false;
        }
        if (rule.data.controlTypeText == "SpecialSettings") {
            rule.data.defaultValue = value;
        }
    }
    else {
        //DefineBot Domain page CommentDescription text Area 
        if (rule.field == 'CommentDescription' || rule.field == 'MethodDescription') {
            document.getElementById(rule.field + "Confirm").disabled = true;
        }
        if (rule.data.controlTypeText == "SpecialSettings") {
            rule.data.defaultValue = "";
            rule.data.extCom = false;
        }
    }
}

export function fnForSelectFocus(thisobj) {
    //console.log("entered" + thisobj);
}