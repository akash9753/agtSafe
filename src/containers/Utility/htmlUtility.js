import React from 'react';
import { Input, AutoComplete,Select, Radio, Form, Col, Row, Icon, Button, Checkbox, Switch, TreeSelect } from 'antd';
import {
    validationOnlyForFirstAndLastName,
    dynamicValidation,
    checkCheckBox,
    studyRelDocTitleValidation,
    checkSelectForStudyDocumentPath,
    CheckRadioGroup,
    fnForBrowse,
    fnForSelect,
    checkExistOrNot,
    checkSelect,
    checkPassword,
    fnSwitch,
    fnFileSelect,
    conversionFactorValidation
} from './validator';


import { Telephone } from '../User/TelephoneComponent';
import Upload from '../Topbar/Upload';
import { fnKeyUp } from '../DefineBot/supportValidation.js';

//Importing Custom Browse
import './browse.css';
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;



function lowerCasefirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function stringSorter(a, b, key) {
    if (a[key] && a[key] !== null && b[key] && b[key] !== null) {
        if (a[key].toLowerCase() < b[key].toLowerCase()) return -1;
        if (a[key].toLowerCase() > b[key].toLowerCase()) return 1;
        return 0;
    } else if (a[key] === null) {
        a[key] = "";
        b[key] = b[key] || "";
        console.log(a[key]);
        if (a[key].toLowerCase() < b[key].toLowerCase()) return -1;
        if (a[key].toLowerCase() > b[key].toLowerCase()) return 1;
        return 0;
    } else if (b[key] === null) {
        b[key] = "";
        a[key] = a[key] || "";
        console.log(b[key]);
        if (a[key].toLowerCase() < b[key].toLowerCase()) return -1;
        if (a[key].toLowerCase() > b[key].toLowerCase()) return 1;
        return 0;
    }
}
export function intSorter(a, b, key) {
    if (a[key] && a[key] !== null && b[key] && b[key] !== null) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    } else if (a[key] === null) {
        a[key] = "";
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    } else if (b[key] === null) {
        b[key] = "";
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    }
}

export function getFormItemsLeft(startTabIndex, endTabIndex, formData, selectOptions, getFieldDecorator) {
    var i = -1;

    var formItemsLeft = formData.map(function (option) {
        i = i + 1;
        if (i >= startTabIndex && i % 2 == 0 && i <= endTabIndex) {


            return (
                <FormItem
                    key={option.attributeName}
                    label={option.displayName}
                >
                    {
                        getFieldDecorator(option.attributeName, {
                            rules: getRules(option),
                            initialValue: option.defaultValue
                        })(
                            getField(option, selectOptions)

                        )}

                </FormItem>
            )
        }

    });
    return formItemsLeft;
}

export function getFormItemsRight(startTabIndex, endTabIndex, formData, selectOptions, getFieldDecorator) {
    var i = -1;

    var formItemsRight = formData.map(function (option) {
        i = i + 1;
        if (i >= startTabIndex && i % 2 != 0 && i <= endTabIndex) {


            return (
                <FormItem
                    key={option.attributeName}
                    label={option.displayName}
                >
                    {
                        getFieldDecorator(option.attributeName, {
                            rules: getRules(option),
                            initialValue: option.defaultValue
                        })(
                            getField(option, selectOptions)

                        )}

                </FormItem>
            )
        }

    });
    return formItemsRight;
}
export function getField(field, selectOptions) {
    switch (field.controlTypeText) {
        case "TextBox":
            if (field.editable == 1) {
                return (<Input size="small" tabIndex={0} placeholder={field.displayName} id={field.attributeName} />);
            }
            else {
                return (<Input size="small" tabIndex={0} placeholder={field.displayName} id={field.attributeName} disabled />);
            }
        case "DropDown":
            var deafultOption = (<Option name={field.displayName + "_Option"} disabled key="1" >--Select--</Option>);
            var allOptions = [deafultOption];
            var options = [];
            if (selectOptions != null && Object.keys(selectOptions).length > 0) {
                options = selectOptions[lowerCasefirst(field.attributeName)].map(function (option) {
                    return (
                        <Option name={field.displayName + "_Option"} key={option[lowerCasefirst(option["key"])]}>
                            {option[lowerCasefirst(option["literal"])]}
                        </Option>
                    )
                });
            }
            allOptions = allOptions.concat(options);
            return (<Select
                aria-name={field.displayName} filterOption="true" mode="single" tabIndex={0}>
                {allOptions}
            </Select>);
        case "CheckBox":
            return (<Checkbox
                tabIndex={0}
            >
                {field.displayName}
            </Checkbox>);

        default:
            return (<Input size="small" tabIndex={0} placeholder={field.displayName} id={field.attributeName} disabled />);

    }
}

