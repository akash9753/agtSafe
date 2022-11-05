import React, { Component } from 'react';
import { Input, Col, Button, Row, Select, Checkbox, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZoneForDomainCreate, PostCallWithZone, errorModal, successModal, successModalCallback, showProgress, hideProgress } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/defineBotForm';
import ReactTable from '../Utility/reactTable';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { SelectOption } from '../../components/uielements/select';
import ComplexWhereClause from './ComplexWhereClause';
import { deleteRowWhenEdit, externalComplexWhereClauseName } from './ComplexWhereClause';
const Option = SelectOption;

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var loopControl = true;
var description = "";
let checkedListBeforeOpenClause = "";
let complexWhereClauseFormData = [];
let valuesForComparator = [];
let valuesForOperator = [];
//let complexWhereClauseFormData = [];
//let complexWhereClauseFormData = [];
class ValueLevelConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            CheckBoxList: [],
            OriginalCheckBoxList: [],
            selectOptions: {
                topicvariable: [], topicvariablelabel: []
            },
            clauseShow: false,
            condnShow: false,
            formData: [],
            checkedList: "[]",
            clauseRow: [],
            copyOfClauseRow: [],
            savedclauseRows: "[{}]",
            savedCheckedList: "[]",
            readyShow: true,
            DeletedClauseRows: [],
            savedDeletedClauseRows: "[]",
            complexWhereClauseFormData: [],
            selectOptionsForComplexWhere: {
                domain: [], variablename: [], value: [], comparator: [], operator: []
            },
            selectOptionsForComplexWhereForVariable: [],
            selectOptionsForComplexWhereForValue: [],
            variableName: "",
            edit: false,
            whichRowToEdit: [],
            forSaveEditedObj: {},
            whereClauseModalTitle: "",
            defaultValForDmain: ""
        }

        thisObj = this;

    }


    //Get the required field to form the pop up
    static getDerivedStateFromProps (prop) {
        if (prop.visible && loopControl) {
            prop.form.resetFields();
            if (thisObj.state.formData.length == 0) {
                CallServerPost('Variable/GetValuelevelConfigurationFormData', { FormName: "ValuelevelConfiguration", ActionName: "Configure", DomainName: prop.data.Domain, VariableName: prop.data.Variable, StudyID: JSON.parse(sessionStorage.studyDetails).studyID }).then(
                    function (response) {
                        var result = response.value;
                        if (result.status == 0) {
                            thisObj.setState({
                                whereClause: { Show: false }, whereCondn: { Data: {}, Show: false }, visible: prop.visible
                            });
                            errorModal(result.message);
                        }
                        else {
                            thisObj.tableRow(prop, prop.variablelevelwherecondition, result, result.formData, "onLoad");
                            thisObj.setState(result);
                        }

                    }).catch(error => error);
            }
            else {
                var result = {};
                let resultData = [];
                var tempSavedclauseRows = JSON.parse(thisObj.state.savedclauseRows)[0];
                thisObj.tableRow(prop, tempSavedclauseRows, result, thisObj.state.formData, "onOpen");

                thisObj.setState(result);
            }

            loopControl = false;
        }
        else if (!prop.visible) {
            description = "";
            prop.form.resetFields();
            loopControl = true;           
        }
    }

    isNotUndefined = (list) => {
        if (list != null && list != undefined) {
            if (list.length == 0) {
                return false;
            }
            else {
                if (Object.keys(list).length != 0) {
                    return true;
                }
                return false;
            }

        } else {
            return false;

        }
    }

    //handle the datas to display when open and column[0] time load 
    tableRow = (prop, list, result, formData, fnFor) => {
        if (thisObj.isNotUndefined(list)) {
            let tempResult = thisObj.rowFormation(list);
            result.clauseRow = tempResult.clauseRow;
            let tempStore = [];
            tempStore.push(tempResult.concat);
            result.savedclauseRows = JSON.stringify(tempStore);
            result.copyOfClauseRow = tempResult.concat;
            if (fnFor == "onOpen") {
                result.copyOfClauseRow = list;
                result.checkedList = thisObj.state.savedCheckedList;
                result.DeletedClauseRows = JSON.parse(thisObj.state.savedDeletedClauseRows);
            }

            thisObj.CommonEach(formData,
                [{ name: "Domain", action: "defaultValue", set: prop.data.Domain },
                { name: "VariableName", action: "defaultValue", set: prop.data.Variable },

                ]);

            if (fnFor == "onLoad") {
                result.selectOptions = { topicvariable: result.TopicVariable, topicvariablelabel: result.TopicVariableLabel }

                if (thisObj.props.action == "Update") {
                    result.savedCheckedList = JSON.stringify(prop.variablelevelwherecondition[0].groupBy.split(","));
                    result.checkedList = result.savedCheckedList;
                    thisObj.CommonEach(formData,
                        [
                            { name: "ShortName", action: "defaultValue", set: prop.variablelevelwherecondition[0].topicVariable },
                            { name: "LongName", action: "defaultValue", set: prop.variablelevelwherecondition[0].topicVariableLabel },
                            { name: "ShortName", action: "editable", set: false },
                            { name: "LongName", action: "editable", set: false },
                        ]);
                }
            } 
        }
        else {
            if (fnFor == "onOpen") {
                thisObj.rowFormation([]);
                result.clauseRow = [];
                result.copyOfClauseRow = {};
                result.checkedList = "[]";
                result.DeletedClauseRows = [];
            }

            thisObj.CommonEach(formData,
                [{ name: "Domain", action: "defaultValue", set: prop.data.Domain },
                { name: "VariableName", action: "defaultValue", set: prop.data.Variable },
                { name: "ShortName", action: "editable", set: true },
                { name: "LongName", action: "editable", set: true }]);


        }
        if (fnFor == "onLoad") {
            result.OriginalCheckBoxList = result.CheckBoxList;
            result.CheckBoxList = thisObj.checkDataFormation(result.CheckBoxList, "");
            result.selectOptions = { topicvariable: result.TopicVariable, topicvariablelabel: result.TopicVariableLabel }
        }
        result.visible = prop.visible;
        prop.handleLoader();
    }

    checkDataFormation = (CheckBoxList, name, dataArr) => {
        let data = dataArr != undefined ? dataArr : [];
        let originalCheckBoxList = CheckBoxList;        
        if (typeof(name) == "string") {
            originalCheckBoxList.forEach(function (key) {
                if (key == thisObj.props.form.getFieldValue("ShortName")) {
                    if (data.findIndex(x => x.label == key) === -1) {
                        data.push({ label: key, value: key, disabled: true });
                    }
                }
                else {
                    if (data.findIndex(x => x.label == key) === -1) {
                        data.push({ label: key, value: key, disabled: false });
                    }
                }
            });
        } else {
            name.forEach(function (opt) {
                thisObj.checkDataFormation(originalCheckBoxList, opt, data);
            });
        }
        
        return data;
    }

    fnPageFieldValidation = (value) => {
        thisObj.props.form.setFieldsValue({ Pages: value });
    }

    Clause = () => {
        thisObj.props.form.validateFields(["ShortName", "LongName"], { force: true }, (err, values) => {
            if (!err) {
                const state = thisObj.state;
                checkedListBeforeOpenClause = thisObj.state.checkedList;
                var tempCheckedList = [];
               
                tempCheckedList = [thisObj.props.form.getFieldValue("ShortName")];
                
                if (JSON.parse(thisObj.state.checkedList).length !== 0 && JSON.parse(thisObj.state.checkedList)[0] !== "") {
                    tempCheckedList = JSON.parse(thisObj.state.checkedList);
                }

                thisObj.setState({
                    readyShow: false, checkedList: JSON.stringify(tempCheckedList),
                    clauseShow: true, condnShow: false, CheckBoxList: thisObj.checkDataFormation(state.OriginalCheckBoxList, tempCheckedList)
                });
            }
        })
    }

    CommonEach = (data, searchData) => {
        data.forEach(function (key, index) {
            searchData.forEach(function (key1, index) {
                if (key.displayName.replace(/ /g, "") == key1.name) {
                    key[key1.action] = key1.set;
                    return false;
                }
            })
        })
    }

    Cancel = () => {
        const state = thisObj.state;
        if (state.readyShow) {
            //thisObj.setState({
            //    clauseRow: []
            //});
            thisObj.props.handleCancel();
        }
        else if (state.clauseShow) {
            thisObj.setState({
                readyShow: true, condnShow: false, clauseShow: false, checkedList: checkedListBeforeOpenClause
            });
        }
        else {
            thisObj.setState({
                readyShow: true, condnShow: false, clauseShow: false, complexWhereClauseFormData: [],
                selectOptionsForComplexWhere: { domain: [], variablename: [], value: [], comparator: [], operator: [] },
                selectOptionsForComplexWhereForValue: [],
                selectOptionsForComplexWhereForVariable: []
            });
        }
    }

    onChange = (e) =>
    {
        thisObj.setState({ checkedList: JSON.stringify(e) });
    }
    shortNameChange = (value) => {
        var data = [value];
        thisObj.setState({ checkedList: JSON.stringify(data), CheckBoxList: thisObj.checkDataFormation(thisObj.state.OriginalCheckBoxList, value) });
    }

    save = () => {
        thisObj.props.form.validateFields((err, values) => {

            if (!err) {
                values.GroupBy = [];
                if (JSON.parse(thisObj.state.checkedList).length != 0) {
                    values.GroupBy = JSON.parse(thisObj.state.checkedList).toString();
                }
                values.whereClauseType = 1; //Simple
                values.StudyID = JSON.parse(sessionStorage.studyDetails).studyID;
                if (thisObj.state.readyShow) {
                    const formData = thisObj.state.formData;

                    var tempData = [];
                    Object.keys(thisObj.state.copyOfClauseRow).forEach(function (key, index) {
                        let currentObj = thisObj.state.copyOfClauseRow[key];

                        let temp = {
                            joinClause: currentObj.joinClause,
                            whereClauseCondition: currentObj.whereClauseCondition,
                            whereClauseName: currentObj.whereClauseName,
                            domain: values.Domain,
                            topicVariable: values.ShortName,
                            topicVariableLabel: values.LongName,
                            groupBy: (thisObj.state.whereClauseModalTitle == "Complex WhereClause" || thisObj.state.whereClauseModalTitle == "Advance WhereClause") ? "" : (values.GroupBy.length === 0) ? "" : values.GroupBy,
                            studyID: values.StudyID,
                            variableName: values.VariableName,
                            variableAttributeID: currentObj.variableAttributeID,
                            valueListAttributeID: currentObj.valueListAttributeID,
                            itemDefAttributeID: currentObj.itemDefAttributeID,
                            variableLevelWhereConditionID: currentObj.variableLevelWhereConditionID,
                            whereClauseType: currentObj.whereClauseType,//1 -- Simple , 2 --Complex, 3 --Advance(across Domain)
                            modificationStatus: currentObj.modificationStatus,
                            updatedBy: JSON.parse(sessionStorage.userProfile).userID,
                        };
                        tempData.push(temp)
                    })
                    thisObj.CommonEach(formData,
                        [{ name: "ShortName", action: "defaultValue", set: values.ShortName },
                        { name: "LongName", action: "defaultValue", set: values.LongName }]);

                    if (tempData.length === 0) {
                        errorModal("Please configure the where conditions to generate the valuelists");
                    } else {
                        thisObj.setState({ savedDeletedClauseRows: JSON.stringify(thisObj.state.DeletedClauseRows), savedCheckedList: thisObj.state.checkedList, savedclauseRows: JSON.stringify([thisObj.state.copyOfClauseRow]) });
                        thisObj.props.saveValueLevel(tempData);
                    }
                }
                else {
                    showProgress();

                    //thisObj.props.saveValueLevel({valueLevelConfig:values})
                    PostCallWithZoneForDomainCreate('Variable/GenerateDefaultWhereCondition', values).then(
                        function (response)
                        {
                            hideProgress();
                            //console.log(response);
                            const responseData = response;
                            if (responseData.status == 0) {
                                errorModal(responseData.message);
                            }
                            else {
                                let data = thisObj.rowForm(responseData.value.ConditionList, "Create")
                                //successModalCallback(responseData.message, thisObj.Cancel);


                            }
                        }).catch(error => error);
                }
            }
        });
    }

    //this method called when Add button pressed after selecting variable, comparator, value and operator to form complex where clause 
    addComplexWhereClause = () => {
        thisObj.props.form.validateFields((err, values) => {

            if (!err) {
            }
        }).catch(err => err);
    }

    fnToDeleteBothRow = (rowindex) => {
        var rows = thisObj.state.copyOfClauseRow;
        if (rows[rowindex].modificationStatus == 1) {

            delete rows[rowindex]

        }
        else {
            let tempDelete = thisObj.state.DeletedClauseRows;


            rows[rowindex].modificationStatus = 3;
            let deletedClauses = [];
            deletedClauses = tempDelete;
            deletedClauses.push(rows[rowindex]);
            thisObj.setState({ DeletedClauseRows: deletedClauses });
        }

        thisObj.rowForm(rows, "delete");

    }
    fnCheckcondn = (actionFor,updatedKey,wherename) => {
        if (actionFor == "ComplexMergeUpdate") {
            if (updatedKey != wherename)
            {
                return true;
            }else{
                return false;
            }
        } else {
            return true;
        }
    }

    concat = (updatedRows, newdata, actionFor) => {
        let tempbool = 0;
        let pushcont = 0;
        let concatRows = [];
        let isSatisfy = false;
        let newlyCreatedJSon = JSON.parse(newdata);
        let data = JSON.parse(newdata);
        Object.keys(updatedRows).forEach(function (updatedKey, updatedIndex) {
            isSatisfy = false;

            let tempCurrentSet = updatedRows[updatedKey];
            if (tempbool == 0) {

                data.forEach(function(key, index) {
                    pushcont = 1;
                    if (thisObj.fnCheckcondn(actionFor, updatedKey, key.beforUpdate)) {
                        pushcont = 0;
                        //edit the databaserow then delete the row then create the database row again will go this condn
                        if (tempCurrentSet.modificationStatus == 3 && tempCurrentSet.dataBaseName != undefined && tempCurrentSet.dataBaseName != null) {
                            if (tempCurrentSet.dataBaseName == key.whereClauseName) {
                                tempbool = (data.length == 1) ? 1 : 0;
                                tempCurrentSet.dataBaseName = null;
                                tempCurrentSet.whereClauseName = key.whereClauseName;
                                tempCurrentSet.whereClauseCondition = key.whereClauseCondition;
                                tempCurrentSet.modificationStatus = 0;
                                concatRows.push(tempCurrentSet);
                                newlyCreatedJSon.splice(index - (data.length - newlyCreatedJSon.length), 1);

                                isSatisfy = true;
                            }
                        }
                        else if (tempCurrentSet.whereClauseName == key.whereClauseName) {
                            isSatisfy = true;
                            //false condn
                            //if newly created not to care ,and updated --> edited (if edited name is same to newly created then no need to change the status to unmodify)
                            //true condn
                            //if unmodify is created again then it consider as unmodify only.
                            //if we delete the database data then again newly create that also consider as unmodify
                            if (tempCurrentSet.modificationStatus == 3 || tempCurrentSet.modificationStatus == 0) {
                                tempCurrentSet.modificationStatus = 0;
                                concatRows.push(tempCurrentSet);
                                tempbool = (data.length == 1) ? 1 : 0;
                                newlyCreatedJSon.splice(index - (data.length - newlyCreatedJSon.length), 1);

                            }
                            //if database one is already edited then create the same modified one again that also under edited one only not under created one
                            //if create the new one again create the new one will also use this for row arrangements
                            else {
                                concatRows.push(tempCurrentSet);
                                tempbool = (data.length == 1) ? 1 : 0;
                                newlyCreatedJSon.splice(index - (data.length - newlyCreatedJSon.length), 1);

                            }
                            return;
                        }
                    }
            })
        }
            if (!isSatisfy) {
                if (actionFor == "ComplexMerge" || actionFor == "ComplexMergeUpdate") {
                    if (pushcont == 0) {
                        concatRows.push(tempCurrentSet);
                    }
                }
                else if (tempCurrentSet.whereClauseType == 2 || tempCurrentSet.whereClauseType == 3) {//2 - Complex, 3 - Advance
                    concatRows.push(tempCurrentSet);
                }
                else if (tempCurrentSet.modificationStatus == 0 || tempCurrentSet.modificationStatus == 3 || tempCurrentSet.modificationStatus == 2) {
                    tempCurrentSet.modificationStatus = 3;
                    concatRows.push(tempCurrentSet);

                }
            }

        });
        if (actionFor == "ComplexMergeUpdate") {
            let update = updatedRows[data[0].beforUpdate];

            if (tempbool == 0) {
                if (update.modificationStatus != 1) {
          
                    update.whereClauseName = data[0].whereClauseName;
                    update.whereClauseCondition = data[0].whereClauseCondition;
                    update.modificationStatus = (update.dataBaseName == data[0].whereClauseName) ? 0 : 2; 
                    update.whereClauseType = data[0].whereClauseType;
                    update.joinClause = data[0].joinClause;//Added join clause for Advance where clause
                    return concatRows.concat(update);
                } else {
                    return concatRows.concat(data[0]);

                }

            } else {
                if (update.modificationStatus != 1) {
                    update.modificationStatus = 3;
                    return concatRows.concat(update);
                } else {
                    return concatRows;
                }
            }
        }
        else {
            return concatRows.concat(newlyCreatedJSon);

        }
        
    }

    rowForm = (data, actionFor) => {
        const formData = thisObj.state.formData;
        let concatData = [];
        if (actionFor != "delete" && actionFor != undefined) {
            concatData = thisObj.concat(thisObj.state.copyOfClauseRow, JSON.stringify(data), actionFor);
        }
        else {
            concatData = data;
        }
        var result = { showRow: 0 };
        if (Object.keys(concatData).length > 0) {
            result = thisObj.rowFormation(concatData);
        }
        if (result.showRow == 0) {
            thisObj.CommonEach(formData, [{ name: "ShortName", action: "editable", set: true },
            { name: "LongName", action: "editable", set: true }]);

            thisObj.setState({ copyOfClauseRow: concatData, checkedList: "[]", clauseRow: [], readyShow: true, loading: false });
        }
        else {
            thisObj.setState({ copyOfClauseRow: result.concat, clauseRow: result.clauseRow, readyShow: true, loading: false });
        }
    }


    rowFormation = (row) => {
        const formData = thisObj.state.formData;

        let showRow = 0;
        let temp = [];
        let concat = {};
        Object.keys(row).forEach(function (key, index) {
            var rowKey = row[key];

            if (index == 0) {
                thisObj.CommonEach(formData,
                    [{ name: "ShortName", action: "editable", set: false },
                    { name: "LongName", action: "editable", set: false }]);
            }
            const rowIndex = rowKey.whereClauseName;
            concat[rowIndex] = rowKey;
            let rowIndexForEdit = rowKey.whereClauseName + (rowKey.whereClauseType == 3 ? "AdvanceWhereClause" : "ComplexWhereClause");
            const variableLevelWhereConditionID = rowKey.variableLevelWhereConditionID;

            const btn = <div><ButtonWithToolTip onClick={() => thisObj.Condition("edit", rowIndexForEdit)} tooltip="Edit" name="Edit" shape="circle" style={{ marginRight: "5px" }} classname="fas fa-pen" size="small" />
                <ButtonWithToolTip onClick={() => thisObj.fnToDeleteBothRow(rowIndex, variableLevelWhereConditionID)} tooltip="Delete" name="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
            </div>

            if (rowKey.modificationStatus != 3) {
                showRow = 1;
                temp.push({ key: index, Actions: btn, whereClauseCondition: rowKey.whereClauseCondition, whereClauseName: rowKey.whereClauseName, modificationStatus: rowKey.modificationStatus })
            }

        });
        return { clauseRow: temp, showRow: showRow, concat: concat };
    }

    //called when complexWhereClause button pressed
    Condition = (actionFor, whichRow) => {
        thisObj.props.form.validateFields(["ShortName", "LongName"], { force: true }, (err, values) => {
            if (!err) {
                var values = {};
                let modalTitle = "Complex WhereClause";
                let domainName = thisObj.props.data.Domain;
                values["FormName"] = "ValuelevelConfiguration";
                values["ActionName"] = "ComplexConfiguration";                
                values["VariableName"] = thisObj.state.checkedList;
                values["StudyID"] = JSON.parse(sessionStorage.studyDetails).studyID;
                values["DomainID"] = thisObj.props.data.DomainID;
                values["DomainName"] = thisObj.props.data.Domain;
                if ((actionFor.currentTarget != undefined && actionFor.currentTarget.textContent.trim() == "Advanced Where Clause") ||
                    (actionFor == "edit" && whichRow.includes("AdvanceWhereClause"))) {
                    values["DomainID"] = "-1";
                    values["DomainName"] = "";
                    modalTitle = "Advance WhereClause";
                }
                CallServerPost('Variable/GetComplexValuelevelConfigurationFormData', values).then(
                    function (response) {
                        const responseData = response.value;
                        if (responseData.status == 0) {
                            errorModal(responseData.message);
                        } else {
                            if (actionFor != "edit") {
                                thisObj.setState({
                                    edit: false,
                                    readyShow: false, condnShow: true, clauseShow: false,
                                    complexWhereClauseFormData: responseData.formData,
                                    selectOptionsForComplexWhere: { domain: responseData.Domain, comparator: responseData.selectOptions.comparator, operator: responseData.selectOptions.operator },
                                    selectOptionsForComplexWhereForValue: responseData.Value,
                                    selectOptionsForComplexWhereForVariable: responseData.VariableName,
                                    variableName: thisObj.props.form.getFieldValue("ShortName"),
                                    whichRowToEdit: [],
                                    forSaveEditedObj: [],
                                    whereClauseModalTitle: modalTitle,
                                    defaultValForDmain: domainName

                                })
                            } else {
                                if (whichRow != undefined) {
                                    whichRow = whichRow.replace(/AdvanceWhereClause|ComplexWhereClause/gi, '');
                                }
                                thisObj.fnToEditRow(whichRow, responseData, modalTitle, domainName)
                            }
                        }
                    }).catch(error => error);

            }
        })
    }
    fnToEditRow = (rowindex, responseData, modalTitle, domainName) => {
        var neededRowObj = thisObj.state.copyOfClauseRow[rowindex];
        var temp = [];
        let i = 0;
        let whereClauseDomainList = [];
        
        rowindex.split(".AND.").forEach(function (key, index) {

            key.split(".OR.").forEach(function (key1, index1) {

                var tempStore = "";
                let stringValidation = (key[0] == ".") ? (tempStore = key.substring(1), (tempStore[tempStore.length - 1] == ".") ? tempStore.substring(0, tempStore.length - 1) : tempStore) : (key[key.length - 1] == ".") ? key.substring(0, key.length - 1) : key;

                let column = stringValidation.split(".");
                let thirdData = stringValidation.substr(stringValidation.indexOf('.') + 1);
                thirdData = (modalTitle == "AdvanceWhereClause" ? thirdData.substr(thirdData.indexOf('.') + 1) : thirdData);
                let column3 = thirdData.substr(thirdData.indexOf('.') + 1);

                const param = i;
                const btn = (<div>
                    <ButtonWithToolTip onClick={() => deleteRowWhenEdit(param)} tooltip="Delete" name="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
                </div>);
                let newDomain = domainName;
                let newVariableName = column[0];
                let newComparator = column[1];
                if (modalTitle == "AdvanceWhereClause") {
                    newDomain = column[0];
                    newVariableName = column[0] + '.' + column[1];
                    newComparator = column[2];
                }

                if (index1 != (key.split(".OR.").length - 1)) {
                    temp.push({ Actions: btn, key: i, DomainName: newDomain, VariableName: newVariableName, Comparator: externalComplexWhereClauseName(newComparator), Value: column3, Operator: "OR" });
                } else {
                    if (index != (rowindex.split(".AND.").length - 1)) {
                        temp.push({ Actions: btn, key: i, DomainName: newDomain, VariableName: newVariableName, Comparator: externalComplexWhereClauseName(newComparator), Value: column3, Operator: "AND" });

                    }
                    else {
                        temp.push({ Actions: btn, key: i, DomainName: newDomain, VariableName: newVariableName, Comparator: externalComplexWhereClauseName(newComparator), Value: (column3 == undefined) ? "" : column3, Operator: null });

                    }

                }
                if (modalTitle == "AdvanceWhereClause") {
                    if (whereClauseDomainList.indexOf(column[0]) == -1) {
                        whereClauseDomainList.push(column[0]);
                    }
                } else {
                    if (whereClauseDomainList.indexOf(domainName) == -1) {
                        whereClauseDomainList.push(domainName);
                    }
                }
                
                i++;
            })
        });
        //Add DomainList entry to make join clause string
        neededRowObj.whereClauseDomainList = whereClauseDomainList;
        thisObj.setState({
            readyShow: false, condnShow: true, clauseShow: false,
            complexWhereClauseFormData: responseData.formData,
            selectOptionsForComplexWhere: { domain: responseData.Domain, comparator: responseData.selectOptions.comparator, operator: responseData.selectOptions.operator },
            selectOptionsForComplexWhereForValue: responseData.Value,
            selectOptionsForComplexWhereForVariable: responseData.VariableName,
            variableName: thisObj.props.form.getFieldValue("ShortName"),
            edit: true,
            whichRowToEdit: temp,
            forSaveEditedObj: neededRowObj,
            whereClauseModalTitle: modalTitle,
            defaultValForDmain: domainName

        });
    }

    fnEditSave = (whereClauseCnd, whereClauseName, joinClause, editObj) => {
        let temp = JSON.stringify(editObj);
        let parse = JSON.parse(temp);
        if (parse.whereClauseName != whereClauseName) {
            if (parse.modificationStatus == 0 || parse.modificationStatus == 2) {
                if (parse.dataBaseName == undefined || parse.dataBaseName == null) {
                    editObj.dataBaseName = parse.whereClauseName;
                    parse.dataBaseName = parse.whereClauseName;
                }
                parse.variableLevelWhereConditionID = editObj.variableLevelWhereConditionID;
                parse.modificationStatus = 2;

            }
            parse.beforUpdate = parse.whereClauseName;

            parse.whereClauseCondition = whereClauseCnd;
            //parse.whereClauseType = 2;
            parse.joinClause = joinClause;
            parse.whereClauseName = whereClauseName;
            thisObj.rowForm([parse], "ComplexMergeUpdate",);
        }         

        thisObj.setState({ readyShow: true, loading: false, condnShow: false });
    }


    //saveComplexWhereClause
    saveComplexWhereClause = (whereClauseCnd, whereClauseName, joinClause, whereClauseDomainList) => {
        let temp = [{ whereClauseType: (thisObj.state.whereClauseModalTitle === "Complex WhereClause" ? 2 : 3), modificationStatus: 1, whereClauseCondition: whereClauseCnd, whereClauseName: whereClauseName, joinClause: joinClause, whereClauseDomainList: whereClauseDomainList }];
        thisObj.setState({readyShow: true, loading: false, condnShow: false });
        thisObj.rowForm(temp, "ComplexMerge")
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { whichRowToEdit, edit, forSaveEditedObj } = this.state;
        var deafultOption = (<Option disabled key="-1" >--Select--</Option>);
        var allOptions = [deafultOption];
        var { clauseRow, formData, selectOptions, loading, visible, readyShow, clauseShow, condnShow, checkedList, CheckBoxList, complexWhereClauseFormData, selectOptionsForComplexWhere, selectOptionsForComplexWhereForValue, selectOptionsForComplexWhereForVariable} = this.state;
        var { visible, defineActivityWorkflowStatus} = this.props;
        const clauseColumns = [
            {
                title: 'Actions',
                dataIndex: 'Actions',
                key: 'Actions',
                width: 100
            },
            {
                title: 'Where Condition',
                dataIndex: 'whereClauseCondition',
                key: 'whereClauseCondition',
                width: 200
            },
            {
                title: 'WhereClause Name',
                dataIndex: 'whereClauseName',
                key: 'whereClauseName',
                width: 200

            },
        ];
        const condnColumns = [
            {
                title: 'Actions',
                dataIndex: 'Actions',
                key: 'Actions',
                width: 100
            },
            {
                title: 'Variable Name',
                dataIndex: 'VariableName',
                key: 'VariableName',
                width: 100
            },
            {
                title: 'Comparator',
                dataIndex: 'Comparator',
                key: 'Comparator',
                width: 100
            },
            {
                title: 'Value',
                dataIndex: 'Value',
                key: 'Value',
                width: 100
            },
            {
                title: 'Operator',
                dataIndex: 'Operator',
                key: 'Operator',
                width: 100
            },
        ];
        let checkbox = [];

        return (
            <Modal
                visible={visible}
                title="Value Level Configuration"
                cancelType='danger'
                onCancel={this.Cancel}
                onOk={this.handleSubmit}
                maskClosable={false}
                wrapClassName="modalwrap"
                footer={[
                    <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.Cancel}>
                        Cancel
                    </Button>,

                    <Button key="Save" name="Save" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }} onClick={this.save}>
                        Save
                    </Button>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <LayoutContentWrapper id="defineBotTable" style={{ overflow: "auto", height: "100%"}}>
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            {
                                (visible) ?
                                    Object.keys(formData).length > 0 && (

                                        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                                            <div >
                                                <SingleForm FullHeight={true} props={this} responseData={{ formData: formData, selectOptions: selectOptions }} getFieldDecorator={getFieldDecorator} />
                                            </div>
                                            {
                                                (readyShow) ?
                                                    <div style={{ border: "1px solid lightgray", display: "flex", height: "calc(100% - 142px)", flexDirection: "column", padding: "5px", margin: "0 10px", borderRadius: "5px" }}>
                                                        <div className="scroll">
                                                        <ReactTable
                                                            size="small"
                                                            pagination={false}
                                                            columns={clauseColumns}
                                                            dataSource={clauseRow}
                                                            filterDropdownVisible={false}
                                                            scroll={{ x: 400, y: "calc(100% - 60px)" }}
                                                            simpleWhereClause={this.Clause}
                                                            complexWhereClause={this.Condition}
                                                            advancedWhereClause={this.Condition}
                                                            />
                                                            </div>
                                                    </div> :
                                                    (clauseShow) ?
                                                        <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 10px" }}>
                                                            <label title="variableBox"> <strong> Choose the variables to construct the Where Condition </strong></label>
                                                            <div style={{ height: "100%", display: "flex", flexDirection: "column", border: "1px solid lightgray", borderRadius: "5px", overflowY: "auto" }}>
                                                                <div style={{ padding: "5px" }} id="checkboxgroup">
                                                                    <CheckboxGroup value={JSON.parse(checkedList)} name="SimpleWhereClause" onChange={(e) => { this.onChange(e) }} >
                                                                        {CheckBoxList.map(ch => {
                                                                            return <Checkbox className="ant-checkbox-group-item" value={ch.value} disabled={ch.disabled}>{ch.label}</Checkbox>})}
                                                                    </CheckboxGroup>
                                                                 
                                                                </div>
                                                            </div>
                                                            <label title="Selected Variable" style={{ marginTop: "6px", marginBottom: "-10px" }}> <strong>Selected Variable</strong></label>
                                                            <Input onChange={() => {return}}  value={ JSON.parse(checkedList).toString() } defaultValue={JSON.parse(checkedList)} style={{ marginTop: "10px", width: "100%" }} />
                                                        </div> :
                                                        (condnShow) ?
                                                            <div id="complexWhereClause">
                                                                <ComplexWhereClause fnEditSave={this.fnEditSave} title={this.state.whereClauseModalTitle} editOBj={forSaveEditedObj} whichRowToEdit={whichRowToEdit} edit={edit} visible={condnShow} handleCancel={this.Cancel} complexWhereClauseFormData={complexWhereClauseFormData} selectOptionsForComplexWhere={selectOptionsForComplexWhere} selectOptionsForComplexWhereForValue={selectOptionsForComplexWhereForValue} selectOptionsForComplexWhereForVariable={selectOptionsForComplexWhereForVariable} saveComplexWhereClause={this.saveComplexWhereClause} defaultValForVar={this.state.variableName} defaultValForDomain={this.state.defaultValForDmain} property={this} />
                                                            </div> : ""
                                            }

                                        </div>)


                                    : ""
                            }
                        </div>
                    </LayoutContentWrapper>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(ValueLevelConfig);
export default WrappedApp;
