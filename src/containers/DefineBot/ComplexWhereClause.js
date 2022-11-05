import React, { Component } from 'react';
import { Input, Col, Button, Row, Select, Form, Modal, Spin, Icon } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { errorModal, CallServerPost, showProgress, hideProgress } from '../Utility/sharedUtility';
import ReactTable from '../Utility/reactTable';
import SingleForm from '../Utility/defineBotForm';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
const { TextArea } = Input;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
let temp = [];
let whereClauseDomainList = [];

class ComplexWhereClause extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            loading: false,
            flag: false,
            complexWhereClauseDatas: props.whichRowToEdit,
            whereCndInputVal: (this.props.edit) ? props.editOBj.whereClauseCondition : "",
            operatorValue: (this.props.edit) ? null : "",
            whereClauseName: (this.props.edit) ? props.editOBj.whereClauseName : "",
            optionsForValues: [],
            optionsForVariable: [],
            rowIndex: 0,
            flagToResetVarName: false,
            edit: this.props.edit,
            loopControl: true,
            joinClause: ""
        }
        thisObj = this;
        whereClauseDomainList = (this.props.edit) ? props.editOBj.whereClauseDomainList : [];
        temp = props.whichRowToEdit;
    }

    //Get the required field to form the pop up    
    componentDidMount() {
        thisObj.variableNameChange(thisObj.props.defaultValForVar);
        thisObj.domainNameChange(thisObj.props.defaultValForDomain);
    }
    //Get the required field to form the pop up    
    static getDerivedStateFromProps (props) {
        if (props.visible && !thisObj.state.loopControl) {

            thisObj.setState({ loopControl: true, edit: props.edit, operatorValue: (props.edit) ? null : "", visible: props.visible, complexWhereClauseDatas: props.whichRowToEdit })
        }
        
    }
    //this method called when we change the variable name ddl to reset value ddl
    variableNameChange = (value) => {
        //iterating values to set option for Value Dropdown list       
        let optionsForValues = [];
        let selectDomainValue = "";
        if (thisObj.props.title == "Advance WhereClause") {
            selectDomainValue = (thisObj.props.form.getFieldValue("Domain") != undefined ? thisObj.props.form.getFieldValue("Domain") : thisObj.props.defaultValForDomain);
        }
        thisObj.props.selectOptionsForComplexWhereForValue.map(function (option) {
            let flag = true;
            if (thisObj.props.title == "Advance WhereClause" && selectDomainValue != option.parentKeyValue) {
                flag = false
            }
            if (flag && value == option.keyValue) {
                var newOption = {};
                newOption.keyValue = (option.literal == "" ? "empty" : option.literal);
                newOption.literal = (option.literal == "" ? "empty" : option.literal);
                optionsForValues.push(newOption);
            }
        });
        thisObj.props.form.resetFields("Value");
        thisObj.setState({ optionsForValues: optionsForValues });
    }

    //this method called when we change the domain name ddl to reset variable ddl
    domainNameChange = (value, actionName) => {
        //iterating values to set option for Variable Dropdown list       
        let optionsForVariable = [];
        thisObj.props.selectOptionsForComplexWhereForVariable.map(function (option) {
            if (value.toLowerCase() == option.keyValue.toLowerCase()) {
                var newOption = {};
                newOption.keyValue = (option.literal == "" ? "empty" : option.literal);
                newOption.literal = (option.literal == "" ? "empty" : option.literal);
                optionsForVariable.push(newOption);
            }
        });
        if (actionName == "Change") {
            thisObj.props.form.resetFields("VariableName");
            thisObj.props.form.resetFields("Value");
            thisObj.setState({ flagToResetVarName: true, optionsForVariable: optionsForVariable });
        } else {
            thisObj.setState({ flagToResetVarName: false, optionsForVariable: optionsForVariable });
        }
    }

    comparatorChange = () => {
        thisObj.props.form.resetFields("Value");
    }

    //this method called when Add button pressed after selecting variable, comparator, value and operator to form complex where clause 
    addComplexORAdvanceWhereClause = () => {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                if (thisObj.state.operatorValue == null) {
                    errorModal("The where condition is incomplete");
                } else {
                    let rowIndex = thisObj.state.rowIndex + 1;
                    const btn = (<div>
                        <ButtonWithToolTip onClick={() => thisObj.fnToDeleteRow(rowIndex)} tooltip="Delete" name="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
                    </div>);
                    let tempValue = null;
                    if (typeof (values.Value) == "object") {
                        values.Value.map(function (val) {
                            if (val != null) {
                                if (tempValue != undefined && tempValue != null && tempValue != "") {
                                    tempValue = tempValue + ',' + val;
                                } else {
                                    tempValue = val;
                                }
                            }
                        });
                    } else {
                        tempValue = values.Value;
                    }
                    temp.push({ key: rowIndex, Actions: btn, DomainName: values.Domain, VariableName: (thisObj.props.title == "Advance WhereClause" ? values.Domain + '.' + values.VariableName : values.VariableName), Comparator: values.Comparator, Value: tempValue, Operator: values.Operator });
                    //set values for where contion input field
                    //Append Domain Name before the Variable Name for Advanced Where clause form
                    let newWhereCndInputVal = ((thisObj.state.whereCndInputVal != "") ? (thisObj.state.whereCndInputVal + " ") : "") + (thisObj.props.title == "Advance WhereClause" ? (values.Domain + '.' + values.VariableName) : values.VariableName) + " " + values.Comparator + " " + thisObj.setValuesForInput(values.Value, "Condn") + (values.Operator != null ? " " + values.Operator : "");
                    let whereClauseNames = thisObj.getValuesForWhereClauseName(values.Domain, values.VariableName, values.Comparator, thisObj.setValuesForInput(values.Value, "ClauseName"), (values.Operator != null ? values.Operator : null));
                    if (thisObj.props.title == "Advance WhereClause" && whereClauseDomainList.indexOf(values.Domain) == -1) {
                        whereClauseDomainList.push(values.Domain);
                    }
                    let joinClause = (thisObj.props.title == "Advance WhereClause" ? thisObj.buildJoinClauseValues() : "");
                    thisObj.props.form.resetFields();
                    thisObj.domainNameChange(thisObj.props.form.getFieldValue("Domain"), "Change");
                    thisObj.setState({ rowIndex: rowIndex, complexWhereClauseDatas: temp, whereCndInputVal: newWhereCndInputVal, operatorValue: values.Operator, whereClauseName: whereClauseNames, optionsForValues: [], flagToResetVarName: true, joinClause });
                }
            }
        })
    }
    setValuesForInput = (values, fnFor) => {
        let newTempVal = [];
        if (typeof (values) == "object") {
            let newVal = values.filter(val => val != null).map(val => ("'" + (val == "empty" ? "" : val) + "'"));
            newTempVal = '(' + newVal + ')';
        } else {
            values = (values == "empty" ? "" : values);

            newTempVal = (fnFor == "Condn") ? "'" + values + "'" : values;
        }
        return newTempVal;
    }

    //
    buildJoinClauseValues = () => {
        let joinClause = "";
        if (whereClauseDomainList.length > 0) {
            for (let i = 0; i < whereClauseDomainList.length; i++) {
                if (whereClauseDomainList[i] != thisObj.props.defaultValForDomain) {
                    joinClause += " INNER JOIN DatabaseName_" + whereClauseDomainList[i] + ' ' + whereClauseDomainList[i] + ' ON ' + whereClauseDomainList[i] + '.USUBJID = ' + whereClauseDomainList[i - 1] + '.USUBJID';
                }
            }
        }
        return joinClause.trim();
    }

    getValuesForWhereClauseName = (domain, vars, comp, vals, opr) => {
        let appendVal = ".";
        comp = thisObj.complexWhereClauseName(comp);
        let removeLastDot = appendVal + opr;
        if (opr == null) {
            opr = "";
            removeLastDot = '';
        }
        let whereClauseNameVals = "";
        if (thisObj.state.whereClauseName != "") {
            whereClauseNameVals = thisObj.state.whereClauseName + "." + (thisObj.props.title == "Advance WhereClause" ? (domain + '.' + vars) : vars) + appendVal + comp + appendVal + vals + removeLastDot;
        } else {

            whereClauseNameVals = (thisObj.props.title == "Advance WhereClause" ? (domain + '.' + vars) : vars) + appendVal + comp + appendVal + vals + removeLastDot;
        }
        return (whereClauseNameVals);
    }

    //Save to get the field value and send it to add page
    saveComplexWhereClause = () => {
        if (thisObj.state.operatorValue != null && thisObj.state.operatorValue != "") {
            errorModal("The where condition is incomplete");
        }
        else {
            let whereCondData = {
                joinClause: thisObj.state.joinClause,
                whereClauseCondition: thisObj.state.whereCndInputVal,
                domain: thisObj.props.property.props.form.getFieldValue("Domain"),
                topicVariable: thisObj.props.property.props.form.getFieldValue("ShortName"),
                topicVariableLabel: thisObj.props.property.props.form.getFieldValue("LongName"),
                variableName: thisObj.props.property.props.form.getFieldValue("VariableName"),
                studyID: JSON.parse(sessionStorage.studyDetails).studyID,
                whereClauseType: thisObj.props.title === "Complex WhereClause" ? 2 : 3
            };
            showProgress();
            CallServerPost('Variable/CheckWhereCondition', whereCondData ).then(function (response) {
                if (response.status === 0) {
                    errorModal(response.message);
                } else {
                    if (thisObj.props.edit) {
                        thisObj.props.fnEditSave(thisObj.state.whereCndInputVal, thisObj.state.whereClauseName, thisObj.state.joinClause, thisObj.props.editOBj);
                    }
                    else {
                        thisObj.props.saveComplexWhereClause(thisObj.state.whereCndInputVal, thisObj.state.whereClauseName, thisObj.state.joinClause, whereClauseDomainList);
                    }
                    //thisObj.cancel();
                }
                hideProgress();
            }).catch(error => error); 
        }
    }
    //this method used to return cmplex where clause name
    complexWhereClauseName = (wherecond) => {
        return externalComplexWhereClauseName(wherecond);
    }

    //this method used to delete added complexwhereclause
    fnToDeleteRow = (rowindex) => {

        var rows = thisObj.state.complexWhereClauseDatas;
        let index;
        let joinClause = "";
        let domainNameTobeDelete;
        rows.filter(function (opt) {
            if (opt.key == rowindex) {
                index = rows.indexOf(opt);
                domainNameTobeDelete = opt.DomainName;
            }
        });
        rows.splice((index), 1);
        //Domain Name need to be delete to construct join Clause
        if (thisObj.props.title == "Advance WhereClause") {
            for (let i in whereClauseDomainList) {
                let flag = true;
                if (whereClauseDomainList[i] == domainNameTobeDelete) {
                    rows.map(function (row) {
                        if (row.DomainName == whereClauseDomainList[i]) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        whereClauseDomainList.splice((i), 1);
                    }
                }
            }
            joinClause = thisObj.buildJoinClauseValues();
        }

        let whereCndInputVal = thisObj.formWhereCndInputVal(rows);
        let whereClauseNames = thisObj.formWhereCndInputVal(rows, "clauseName");
        let oprVal = (rows.length > 0 ? rows[(rows.length - 1)].Operator : "");
        thisObj.setState({ complexWhereClauseDatas: rows, whereCndInputVal: whereCndInputVal, operatorValue: oprVal, whereClauseName: whereClauseNames, joinClause });
    }
    //used to form where clause input and where clause name after deleting
    formWhereCndInputVal = (arr, clauseName) => {
        let newWhereCndInputVal = "";
        let appendVal = " ";
        let firstChar = "";
        if (clauseName != undefined && clauseName == "clauseName") {
            appendVal = '.';
        }
        if (arr.length > 0) {
            arr.map(function (option) {
                let comp = (clauseName == "clauseName") ? externalComplexWhereClauseName(option.Comparator) : option.Comparator;

                let value = (clauseName != "clauseName") ? ("'" + option.Value + "'") : option.Value;
                if (comp == "IN" || comp == "NOT IN") {
                    newWhereCndInputVal = newWhereCndInputVal + appendVal + option.VariableName + appendVal + comp + appendVal + '(' + value + ')' + appendVal + (option.Operator != null ? option.Operator : "");
                } else {
                    newWhereCndInputVal = newWhereCndInputVal + appendVal + option.VariableName + appendVal + comp + appendVal + value + appendVal + (option.Operator != null ? option.Operator : "");
                }
            })
        }
        newWhereCndInputVal = newWhereCndInputVal;
        firstChar = newWhereCndInputVal.charAt(0);
        newWhereCndInputVal = (firstChar == '.' ? newWhereCndInputVal.substring(1) : newWhereCndInputVal);
        return newWhereCndInputVal;
    }
    //this method call when click cancel button in complex where clause modal
    cancel = () => {
        temp = [];
        this.props.handleCancel();
        whereClauseDomainList = [];
        thisObj.setState({ complexWhereClauseDatas: [], whereCndInputVal: "", optionsForValues: [], rowIndex: 0 });
    }

    render() {

        const { complexWhereClauseFormData, selectOptionsForComplexWhere, edit, title ,visible} = this.props;
        const { getFieldDecorator } = this.props.form;
        var { loading, complexWhereClauseDatas, whereCndInputVal,  optionsForValues, optionsForVariable } = thisObj.state;

        //used to reset values ddl options
        selectOptionsForComplexWhere.value = [];
        selectOptionsForComplexWhere.value = optionsForValues;
        selectOptionsForComplexWhere.variablename = [];
        selectOptionsForComplexWhere.variablename = optionsForVariable;

        const condnColumns = [
            {
                title: 'Actions',
                dataIndex: 'Actions',
                key: 'Actions',
                width: 90
            },
            {
                title: 'Variable Name',
                dataIndex: 'VariableName',
                key: 'VariableName',
                width: 90
            },
            {
                title: 'Comparator',
                dataIndex: 'Comparator',
                key: 'Comparator',
                width: 90
            },
            {
                title: 'Value',
                dataIndex: 'Value',
                key: 'Value',
                width: 90
            },
            {
                title: 'Operator',
                dataIndex: 'Operator',
                key: 'Operator',
                width: 90
            },
        ];
        return (
            <Modal
                visible={visible}
                title={title}
                cancelType='danger'
                onCancel={this.props.handleCancel}
                maskClosable={false}
                width={850}
                style={{ marginTop:"-85px" }}
                footer={[
                    <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.cancel}>
                        Cancel
                    </Button>,
                    (complexWhereClauseDatas.length > 0 ? (<Button name="Save" key="ComplexSave" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }} onClick={thisObj.saveComplexWhereClause}>
                        Save
                    </Button>) : (<Button key="Save" name="Save" disabled className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "lightgrey", backgroundColor: 'lightgrey !important' }} onClick={thisObj.saveComplexWhereClause}>
                            Save
                    </Button>))

                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <LayoutContentWrapper>
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            {

                                <div style={{ height: "100%", display: "block", flexDirection: "column", border: "1px solid lightgray", margin: "0 10px", borderRadius: "5px", overflow: "auto" }}>

                                    <div style={{ width: '100%', padding: "5px", height:"430px" }}>

                                        <div>
                                            <SingleForm props={thisObj} responseData={{ formData: complexWhereClauseFormData, selectOptions: selectOptionsForComplexWhere }} getFieldDecorator={getFieldDecorator} />
                                            <Row style={{ float: "right", marginRight: "10px", marginTop:"-30px" }}>
                                                <Button name="Add" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }} onClick={this.addComplexORAdvanceWhereClause} >
                                                    Add
                                                </Button>
                                            </Row>

                                        </div>
                                        <div style={{ display: "flex", height: "calc(90% - 142px)", flexDirection: "column", padding: "5px", margin: "0 10px" }}>
                                            <ReactTable
                                                size="small"
                                                pagination={false}
                                                search={false}
                                                page="Complex"
                                                dataSource={complexWhereClauseDatas}
                                                columns={condnColumns}
                                                filterDropdownVisible={false}
                                                scroll={{ x: 300, y: "calc(100vh - 485px)"  }}
                                            />
                                        </div>
                                        <label title="Where Condition" style={{ marginLeft: 10, marginTop: "6px", marginBottom: "-10px", fontWeight: 600, fontSize: 14, color: 'rgba(0,0,0,0.85)' }}> <strong>Where Condition</strong></label>
                                        <TextArea onChange={() => { return }} name="Where Condition" value={whereCndInputVal} title={whereCndInputVal} style={{ width: "-webkit-fill-available", margin: "10px 10px 0px 10px" }} />

                                    </div>

                                </div>
                            }

                        </div>
                    </LayoutContentWrapper>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(ComplexWhereClause);
export default WrappedApp;

export function deleteRowWhenEdit(data) {
    thisObj.fnToDeleteRow(data)
}
export function externalComplexWhereClauseName(condn) {
    switch (condn) {
        case 'LTE': return '<=';
        case 'GTE': return '>=';
        case 'EQ': return '=';
        case 'LT': return '<';
        case 'GT': return '>';
        case 'NEQ': return '<>';
        case '<=': return 'LTE';
        case '>=': return 'GTE';
        case '=': return 'EQ';
        case '<': return 'LT';
        case '>': return 'GT';
        case '<>': return 'NEQ';
        case 'IN': return 'IN';
        case 'NOT IN': return 'NOT IN';
    }
}