function splCharacter(e) {
    const re = /[0-9A-Za-z!,@,#,$,%,^,&,*,(,)]+/g;
    if (!re.test(e.key)) {
        e.preventDefault();
    }
}

function getFormField(field, allData) {
    const uploadBtn = <a onClick={() => allData.showFileDialog(field.attributeName)}><Icon type="file-pdf" /></a>;
    switch (field.controlTypeText) {
        case "TextBox":

            if (field.inputTypeText == "Password") {
                return (

                    <Input type="text" style={{ "-webkit-text-security": "disc" }}
                        onPaste={(e) => {
                            e.preventDefault()
                            return false;
                        }}
                        onKeyPress={splCharacter}
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.preventDefault();
                            }
                        }}
                        size="small" maxlength="15" autoComplete="off" tabIndex={0} id={field.attributeName} onKeyUp={(e) => { reset(e, allData.props) }
                        } disabled={(field.editable == 0)
                        } />
                );
            }
            else if (field.inputTypeText == "Positive") {
                return (<Input size="small" onBlur={(e) => { fnFocusOut(e) }} tabIndex={0} id={field.attributeName} disabled={(field.editable == 0)} />);
            }
            else {
                return (<Input size="small" onKeyUp={(e) => { fnKeyUp(e, allData.props, field.displayName.replace(/ /g, "")) }} tabIndex={0} id={field.attributeName} disabled={(field.editable == 0)} />);
            }
        case "DropDown":
            var valuenull = null;
            var deafultOption = ((field.attributeName == "StatusID" || field.attributeName == "UserStatusID" || field.attributeName == "ProjectStatusID") ? "" : (<Option name={field.displayName + "_Option"} key={valuenull} value={valuenull}>--Select--</Option>))
            var allOptions = (deafultOption != "") ? [deafultOption] : [];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.toLowerCase()] != undefined) {
                    options = allData.selectOptions[field.attributeName.toLowerCase()].map(function (option) {
                        return (
                            <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                                {option["literal"]}
                            </Option>
                        )
                    });
                }
            }
            allOptions = allOptions.concat(options);
            return (<Select
                aria-name={field.displayName}
                disabled={(field.editable == 0)}
                filterOption="true" mode="single"
                tabIndex={0}
                onChange={
                    (value, node) => {
                        let { dependencyDropDownFn } = allData.props;
                        if (dependencyDropDownFn && typeof dependencyDropDownFn[field.attributeName] === "function") {
                            dependencyDropDownFn[field.attributeName](value)
                        }
                        fnForSelect(value, allData.props, field.attributeName, node)
                    }
                }>
                {allOptions}
            </Select>);
        case "DropDownWithSearch":
            var tempParam = null;
            var deafultOption = (<Option name={field.displayName + "_Option"} key={tempParam} value={tempParam}>--Select--</Option>);
            var allOptions = [deafultOption];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.toLowerCase()] != undefined) {
                    options = allData.selectOptions[field.attributeName.toLowerCase()].map(function (option) {
                        return (
                            <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                                {option["literal"]}
                            </Option>
                        )
                    });
                }
            }
            allOptions = allOptions.concat(options);
            return (<Select
                aria-name={field.displayName}
                placeholder={field.defaultValue}
                tabIndex={0}
                showSearch
                disabled={(field.editable == 0)}
                optionFilterProp="children"
                onChange={
                    (value, node) => {

                        fnForSelect(value, allData.props, field.attributeName, node);

                    }
                }
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} mode="single" tabIndex={0}>
                {allOptions}
            </Select>);
        case "MultipleDropdown":
            var deafultOption = (<input value={null} >--Select--</input>);
            var allOptions = field.attributeName == "ByVariables" ? [] : [deafultOption];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                options = allData.selectOptions[field.attributeName.toLowerCase()].map(function (option) {
                    return (
                        <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                            {option["literal"]}
                        </Option>
                    )
                });
            }

            allOptions = allOptions.concat(options);
            if (field.formText == "DataSetValidationRule" && (field.attributeName == "CDISCDataStdDomainMetadataID" || field.attributeName == "RuleApplicableLevel")) {
                return (<Select aria-name={field.displayName} tabIndex={0} disabled={(field.editable == 0)} placeholder="Select Key Variable" mode={(field.attributeName == "ByVariables" || field.attributeName == "CDISCDataStdDomainMetadataID" || field.attributeName == "CDISCDataStdDomainClassID" || field.attributeName == "RuleApplicableLevel") ? "multiple" : "tags"} tabIndex={0} onChange={(value, node) => { fnForSelect(value, allData.props, field.attributeName, node) }} >
                    {allOptions}
                </Select>);
            } else {
                return (<Select aria-name={field.displayName} tabIndex={0} disabled={(field.editable == 0)} placeholder="Select Key Variable" mode={(field.attributeName == "ByVariables" || field.attributeName == "CDISCDataStdDomainMetadataID" || field.attributeName == "CDISCDataStdDomainClassID") ? "multiple" : "tags"} tabIndex={0} >
                    {allOptions}
                </Select>);
            }
        case "MultipleDrop":
            var deafultOption = (<input value={null} >--Select--</input>);
            var allOptions = [deafultOption];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                options = allData.selectOptions[field.attributeName.toLowerCase()].map(function (option) {
                    return (
                        <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                            {option["literal"]}
                        </Option>
                    )
                });
            }
            allOptions = allOptions.concat(options);
            return (<Select aria-name={field.displayName} tabIndex={0} disabled={(field.editable == 0)} placeholder="Select Key Variable" mode="multiple" tabIndex={0} >
                {allOptions}
            </Select>);
        case "CheckBox":
            return (<Checkbox tabIndex={0} key={field.attributeName} disabled={(field.editable == 0)}
            >
            </Checkbox>);
        case "RadioGroup":
            let plainOptions = [{ label: 'Number', value: 'Number' },
            { label: 'Character', value: 'Character' }];
            return (<Radio.Group options={plainOptions} tabIndex={0} key={field.attributeName} disabled={(field.editable == 0)}
            >
            </Radio.Group>);
        case "Switch":
            return (<Switch key={field.attributeName} disabled={(field.editable == 0)} onChange={(e) => { fnSwitch(e, allData.props, field.attributeName) }}
                tabIndex={0}
            >
            </Switch>);
        case "FileSelect":
            let tempProp = allData.props.property;

            if (tempProp.constructor.name == "CreateStudyModal" && field.attributeName.indexOf("Document") != -1) {
                return (<TreeSelect
                    tabIndex={0}
                    showSearch
                    autoBlur={true}
                    disabled={(field.editable == 0)}
                    multiple={(field.inputTypeText == "MultiBrowse")}
                    allowClear
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    placeholder="Please Select"
                    treeDefaultExpandedKeys={[allData.treeDefaultExpandedKeys]}
                    dropdownClassName={field.attributeName}
                    onChange={(value, node, extra) => { fnFileSelect(value, node, extra, allData.props, field.attributeName) }}>
                    {dependencyDDLValidation(tempProp, field.attributeName)}
                </TreeSelect>)
            }
            else {
                return (
                    <TreeSelect
                        tabIndex={0}
                        showSearch
                        autoBlur={true}
                        disabled={(field.editable == 0)}
                        multiple={(field.inputTypeText == "MultiBrowse")}
                        allowClear
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                        placeholder="Please Select"
                        treeDefaultExpandedKeys={[allData.treeDefaultExpandedKeys]}
                        dropdownClassName={field.attributeName}
                        onChange={(value, node, extra) => { fnFileSelect(value, node, extra, allData.props, field.attributeName) }}>
                        {(Object.keys(allData.treeData).length == 2) ? allData.treeData[(field.attributeName.indexOf("Document") != -1) ? "Document" : "Location"] : allData.treeData}
                    </TreeSelect>
                );
            }
        case "FolderSelect":
            return (<TreeSelect
                showSearch
                tabIndex={0}
                disabled={(field.editable == 0)}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                placeholder="Please Select">
                {(Object.keys(allData.treeData).length == 2) ? allData.folderTreeData[(field.attributeName.indexOf("Document") != -1) ? "Document" : "Location"] : allData.folderTreeData}
            </TreeSelect>);
        case "SpecialTextBox":
            return (<Input tabIndex={0} style={{ width: "calc(100% - 42px)", height: "50px" }} placeholder={field.displayName} id={field.attributeName} disabled={(field.editable == 0)} />);
        case "SpecialSettings":
            return (<Input tabIndex={0} style={{ width: "calc(100% - 132px)", height: "50px" }} placeholder={field.displayName} id={field.attributeName} disabled={(field.attributeName != "CommentDescription") ? (field.editable == 0) : false} />);

        case "TextArea":
            return (<TextArea tabIndex={0} rows={2} size="small" style={{ resize: "none" }} tabIndex={0} disabled={(field.editable == 0)} />);

        case "CustomBox":
            if (field.attributeName == 'VariableshavingValueLevels') {

                return (
                    <div id='VariableshavingValueLevels'>
                        {
                            allData.tableElement
                        }
                    </div>
                );

            }
            break;

        case "SpecialCheckBox":
            return <Checkbox tabIndex={0} key={field.attributeName} disabled={(field.editable == 0)} />;
        case "FileBrowse":
            return (<Input tabIndex={0} type="file" className="ant-input custom-file-input" style={{ padding: "0px" }} accept=".xml" onChange={(e) => { fnForBrowse(e, allData.props, field.attributeName) }} />)

        case "File":
            return (<Input tabIndex={0} type="file" className="ant-input custom-file-input" style={{ padding: "0px" }} accept=".xml" onChange={(e) => { fnForBrowse(e, allData.props, field.attributeName) }} />)
        case "AutoComplete": {
            let dataSource = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.toLowerCase()] != undefined) {
                    allData.selectOptions[field.attributeName.toLowerCase()].map(function (option) {
                        dataSource.push({ text: option["literal"], value: option["keyValue"] })
                    });
                }
            }
            console.log(dataSource)
            return (<AutoComplete
                filterOption={(inputValue, option) =>
                {
                    try {
                        let { children } = option.props || {};
                        let text = typeof children == "string" ? children : "";
                        return text.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    catch (e) {
                        return;
                    }
                }}
                dataSource={dataSource}
            />)
        }
        default:
            return (<Input tabIndex={0} size="small" placeholder={field.displayName} id={field.attributeName} disabled />);

    }
}

