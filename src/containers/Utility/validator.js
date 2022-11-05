import { CallServerPost, PASS_KEY_UI, encryptSensitiveData, getProjectRole } from '../Utility/sharedUtility';

export function checkNullorbalnk(value) {
    if (typeof value == 'undefined') {
        return true;
    }
    if (value == "" || value == null) {
        return true;
    }
    return false;
}
export function checkPhoneNumber(rule, value, callback) {

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function fnSwitch(e, prop, id) {
    if (id == "AnnotationRequired" || id == "MappingRequried" || id == "DefineRequired") {
        prop.switchfn(e, id);

    }
}

export function fnForBrowse(e, prop, id) {
    prop.state.responseData.formData.find(x => x.attributeName.replace(/ /g, "") === id).defaultValue = e.target.value;
}


export function fnForSelect(value, prop, id, node) {
    if (typeof (value) == "string") {
        value = value.split(",");
    }
    if (id == "StandardID" || id == "CDISCDataStandardID" || id == "RuleApplicableLevel" || id == "CDISCDataStdDomainClassID" || id == "CDISCDataStdDomainMetadataID" || id == "CDISCDataStdVersionID") {
        var stateCondition = {};
        if (prop.state != undefined) {
            stateCondition = prop.state;

        } else {
            stateCondition = prop.props.state;

        }
    }

    if ((id == "StandardID" || id == "CDISCDataStandardID" || id == "RuleApplicableLevel" || id == "CDISCDataStdDomainClassID" || id == "CDISCDataStdDomainMetadataID" || id == "CDISCDataStdVersionID") && stateCondition.responseData.ConditionOptions !== undefined) {
        let state = {};
        let props = {};
        if (prop.state != undefined) {
            state = prop.state;
            props = prop.props;
        } else {
            state = prop.props.state;
            props = prop.props.props;
        }
        let newVals = [];
        var temp = [];
        let tempFlag = state.responseData.ConditionOptions;
        let conditionOptionsID = [];
        conditionOptionsID.push(tempFlag[id.toLocaleLowerCase()]);


        // to update the affected Fileds based on the source field's selected value
        conditionOptionsID.map(function (condField) {
            value.forEach(function (val) {
                (condField.fieldValueConditionList || []).map(function (item) {

                    // to update the affected Filed's values(If DDL) based on the source field's selected value
                    if (item.typeID == 12) {
                        if (item.dropDownList != undefined && item.dropDownList.length > 0) {
                            temp = [];
                            item.dropDownList.map(function (option) {
                                if (item.affectedAttributeName == "CDISCDataStdDomainMetadataID" || item.affectedAttributeName == "CDISCDataStdDomainClassID") {
                                    if (props.form.getFieldValue("CDISCDataStdVersionID") == option.sourceElement) {
                                        temp.push(option);
                                    }
                                } else {
                                    if (val != null && (val == option.sourceElement || option.sourceElement === "0")) {
                                        temp.push(option);
                                    }
                                }
                            });
                        }
                        if (state.selectOptions != undefined) {
                            state.selectOptions[item.affectedAttributeName.toLocaleLowerCase()] = temp;
                        } else {
                            if (condField.fieldValueConditionList.length === 1) {
                                state.responseData.selectOptions[item.affectedAttributeName.toLocaleLowerCase()] = temp;
                            } else {
                                if (val == item.affectedAttributeValue) {
                                    state.responseData.selectOptions[item.affectedAttributeName.toLocaleLowerCase()] = temp;
                                }
                            }
                        }
                    }
                    // to update the affected Filed's Editable Property based on the source field's selected value
                    state.responseData.formData.map(function (field) {
                        if (field.formFieldAttributeID == item.affectedFormFieldAttributeID) {
                            //Edit List
                            for (var i = 0; i < item.editableList.length; i++) {
                                //static                                                             //Dynamic
                                if (val != null && (val == item.editableList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                                    field.editable = item.editableList[i].value;
                                    break;
                                }
                                //else {
                                //    field.editable = !item.editableList[i].value;
                                //}
                            }
                            //Hide List
                            for (var i = 0; i < item.hideList.length; i++) {
                                if (val != null && (val == item.hideList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                                    field.hide = item.hideList[i].value;
                                    break;
                                }
                                //else {
                                //    field.hide = !item.hideList[i].value;
                                //}
                            }
                            //Mandatory List
                            for (var i = 0; i < item.mandatoryList.length; i++) {
                                if (val != null && (val == item.mandatoryList[i].SourceElement || item.affectedAttributeValue == condField.formFieldAttributeID)) {
                                    field.mandatory = item.mandatoryList[i].value;
                                    break;
                                }
                                //else {
                                //    field.mandatory = !item.mandatoryList[i].value;
                                //}
                            }
                        }
                    });

                    //the following if used to change child DDL based on the Parent DDL
                    if (tempFlag[id.toLocaleLowerCase()].stringColumn1 != null) {
                        let tempStore = tempFlag[id.toLocaleLowerCase()].stringColumn1.split(",");
                        let childDDLName = [];
                        if (tempStore.length > 0) {
                            tempStore.forEach(function (key) {
                                // value.forEach(function (vals) {
                                childDDLName.push(state.responseData.formData.find(x => x.formFieldAttributeID == key).attributeName);
                                if (val == null) {
                                    state.responseData.formData.find(x => x.formFieldAttributeID == key).editable = false;
                                } else {
                                    if (conditionOptionsID[0].fieldValueConditionList.length === 1) {
                                        if (conditionOptionsID[0].affectedFormFieldAttributeID != key) {
                                            state.responseData.formData.find(x => x.formFieldAttributeID == key).editable = false;
                                        }
                                    } else {
                                        //conditionOptionsID[0].fieldValueConditionList.forEach(function (valueCondKey) {
                                        if (val == item.affectedAttributeValue && item.affectedFormFieldAttributeID != key &&
                                            value.indexOf(state.responseData.formData.find(x => x.formFieldAttributeID == key).displayName.replace(/ /g, "")) == -1) {
                                            state.responseData.formData.find(x => x.formFieldAttributeID == key).editable = false;
                                        }
                                        // });
                                    }
                                }
                                //});
                            });
                            props.form.resetFields(childDDLName);
                        }
                    }
                    //end of if
                });
            });
        });


    }
    else if (id == "defineOutputVersionID") {
        prop.LoadStandardElement(value)
    }
    else if (id == "DocumentType") {
        if (prop.getDropSelectedText != undefined) {
            prop.getDropSelectedText(value, node.props.children);
        }
    }
    else if (id == "Question1" || id == "Question2" || id == "Question3") {
        prop.selectDependencyChange(value, id);
    } else if (id === "CountryID") {
        prop.form.setFieldsValue({ "Telephone": "" })
    } else if (id === "TargetDomain") {
        prop.targetDomainOnChange(value);
    }
    else if (id === "ProjectID") {
        prop.projectOnChange(value);
    } else if (id === "CodeListVersion") {
        prop.codeListVersionOnChange(value);
    } else if (id === "CodeListName") {
        prop.codeListNameOnChange(value);
    }
}


export function fnFileSelect(value, node, extra, prop, id, e) {
    if (id == "StudyRelatedDocument") {
        prop.getTitleFrFile(value, node, extra, prop, id);

    }
}
export function fnDefineBotExternal(textID, checkBoxID) {
    if (document.getElementById(textID).value != "" && document.getElementById(textID).value != null) {
        document.getElementById(checkBoxID).disabled = false;
    }
    else {
        document.getElementById(checkBoxID).disabled = false;
        document.getElementById(checkBoxID).checked = false;

    }
}

export function checkAlphabet(rule, value, callback) {
    if (checkNullorbalnk(value)) {
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
        callback('');
        return;
    }

    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}
export function fnForAlphaNumericUnderscore(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;;


    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkAlphaNumeric(rule, value, callback) {

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;;
    if (regx.test(value)) {
        callback();
        return;
    }


    callback('');
}



export function checkPassword(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    const projectRole = getProjectRole();
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    if (rule.field === 'CurrentPassword') {

        let url = "Users/CheckUserPassword";
        let data = { UserPassword: encryptSensitiveData(value, PASS_KEY_UI), UserName: projectRole.userProfile.userName };
        checkExist(url, data, callback, rule.field, rule);

    }

    else if (rule.field === 'NewPassword') {
        if (document.getElementById("CurrentPassword").value === value) {
            rule.message = "New Password should not be equal to Current Password";
            callback('');
            return;
        }
        else
            if (regx.test(value)) {
                callback();
                return;
            }
        callback('');
    }
    else if (rule.field === 'ConfirmPassword') {
        if (document.getElementById("NewPassword").value === value) {
            callback();
            return;
        }
        callback('');
    }

}


export function checkAlphaNumericSpecial(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkAlphaNumericUnderscore(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkAlphaNumericHypen(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkAlphaNumericUnderscoreHypen(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}


export function checkAlphaNumericUnderscoreHypenAndSpace(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkCheckBox(rule, value, callback) {
    if (value) {
        callback();
        return;
    }
    callback('');
}
export function CheckRadioGroup(rule, value, callback) {
    if (value) {
        callback();
        return;
    }
    callback('');
}
export function checkSelectForStudyDocumentPath(rule, value, callback) {
    let { field, props } = rule;
    let { standard } = props;
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }

    let datas = props[standard + "Data"];
    if (datas.length > 0 && props[standard + "Data"].some(x => x.FileLocation === value)) {
        rule.message = "File already exists";
        callback('');
        return;
    }


    if (value != "--Select--" && value != null) {
        callback();
        return;
    }
    callback('');
}


export function checkSelect(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }

    if (value != "--Select--" && value != null) {
        callback();
        return;
    }
    callback('');
}


export function checkEmailAddress(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function checkNumber(rule, value, callback) {

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

export function pagesValidation(rule, value, callback) {

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    if (regx.test(value)) {
        callback();
        return;
    }
    else {
        rule.props.props.form.setFieldsValue({ Pages: value.replace(/\D/g, " ").replace(/ \s+ /g, " ").trim() });
        callback();

        return;
    }
    callback('');

}
export function checkVersionNumber(rule, value, callback) {

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    if (regx.test(value)) {
        //document.getElementById(rule.field).value
        callback();
        return;
    }
    callback('');
}

export function checkExistOrNot(rule, value, callback) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    let url = null;
    let data = null;
    if ((value.length >= rule.minVal && value.length <= rule.maxVal) || (rule.current !== undefined && rule.current.state.action !== undefined && rule.current.state.action === "signin")) {//to check signin page userName
        switch (rule.field) {
            case "UserName":
                url = (rule.current !== undefined && rule.current.state.action !== undefined && rule.current.state.action === "signin") ? 'Login/CheckUserNameAvailability' : 'Users/CheckUserNameAvailability';
                data = { UserName: value };
                break;
            case "EmailAddress":
                url = 'Users/CheckEmailAddressAvailability';
                data = { EmailAddress: value, UserID: rule.props.property.state.userID };

                break;
            case "ProjectName":
                url = 'Project/ProjectNameExistCheck';
                data = { ProjectName: value };
                break;
            case "StudyName":
                url = 'Study/StudyNameExistCheck';
                data = {
                    StudyName: value, ProjectID: rule.props.studyData.project.projectID
                };
                break;
            case "ColumnName":
                url = 'ListPageConfiguration/ColumnNameExistCheck';
                data = {
                    ColumnName: value, FormID: rule.props.props.formID
                };
                break;
            case "RoleName":
                url = 'Roles/RoleNameExistCheck';
                data = { RoleName: value };
                break;
            case "Name":
                if (rule.PageName == "PyTemplate") {
                    url = 'PyTemplate/PyTemplateNameExistCheck';
                    data = { Name: value };
                } else {
                    url = 'ProgramTemplate/ProgramTemplateNameExistCheck';
                    data = { Name: value };
                }
                break;
            case "ObjectName":
                url = 'UIElement/UIElementObjectNameExistCheck';
                data = { ObjectName: value };
                break;

            case "DataStdRoleName":
                url = 'CDISCDataStdRole/DataStdRoleNameExistCheck';
                data = {
                    DataStdRoleName: value, CDISCDataStdVersionID: rule.props.props.stdVersionIDForCreateAndUpdate
                };
                break;
            case "DomainClassName":
                url = 'CDISCDataStdDomainClass/DomainClassNameExistCheck';
                data = {
                    DomainClassName: value, CDISCDataStdVersionID: rule.props.versionID
                };
                break;
            case "TermName":

                url = 'AppConfiguration/TermNameExistCheck';
                data = { TermName: value };

                break;
            case "ValueLevelVariable":
                url = 'StandardValueLevelConfiguration/ValueLevelVariableExistCheck';
                data = { ValueLevelVariable: value };
                break;
            case "macroName":
                url = 'MacroTemplate/MacroNameExistCheck';
                data = { MacroName: value };
                break;
            case "RuleID":
                url = 'DataSetValidationRule/RuleIDExistCheck';
                data = {
                    RuleID: value, CDISCDataStdVersionID: rule.props.props.form.getFieldValue("CDISCDataStdVersionID")
                };
                break;

            case "CodeListVersion":
                url = 'NCICodeList/CheckNCICodeListVersionAvailability';
                data = { CodeListVersion: value };
                break;
            default:
                break;
        }


        //for update exist check
        if (rule.defaultValue != null) {
            if (rule.defaultValue.toLocaleLowerCase().trim() != value.toLocaleLowerCase().trim()) {
                checkExist(url, data, callback, rule.field, rule);
            }
            else {
                callback();
                return;
            }
        }
        //for create exist check
        else {

            checkExist(url, data, callback, rule.field, rule);

        }
    } else {
        callback();
        return;
    }


}

export function fnForDateValitation(rule, value, callback, id) {
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    //1900-2099
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

function checkExist(url, data, callback, id, rule) {
    CallServerPost(url, data).then(
        function (response) {
            if (rule.current !== undefined && rule.current.state.action !== undefined && rule.current.state.action === "signin") {
                if (response.value !== 0 && response.value !== -1) {
                    rule.current.changeShowForgot(true);//valid userName
                } else {
                    rule.current.changeShowForgot(false);
                }
                callback();
                return;
            } else {
                if (response.status === 0 || (response.value !== 0 && response.value !== -1)) {
                    callback(response.message);
                    return;
                }
                else {
                    callback();
                    return;
                }
            }


        }).catch(error => error);
}


//passing the regex it will return a validation
export function dynamicValidation(rule, value, callback)
 {
    //the folllowing callback set user name in user add page 
    if (rule.field === "EmailAddress") 
    {
        rule.callback();
    }
    if (checkNullorbalnk(value)) 
    {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        return;
    }

    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}

//passing the regex it will return a validation
export function conversionFactorValidation(rule, value, callback)
{

    if (checkNullorbalnk(value)) 
    {
        callback();
        return;
    }

    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        return;
    }
    
    if (regx.test(value)) 
    {
        if(parseFloat(value) >= rule.min && parseFloat(value) <= rule.max){
           callback();
            return;  
        }
            callback(rule.validationMsg);
            return;
    }
    callback('');
}
export function validationOnlyForFirstAndLastName(rule, value, callback) {
    //the folllowing callback set display name in user add page 
    rule.callback();
    if (checkNullorbalnk(value)) {
        callback();
        return;
    }


    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        rule.callback("error");

        return;
    }

    if (regx.test(value)) {
        callback();

        return;
    }
    callback('');
}
//studyRelDocTitleValidation

export function studyRelDocTitleValidation(rule, value, callback) {
    let { field, props } = rule;
    let { standard } = props;

    if (checkNullorbalnk(value)) {
        callback();
        return;
    }
    var str = rule.regExPattern;
    var lastSlash = str.lastIndexOf("/");
    var restoredRegex = new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
    const regx = restoredRegex;

    var notAllowSymboAtBeginAndEnd = /^[^\s]+(\s+[^\s]+)*$/;
    if (!notAllowSymboAtBeginAndEnd.test(value)) {
        rule.message = "Field cannot begins/ends with space";
        callback('');
        return;
    }

    let datas = props[standard + "Data"];
    if (datas.length > 0 && props[standard + "Data"].some(x => x.Title === value)) {
        rule.message = "Title already exists";
        callback('');
        return;
    }
    if (regx.test(value)) {
        callback();
        return;
    }
    callback('');
}
