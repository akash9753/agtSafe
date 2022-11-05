import React from 'react';
import { Select, Form, Input, Col, Row, Icon, Button, Checkbox, Switch, TreeSelect } from 'antd';
import { dynamicValidation, checkPhoneNumber, checkAlphaNumericSpecial, checkNumber, pagesValidation, checkAlphaNumeric, checkEmailAddress, fnDefineBotExternal, checkVersionNumber, checkExistOrNot, checkAlphabet, checkSelect, checkPassword, fnSwitch, fnFileSelect } from './validator';
import { fnForSelect, fnKeyUp, fnCheck, dependencyValidation } from '../DefineBot/supportValidation.js';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip.js'

const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

function lowerCasefirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function getFormField(field, allData) {
    const uploadBtn = <a onClick={() => allData.showFileDialog(field.attributeName.replace(/ /g, ""))}><Icon type="file-pdf" /></a>;
    switch (field.controlTypeText) {
        case "TextBox":
            if (field.inputTypeText == "Password") {
                return (<Input tabIndex={0} size="small" type="password" tabIndex={0} id={field.attributeName.replace(/ /g, "")} disabled={(field.editable == 0 || allData.disabled)} />);
            }
            else if (field.inputTypeText == "Positive") {
                return (<Input tabIndex={0} size="small" onBlur={(e) => { fnFocusOut(e, allData.props) }} tabIndex={0} id={field.attributeName.replace(/ /g, "")} disabled={(field.editable == 0 || allData.disabled)} />);
            }
            else {
                return (<Input title={field.defaultValue} tabIndex={0} size="small" onKeyUp={(e) => { fnKeyUp(e, allData.props, field.displayName.replace(/ /g, "")) }} tabIndex={0} id={field.attributeName.replace(/ /g, "")} disabled={(field.editable == 0 || allData.disabled)} />);

            }
            break;
        case "DropDown":
            var tempParam = null;
            var deafultOption = (<Option name={field.displayName + "_Option"} value={tempParam} key={tempParam}>--Select--</Option>);
            var allOptions = [deafultOption];
            var options = [];
            let dropDownMode = "single";
            var value = allData.props.props.form.getFieldValue(field.displayName.replace(/ /g, ""));
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()] != undefined) {
                    options = allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()].map(function (option) {
                        if (field.attributeName.replace(/ /g, "").toLowerCase() == "comparator" || field.attributeName.replace(/ /g, "").toLowerCase() == "operator") {
                            return (
                                <Option name={field.displayName + "_Option"} key={option["keyValue"]} value={option["literal"]}>
                                    {option["literal"]}
                                </Option>
                            )
                        } else {
                            return (
                                <Option name={field.displayName + "_Option"} key={option["keyValue"]} >
                                    {option["literal"]}
                                </Option>
                            )
                        }
                    });
                }
            }
            if (field.attributeName.replace(/ /g, "").toLowerCase() == "value") {
                allOptions = options;
            }
            else {
                allOptions = allOptions.concat(options);
            }
            return (<Select aria-name={field.displayName} tabIndex={0} disabled={(field.editable == 0 || allData.disabled)} filterOption="true" mode={dropDownMode} onChange={(value, node) => { fnForSelect(value, allData, field.attributeName, node) }} >
                {allOptions}
            </Select>);
            break;
        case "DropDownWithSearch":
            var tempParam = null;
            var deafultOption = (<Option name={field.displayName + "_Option"} value={tempParam} key={tempParam}>--Select--</Option>);
            var allOptions = [deafultOption];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()] != undefined) {
                    options = allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()].map(function (option) {
                        if (field.attributeName.replace(/ /g, "").toLowerCase() == "comparator" || field.attributeName.replace(/ /g, "").toLowerCase() == "operator") {
                            return (
                                <Option name={field.displayName + "_Option"} key={option["keyValue"]} value={option["literal"]}>
                                    {option["literal"]}
                                </Option>
                            )
                        } else {
                            return (
                                <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                                    {option["literal"]}
                                </Option>
                            )
                        }
                    });
                }
            }
            if (field.attributeName.replace(/ /g, "").toLowerCase() == "value") {
                allOptions = options;
            }
            else {
                allOptions = allOptions.concat(options);
            }
            return (<Select aria-name={field.displayName} tabIndex={0} showSearch disabled={(field.editable == 0 || allData.disabled)} optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} mode="single" onChange={(value, node) => { fnForSelect(value, allData, field.attributeName, node) }}>
                {allOptions}
            </Select>);
            break;
        case "MultipleDropdown":
            var allOptions = [];
            var options = [];
            if (allData.selectOptions != null && Object.keys(allData.selectOptions).length > 0) {
                if (allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()] != undefined) {
                    options = allData.selectOptions[field.attributeName.replace(/ /g, "").toLowerCase()].map(function (option) {
                        return (
                            <Option name={field.displayName + "_Option"} key={option["keyValue"]}>
                                {
                                    (field.attributeName.replace(/ /g, "").toLowerCase() == "referencewhereclause") ?
                                        option["literal"].substr(option["literal"].indexOf("WC.") + 3) :
                                        (field.attributeName.replace(/ /g, "").toLowerCase() != "referencevaluelist" && field.attributeName.replace(/ /g, "").toLowerCase() != "referencevariable" && field.attributeName.replace(/ /g, "").toLowerCase() != "referencedomain") ?
                                            option["literal"] :
                                            option["literal"].substr(option["literal"].indexOf(".") + 1)
                                }
                            </Option>
                        )
                    });
                }
            }
            allOptions = allOptions.concat(options);
            return (<Select tabIndex={0} aria-name={field.displayName} showSearch disabled={(field.editable == 0 || allData.disabled)} optionFilterProp="children" placeholder={"Select " + field.displayName} mode="multiple" tabIndex={field.tabIndex} >
                {allOptions}
            </Select>);
            break;
        case "CheckBox":
        case "SpecialCheckBox":

            return (<Checkbox key={field.attributeName.replace(/ /g, "")} disabled={(field.editable == 0 || allData.disabled)} onChange={(e) => { fnCheck(e, allData.props, field.attributeName.replace(/ /g, "")) }}
                tabIndex={0}
            >
            </Checkbox>);
            break;
        case "Switch":
            return (<Switch key={field.attributeName.replace(/ /g, "")} disabled={(field.editable == 0 || allData.disabled)} onChange={(e) => { fnSwitch(e, allData.props, field.attributeName.replace(/ /g, "")) }}
                tabIndex={0}
            >
            </Switch>);
            break;
        case "FileSelect":
            return (
                <TreeSelect
                    tabIndex={0}
                    showSearch
                    disabled={(field.editable == 0 || allData.disabled)}
                    multiple={(field.inputTypeText == "MultiBrowse")}
                    allowClear
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    placeholder="Please Select"
                    treeDefaultExpandedKeys={[allData.treeDefaultExpandedKeys]}
                    onChange={(value, node, extra) => { fnFileSelect(value, node, extra, allData.props, field.attributeName.replace(/ /g, "")) }}>
                    {allData.treeData}
                </TreeSelect>
            );
            break;
        case "FolderSelect":
            return (<TreeSelect
                tabIndex={0}
                showSearch
                disabled={(field.editable == 0 || allData.disabled)}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                placeholder="Please Select">
                {allData.folderTreeData}
            </TreeSelect>);
            break;
        case "SpecialTextBox":
            return (<Input tabIndex={0} size="small" style={{ borderRadius: "4px", border: "1px solid #e9e9e9", width: "calc(100% - 42px)", height: "50px" }} tabIndex={0} disabled={(field.editable == 0 || allData.disabled)} />);
            break;

        case "SpecialSettings":

            if (field.attributeName.replace(/ /g, "") == 'CodeListName') {
                return (<Input tabIndex={0} size="small" style={{ marginLeft:10,borderRadius: "4px", border: "1px solid #e9e9e9", width: "calc(100% - 87px)" }} tabIndex={0} disabled={(field.editable == 0 || allData.disabled)} />);

            }
            else {
                return (<Input tabIndex={0} size="small" style={{ borderRadius: "4px", border: "1px solid #e9e9e9", width: "calc(100% - 56px)" }} tabIndex={0} disabled={(field.editable == 0 || allData.disabled)} />);
            }
            break;

        case "TextArea":
            return (<Input tabIndex={0} size="small" tabIndex={0} disabled={(field.editable == 0 || allData.disabled)} />);
            break;

        case "CustomBox":
            if (field.attributeName.replace(/ /g, "") == 'VariableshavingValueLevels') {

                return (
                    <div id='VariableshavingValueLevels'>
                        {
                            allData.tableElement
                        }
                    </div>
                );

            }
            break;

        default:
            return (<Input tabIndex={0} size="small" tabIndex={0} id={field.attributeName.replace(/ /g, "")} disabled />);
            break;
    }
}
export function getRules(field, props) {

    var allRules = [{ required: (field.inputRequirementText == 'Mandatory') ? true : false, message: field.requirementErrorMessage }];
    var inputValidator = null;
    var existValidator = null;

    const noNeedValidation = ["DropDown", "CheckBox", "FileSelect", "FolderSelect", "MultipleDropdown", "Switch", "DropDownWithSearch"];
    if (noNeedValidation.indexOf(field.controlTypeText) < 0) {

        if (field.controlTypeText == "SpecialSettings" || field.controlTypeText == "SpecialTextBox") {
            allRules.push({ min: field.minValue, message: field.validationErrorMessage });
            allRules.push({ max: field.maxValue, message: field.validationErrorMessage });
            inputValidator = { regExPattern: field.regExText, validator: dependencyValidation, data: field, message: field.inputTypeErrorMessage, type: field.inputTypeText };
        }
        else {
            if (field.displayName.replace(/ /g, "") != "EmailAddress") {
                allRules.push({ min: field.minValue, message: field.validationErrorMessage });
                allRules.push({ max: field.maxValue, message: field.validationErrorMessage });
            }
            if (field.regExText != null) {
                switch (field.inputTypeText) {
                    //case "Alpha":
                    //    inputValidator = { validator: checkAlphabet, message: field.inputTypeErrorMessage };
                    //    break;
                    case "Alphanumeric":
                        inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                        break;
                    case "AlphanumericSpecial":
                        inputValidator = { validator: dynamicValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                        break;
                    //case "MobileNumber":
                    //    inputValidator = { validator: checkPhoneNumber, message: field.inputTypeErrorMessage };
                    //    break;
                    case "Number":
                        inputValidator = { validator: checkNumber, message: field.inputTypeErrorMessage, regExPattern: field.regExText };
                        break;
                    //case "EmailAddress":
                    //    inputValidator = { validator: checkEmailAddress, message: field.inputTypeErrorMessage };
                    //    break;
                    //case "Password":
                    //    inputValidator = { validator: checkPassword, message: field.inputTypeErrorMessage };
                    //    break;
                    //case "AlphanumericDotSpecial":
                    //    inputValidator = { validator: checkVersionNumber, message: field.inputTypeErrorMessage , props: props};
                    //    break;

                    case "Positive":
                        inputValidator = { validator: pagesValidation, message: field.inputTypeErrorMessage, props: props, regExPattern: field.regExText };
                        break;

                    default:
                        inputValidator = null;
                        break;
                }
            }
        }
    } else if (field.controlTypeText == "DropDown") {
        if (field.inputRequirementText == 'Mandatory') {
            inputValidator = { validator: checkSelect, message: field.requirementErrorMessage };
        }
    }

    if (inputValidator != null) {
        allRules.push(inputValidator);
    }
    if (existValidator != null) {
        allRules.push(existValidator);
    }
    return allRules;

}

function fnFocusOut(e, props) {
    var c = {}; var temp = []; var a = e.target.value.split(" ");
    props.props.form.validateFields([e.target.id], { force: true }, (err, values) => {
        if (!err) {
            a.forEach(function (key, index) {
                if (index == 0) {
                    if (key != 0) {
                        c[key] = "temp";
                        temp.push(key);
                    }
                }
                else if (!c.hasOwnProperty(key)) {
                    if (key != 0) {
                        c[key] = "temp";

                        temp.push(key);
                    }
                }
            })
            props.props.form.setFieldsValue({ Pages: ((temp.sort(function (a, b) { return a - b })).toString().replace(/,/g, " ")).trim() });
        }
    })
}

var rightRule = (index) => {
    return (index % 2 != 0);
}
var leftRule = (index) => {
    return (index % 2 == 0);
}
export function genLeftFormItems(allData) {
    return genFormItems(allData, leftRule);
}
export function genRightFormItems(allData) {
    return genFormItems(allData, rightRule);
}

function dependencyCheckbox(value, field, props) {
    field.extCom = value.target.checked;
    props.props.setState({});
}
function genFormItems(allData, condition) {
    var i = -1;

    var formItemsLeft = allData.formData.map(function (field) {
        i = i + 1;
        if (condition(field.tabIndex) && i <= allData.formData.length) {
            let defaultValue = null;
            if (field.controlTypeText == "CheckBox" || field.controlTypeText == "SpecialCheckBox") {
                defaultValue = false;
                if (field.defaultValue == true) {
                    defaultValue = true;
                }
            } else {
                if (field.defaultValue && (typeof field.defaultValue === "string" && field.defaultValue.trim() != '')) {
                    defaultValue = field.defaultValue;
                }
            }

            return (
                <FormItem
                    key={field.displayName.replace(/ /g, "")}
                    label={(field.attributeName == "ValueListID") ? "" : field.displayName}

                    className={field.controlTypeText + "_FormItem"}
                >
                    {
                        (field.controlTypeText == "SpecialTextBox") ?
                            (fnSpecialText(field, defaultValue)) :

                            ((field.controlTypeText == "SpecialSettings") ?

                                (fnSpecialSettings(field, defaultValue))

                                : (field.controlTypeText == "SpecialCheckBox") ?

                                    (fnSpecialCheck(field, defaultValue)) :

                                    (field.controlTypeText == "MultipleDropdown" || field.controlTypeText == "FileSelect") ?
                                        (

                                            allData.getFieldDecorator(field.displayName.replace(/ /g, ""), {
                                                rules: (field.editable == true ? [{
                                                    required: (field.inputRequirementText == "Mandatory") ? true : false,
                                                    message: field.requirementErrorMessage,
                                                }] : ""),
                                                initialValue: (defaultValue != null) ? defaultValue.split(",") : []
                                            })(getFormField(field, allData)))
                                        : allData.getFieldDecorator(field.displayName.replace(/ /g, ""), {
                                            rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                            initialValue: ((field.formActionText == "ComplexConfiguration" && (field.attributeName == "VariableName" &&
                                                (allData.props.state.flagToResetVarName == false)) ? (allData.props.props.defaultValForVar.replace(/[\[|\]""]/g, '')) :
                                                (field.formActionText == "ComplexConfiguration" && field.attributeName == "Domain") ? (allData.props.props.defaultValForDomain) : defaultValue)),
                                            //validateTrigger: ['onKeyup', 'onBlur'],
                                            valuePropName: field.controlTypeText == "CheckBox" ? 'checked' : 'value',
                                        })(getFormField(field, allData)))
                    }

                </FormItem>
            )
        }


        function fnSpecialText(field, defaultValue) {
            return (
                <div>
                    <span>
                        {
                            allData.getFieldDecorator(field.displayName.replace(/ /g, ""), {
                                rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                initialValue: defaultValue,
                                //validateTrigger: ['onKeyup', 'onBlur'],
                                valuePropName: field.controlTypeText == "CheckBox" ? 'checked' : 'value'
                            })(getFormField(field, allData))
                        }
                    </span>
                    <span>{
                        (field.displayName.replace(/ /g, "") != "DatasetComment") ?
                            <Button tabIndex={0} type="primary" icon="setting" id={field.displayName.replace(/ /g, "") + "Confirm"} style={{ marginLeft: "10px" }} disabled={((JSON.parse(sessionStorage.projectStudyLockStatus) && !stringNullCheck(field.defaultValue)) ? false : (allData.disabled || stringNullCheck(field.defaultValue)))}  ></Button> :
                            <ButtonWithToolTip tabIndex={0} tooltip="Add" shape="circle" classname="fas fa-plus" size="small" id={field.displayName.replace(/ /g, "") + "Confirm"} style={{ marginLeft: "10px" }} />
                    }
                    </span>
                </div>

            )
        }

        function fnSpecialSettings(field, defaultValue) {
            var temp = 0;
            var id = field.displayName.replace(/ /g, "") + "CheckBox";
            if (field.displayName == "CodeList Name") {
                if (!allData.disabled && field.defaultValue != "" && field.defaultValue !== null && field.defaultValue != undefined) {
                    temp = <Checkbox tabIndex={0} id={field.displayName.replace(/ /g, "") + "CheckBox"} checked={field.extCom} onChange={(value) => { dependencyCheckbox(value, field, allData) }} />;
                }
                else {

                    temp = <Checkbox tabIndex={0} id={field.displayName.replace(/ /g, "") + "CheckBox"} checked={field.extCom} disabled={true} />;
                }
            }
            return (
                <div>
                    <span>
                        {
                            (temp != 0) && (<span>
                                {
                                    temp
                                }
                                <span>{"External"}</span>
                            </span>)
                        }
                        <span>
                            {
                                allData.getFieldDecorator(field.displayName.replace(/ /g, ""), {
                                    rules: (field.editable == true ? getRules(field, allData.props) : ""),
                                    initialValue: defaultValue,
                                    valuePropName: 'value',

                                })(getFormField(field, allData))
                            }
                        </span>
                        {
                            (field.displayName.replace(/ /g, "") != "CodeListName") ?
                                <span>
                                    <Button tabIndex={0} type="primary" icon="setting" id={field.displayName.replace(/ /g, "") + "Confirm"} style={{ marginLeft: "23px" }} disabled={((JSON.parse(sessionStorage.projectStudyLockStatus) && !stringNullCheck(field.defaultValue)) ? false : (allData.disabled || stringNullCheck(field.defaultValue)))}  ></Button>
                                </span> : ""
                        }
                    </span>
                </div>
            )
        }

        //for value list only
        function fnSpecialCheck(field, defaultValue) {
            var disabled;
            var value = allData.props.props.form.getFieldValue(field.displayName.replace(/ /g, ""));

            if (value && !allData.disabled && allData.props.state.formData_variable.find(x => x.attributeName === "ValueListID").extCom) {
                disabled = false;
            }
            else {
                disabled = true;
            }
            let textDefaultValue = (field.defaultValue != null) ? field.defaultValue.replace("VL.", "") : field.defaultValue;


            return (
                <div><div className="ant-form-item-label"><label title="Last Page">{field.displayName}</label></div>
                    <span>
                        <span>
                            {
                                allData.getFieldDecorator(field.displayName.replace(/ /g, ""), {
                                    initialValue: field.extCom,
                                    valuePropName: 'checked',

                                })
                                    (
                                    getFormField(field, allData)
                                    )
                            }</span>

                    </span>
                    <span>
                        <Input tabIndex={0} size="small" value={(field.extCom) ? textDefaultValue : ""} style={{ width: "calc(100% - 83px)", marginLeft: "10px" }} id={field.displayName.replace(/ /g, "") + "Text"} disabled={true} />
                    </span>
                    <span>
                        <Button tabIndex={0} type="primary" icon="setting" id={field.displayName.replace(/ /g, "") + "Confirm"} style={{ marginLeft: "23px" }} disabled={disabled}  ></Button>
                    </span>
                </div>
            )
        }

    });
    return formItemsLeft;
}
//stringNullCheck
function stringNullCheck(value) {
    if (value != null) {
        return /^\s*$/.test(value)
    } else {
        return true;
    }
}