function dependencyDDLValidation(prop, attrName) {
    let whichTwo = [];
    if (attrName == "ProtocolDocument") {
        whichTwo.push(prop.props.form.getFieldsValue(["CRFDocument"]).CRFDocument);
        whichTwo = whichTwo.concat(prop.props.form.getFieldsValue(["StudyRelatedDocument"]).StudyRelatedDocument)
    } else if (attrName == "CRFDocument") {
        whichTwo.push(prop.props.form.getFieldsValue(["ProtocolDocument"]).ProtocolDocument);
        whichTwo = whichTwo.concat(prop.props.form.getFieldsValue(["StudyRelatedDocument"]).StudyRelatedDocument)
    } else {
        whichTwo.push(prop.props.form.getFieldsValue(["ProtocolDocument"]).ProtocolDocument);
        whichTwo.push(prop.props.form.getFieldsValue(["CRFDocument"]).CRFDocument);
    }
    const datas = prop.state.responseData.folderTree.Document;
    const loops = data =>
        data.map(item => {
            let temp = true;
            whichTwo.forEach(function (vallidKey, validIndex) {

                if (vallidKey == item.key) {
                    temp = false;
                }
            })
            if (item.children && temp) {
                return (
                    <TreeNode selectable={false} key={item.key} value={item.key} title={item.title}>
                        {loops(item.children)}
                    </TreeNode>
                );
            }
            else if (temp) {
                return <TreeNode key={item.key} value={item.key} title={item.title} />;
            }
        });
    return (loops([datas]));

}

export function getRules(field, props, pageName) {

    var allRules = [{ required: (field.inputRequirementText == 'Mandatory') ? true : false, message: field.requirementErrorMessage }];
    var inputValidator = null;
    var existValidator = null;

    const noNeedValidation = ["DocumentPath", "DropDown", "CheckBox", "FileSelect", "FolderSelect", "MultipleDropdown", "MultipleDrop", "Switch", "DropDownWithSearch", "RadioGroup"];

    if (noNeedValidation.indexOf(field.controlTypeText) < 0) {
        //if (field.attributeName !== "EmailAddress") {
        allRules.push({ min: field.minValue, message: field.validationErrorMessage });
        allRules.push({ max: field.maxValue, message: field.validationErrorMessage });
        //}
        if (field.regExText !== null) {
            switch (field.inputTypeText) {
                case "Alpha":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                    break;
                case "Alphanumeric":
                    if (field.attributeName === "FirstName" || field.attributeName === "LastName") {
                        inputValidator = { validator: validationOnlyForFirstAndLastName, message: field.inputTypeErrorMessage, regExPattern: field.regExText, callback: props.setDisplayName };

                    } else {
                        inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                    }
                    break;
                case "MobileNumber":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                    break;
                case "PhoneNumber":
                    if (field.attributeName !== "Telephone") {
                        inputValidator = {
                            validator: dynamicValidation,
                            message: field.inputTypeErrorMessage,
                            regExPattern: field.regExText,
                        };
                    }
                    break;
                case "Number":
                    if (field.attributeName === "ConversionFactor") {
                        inputValidator = {
                            validator: conversionFactorValidation,
                            min: field.minValue,
                            max: field.maxValue,
                            validationMsg: field.validationErrorMessage,
                            message: field.inputTypeErrorMessage,
                            regExPattern: field.regExText
                        };
                    }
                    else {
                        inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                    }
                    break;
                case "EmailAddress":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText, callback: props.setUserName };
                    break;
                case "Password":
                    inputValidator = { validator: checkPassword, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "AlphanumericDotSpecial":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                    break;

                case "Positive":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "Date":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "AlphaNumericUnderscore":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "AlphanumericSpecial":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "ALLInputsAccepted":
                    inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;
                case "StudyRelDocTitle":
                    inputValidator = { validator: studyRelDocTitleValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                    break;

                default:
                    inputValidator = null;
                    break;
            }
        }
    }
    else if (field.controlTypeText == "DocumentPath") {

        if (field.inputRequirementText == 'Mandatory') {
            inputValidator = { validator: checkSelectForStudyDocumentPath, message: field.requirementErrorMessage, props: props };
        }
    }
    else if (field.controlTypeText == "DropDown" || field.controlTypeText == "DropDownWithSearch") {

        if (field.inputRequirementText == 'Mandatory') {
            inputValidator = { validator: checkSelect, message: field.requirementErrorMessage, props: props };
        }
    }
    else if (field.controlTypeText == "CheckBox") {
        if (field.inputRequirementText == 'Mandatory') {
            inputValidator = { validator: checkCheckBox, message: field.requirementErrorMessage };
        }
    }
    else if (field.controlTypeText == "RadioGroup") {
        if (field.inputRequirementText == 'Mandatory') {
            inputValidator = { validator: CheckRadioGroup, message: field.requirementErrorMessage };
        }
    }
    if (["ProjectName", "UserName", "EmailAddress", "StudyName",
        "ColumnName", "RoleName", "Name", "ObjectName", "DataStdRoleName",
        "TermName", "ValueLevelVariable", "MacroName", "RuleID", "CodeListVersion"].indexOf(field.attributeName) != -1 && field.formID !== 98 && field.formID !== 96) {
        //let fieldValue = props.property !== undefined ? props.property.props.form.getFieldValue(field.attributeName) : props.props !== undefined ? props.props.form.getFieldValue(field.attributeName) : props.form.getFieldValue(field.attributeName);
        //fieldValue = (fieldValue !== undefined && fieldValue !== null)  ? fieldValue : "";
        //let fieldValueLength = fieldValue.length;
        //if (fieldValueLength >= field.minValue && fieldValueLength <= field.maxValue) {
        let PageName = pageName != undefined ? pageName : (props.property != undefined) ? props.property.constructor.name : "";
        existValidator = { validator: checkExistOrNot, minVal: field.minValue, maxVal: field.maxValue, defaultValue: field.defaultValue, props: props, PageName: PageName };

        // }
    }
    if (inputValidator != null) {
        allRules.push(inputValidator);
    }
    if (existValidator != null) {
        allRules.push(existValidator);
    }
    return allRules;

}

function fnFocusOut(e) {
    document.getElementById(e.target.id).value = (e.target.value.split(" ").sort(function (a, b) { return a - b })).toString().replace(/,/g, " ");
}
function reset(field, e) {
    if (field.currentTarget.id !== "ConfirmPassword") {
        e.props.form.resetFields(["ConfirmPassword"]);
    }

}
var rightRule = (index) => {
    return (index % 2 != 0);
}
var leftRule = (index) => {
    return (index % 2 == 0);
}
export function formHTML(allData) {
    return genFormItems(allData, leftRule);
}



function genFormItems(allData, condition) {
    var formHTML = { right: [], left: [] }

    if (allData.props !== undefined && allData.props.responseData !== undefined && allData.props.responseData.formData !== undefined &&
        (allData.props.responseData.formData[0].formID === 100 || allData.props.responseData.formData[0].formID === 101)) {
        formHTML = { right: [], center: [], left: [] }
    }
    var k = -1;
    allData.formData.map(function (field) {
        var position = "left";
        if (field.tabIndex % 2 == 0) {
            position = "right";
        }

        if (allData.props !== undefined && allData.props.responseData !== undefined && allData.props.responseData.formData !== undefined &&
            (allData.props.responseData.formData[0].formID === 100 || allData.props.responseData.formData[0].formID === 101)) {
            let pos = ["left", "center", "right"];

            if (k == 2) {
                k = 0;
            } else {
                k++;
            }
            position = pos[k];
        }


        let defaultValue = null;
        if (field.controlTypeText == "CheckBox" || field.controlTypeText == "RadioGroup" || field.controlTypeText == "SpecialCheckBox" || field.controlTypeText == "Switch") {
            defaultValue = false;
            if (field.defaultValue == "True" || field.defaultValue == "true" || field.defaultValue == true) {
                defaultValue = true;
            }
        } else {
            if (field.defaultValue != null && field.defaultValue.trim() != '') {
                defaultValue = field.defaultValue;
            }
        }

        formHTML[position].push(
            (field.controlTypeText == "FileBrowse") ?
                (
                    <FormItem
                        key={field.attributeName}
                    >
                        <Upload field={field} props={allData} disabled={field.editable} format={allData.props.state.format} pageName={allData.props.state.pageName} id={field.attributeName} defaultValue={defaultValue} />
                    </FormItem>
                ) :
                (field.attributeName == "Telephone") ?
                    (
                        <FormItem
                            key={field.attributeName}
                        >

                            <Telephone
                                getFieldDecorator={allData.getFieldDecorator}
                                allData={allData}
                                field={field}
                                SelCountry={fnTogetSelCountry(allData)}
                            />
                        </FormItem>
                    )
                    :
                    <FormItem
                        key={field.attributeName}
                        label={field.displayName}
                    >
                        {

                            (field.inputTypeText == "Password") ?
                                (
                                    <form>
                                        {
                                            (allData.getFieldDecorator(field.attributeName, {
                                                rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                                //validateTrigger: ['onKeyup', 'onBlur'],
                                                initialValue: defaultValue,

                                                valuePropName: field.controlTypeText == "CheckBox" ? 'checked' : 'value',
                                            })(getFormField(field, allData)))
                                        }
                                    </form>

                                )
                                :
                                (field.controlTypeText == "DropDownWithSearch") ?
                                    (
                                        (allData.getFieldDecorator(field.attributeName, {
                                            rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                            //validateTrigger: ['onKeyup', 'onBlur'],
                                            initialValue: defaultValue,

                                            valuePropName: field.controlTypeText == "CheckBox" ? 'checked' : 'value',
                                        })(getFormField(field, allData))))
                                    :
                                    (field.controlTypeText == "MultipleDropdown" || field.controlTypeText == "FileSelect" || field.controlTypeText == "MultipleDrop") ?
                                        (

                                            allData.getFieldDecorator((field.controlTypeText == "MultipleDrop" || field.controlTypeText == "MultipleDropdown") ? field.attributeName : field.displayName.replace(/ /g, ""), {
                                                rules: (field.editable == true ? getRules(field, allData.props) : ""),

                                                initialValue: (defaultValue != null) ? defaultValue.split(",") : []
                                            })(getFormField(field, allData)))
                                        : (allData.getFieldDecorator(field.attributeName, {
                                            rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                            initialValue: defaultValue,

                                            //validateTrigger: ['onKeyup', 'onBlur'],
                                            valuePropName: (field.controlTypeText == "CheckBox" || field.controlTypeText == "Switch" || field.controlTypeText == "RadioGroup") ? 'checked' : 'value',
                                        })(getFormField(field, allData)))
                        }

                    </FormItem >
        );



        function fnSpecialText(field, defaultValue) {
            return (
                <div>
                    <span>
                        {
                            allData.getFieldDecorator(field.attributeName, {
                                rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                initialValue: defaultValue,
                                //validateTrigger: ['onKeyup', 'onBlur'],
                                valuePropName: field.controlTypeText == "CheckBox" ? 'checked' : 'value'
                            })(
                                getFormField(field, allData)

                            )
                        }
                    </span>
                    <span>
                        <Button type="primary" icon="setting" id={field.attributeName + "Confirm"} style={{ marginLeft: "10px" }} disabled={(field.defaultValue == null || field.defaultValue == '' || field.defaultValue == "")}  ></Button>
                    </span>
                </div>

            )
        }

        function fnSpecialSettings(field, defaultValue) {
            return (
                <div>
                    <span>
                        <span>
                            {
                                (field.defaultValue == null || field.defaultValue == '' || field.defaultValue == "") ?
                                    <Checkbox id={field.attributeName + "CheckBox"} checked={false} disabled={true}>
                                    </Checkbox> :
                                    <Checkbox id={field.attributeName + "CheckBox"}>
                                    </Checkbox>
                            }<span>Common</span></span>
                        <span>
                            {
                                allData.getFieldDecorator(field.attributeName, {
                                    rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                    initialValue: defaultValue,
                                    //validateTrigger: ['onKeyup', 'onBlur'],
                                })(getFormField(field, allData))
                            }
                        </span>
                        <span>
                            <Button type="primary" icon="setting" id={field.attributeName + "Confirm"} style={{ marginLeft: "10px" }} disabled={(field.defaultValue == null || field.defaultValue == '' || field.defaultValue == "")}  ></Button>
                        </span>
                    </span>
                </div>
            )
        }


        function fnSpecialCheck(field, defaultValue) {
            var width = "calc(100% - 83px)";
            var disabled;
            var value;

            if (field.attributeName == "ValueListID") {
                var width = "calc(100% - 125px)";
                if (field.defaultValue == false || field.defaultValue == null || field.defaultValue == '' || field.defaultValue == "") {
                    disabled = true;
                }
                else {
                    disabled = false;

                }
            }


            return (
                <div>
                    <span>
                        <span>
                            {
                                allData.getFieldDecorator(field.attributeName, {
                                    initialValue: defaultValue,
                                })(
                                    getFormField(field, allData)
                                )
                            }<span>External</span></span>

                    </span>
                    <span>
                        {
                            (field.attributeName == "ValueListID") ?
                                (<Input size="small" style={{ width: width }} placeholder={field.displayName} id={field.attributeName + "Text"} disabled={disabled} />)
                                :
                                (<Input size="small" style={{ width: width }} placeholder={field.displayName} id={field.attributeName + "Text"} />)
                        }
                    </span>
                    {
                        (field.attributeName == "ValueListID") ?
                            <span>
                                <Button type="primary" icon="setting" id={field.attributeName + "Confirm"} style={{ marginLeft: "10px" }} disabled={(field.defaultValue == false || field.defaultValue == null || field.defaultValue == '' || field.defaultValue == "")} ></Button>
                            </span> : ""
                    }
                </div>
            )
        }

    });
    return formHTML;

}

function fnTogetSelCountry(alldata) {
    let { country, form } = alldata.props;
    let countryID = form.getFieldValue("CountryID");

    let selCountry = country.find(c => c.countryID == countryID);
    if (selCountry && typeof selCountry === "object") {
        return selCountry.countryAbbreviation;
    } else {
        return "IN";
    }

}