import React, { Component } from 'react';
import { Col, Button, Row, Select, Checkbox, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZoneForDomainCreate, PostCallWithZone, errorModal, successModal, successModalCallback } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/defineBotForm';
import Input from '../../components/uielements/input';
import ReactTable from '../Utility/reactTable';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { SelectOption } from '../../components/uielements/select';
import ComplexWhereClause from './ComplexWhereClause';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

const Option = SelectOption;

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

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
            savedclauseRows: [],
            savedCheckedList: "[]",
            readyShow: true,
            DeletedClauseRows: [],
            savedDeletedClauseRows: "[]",
            complexWhereClauseFormData: [],
            selectOptionsForComplexWhere: {
            variablename: [], value: [], comparator: [], operator: []
            },
            selectOptionsForComplexWhereForValue: [],
        }

        thisObj = this;

    }

    //Get the required field to form the pop up
    componentWillReceiveProps(prop) {
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
                            if (Object.keys(response.value).length != 0) {
                                //[response have the list of Checkbox List,topicvariable(ShortName ddl) ,topicvariablelabel (LongName ddl),formdata]

                                //set state to render the page
                                if (prop.action == "Update") {
                                    let resultData = thisObj.updateField(prop.variablelevelwherecondition);
                                    result.clauseRow = resultData.clauserow;
                                    let tempStore = [];
                                    tempStore.push(resultData.forSave);
                                    result.savedclauseRows = JSON.stringify(tempStore);
                                    result.checkedList = JSON.stringify(resultData.checkboxlist);
                                    result.copyOfClauseRow = resultData.copyOfClauseRow;
                                    thisObj.CommonEach(result.formData,
                                        [{ name: "Domain", action: "defaultValue", set: prop.data.Domain },
                                        { name: "VariableName", action: "defaultValue", set: prop.data.Variable },
                                        { name: "ShortName", action: "defaultValue", set: resultData.topicVariable },
                                        { name: "LongName", action: "defaultValue", set: resultData.topicVariableLabel },
                                        { name: "ShortName", action: "editable", set: false },
                                        { name: "LongName", action: "editable", set: false },
                                        ]);


                                } else {
                                    thisObj.CommonEach(result.formData,
                                        [{ name: "Domain", action: "defaultValue", set: prop.data.Domain },
                                        { name: "VariableName", action: "defaultValue", set: prop.data.Variable }]);
                                }
                                result.OriginalCheckBoxList = result.CheckBoxList;
                                result.CheckBoxList = thisObj.checkDataFormation(result.CheckBoxList, "");
                                result.visible = prop.visible;
                                result.selectOptions = { topicvariable: result.TopicVariable, topicvariablelabel: result.TopicVariableLabel }
                                thisObj.setState(result);
                            }

                        }

                    }).catch(error => error);
            }
            else {
                var result = {};
                let resultData = [];
                var tempSavedclauseRows = JSON.parse(thisObj.state.savedclauseRows)[0];
                if (Object.keys(tempSavedclauseRows).length > 0) {
                    resultData = thisObj.rowFormation(tempSavedclauseRows);
                    result.clauseRow = resultData.clauseRow;
                    result.copyOfClauseRow = tempSavedclauseRows;
                    result.checkedList = thisObj.state.savedCheckedList;
                    result.DeletedClauseRows = JSON.parse(thisObj.state.savedDeletedClauseRows);
                    thisObj.CommonEach(thisObj.state.formData,
                        [{ name: "ShortName", action: "editable", set: false },
                        { name: "LongName", action: "editable", set: false },
                        ]);

                } else {
                    result.clauseRow = [];
                    result.copyOfClauseRow = {};
                    result.checkedList = "[]";
                    result.DeletedClauseRows = [];
                    thisObj.CommonEach(thisObj.state.formData,
                        [{ name: "ShortName", action: "editable", set: true },
                        { name: "LongName", action: "editable", set: true },
                        ]);

                }

                result.visible = prop.visible;
                thisObj.rowForm(tempSavedclauseRows);
                thisObj.setState(result);
            }

            loopControl = false;
        }
        else if (!prop.visible) {
            description = "";
            prop.form.resetFields();
            loopControl = true;
            thisObj.setState({
                visible: prop.visible
            });
        }
    }

    checkDataFormation = (CheckBoxList, name) => {
        let data = [];
        CheckBoxList.forEach(function (key, index) {
            if (key == name) {
                data.push({ label: key, value: key, disabled: true });
            }
            else {
                data.push({ label: key, value: key, disabled: false });
            }
        });
        return data;
    }


    updateField = (data) => {        
        let row = [];
        let str = "";
        let groupBy = [];
        let result = {};
        let copyOfClauseRow = {};
        let forSave = {};
        data.forEach(function (key, index) {
            const btn = <div><ButtonWithToolTip name="Edit" tooltip="Edit" shape="circle" style={{ marginRight: "5px" }} classname="fas fa-pen" size="small" />
                <ButtonWithToolTip name="Delete" onClick={() => thisObj.fnToDeleteRow(key.whereClauseName)} tooltip="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
            </div>

            if (!str.includes(key.groupBy)) {
                groupBy.push(key.groupBy)
            }
            if (index == 0) {
                result.topicVariable = key.topicVariable;
                result.topicVariableLabel = key.topicVariableLabel;

            }
            key.modificationStatus = 0;
            let stringify = JSON.stringify([key]);
            copyOfClauseRow[key.whereClauseName] = JSON.parse(stringify)[0];
            forSave[key.whereClauseName] = JSON.parse(stringify)[0];
            if (key.modificationStatus != 3) {
                row.push({ Actions: btn, whereClauseCondition: key.whereClauseCondition, whereClauseName: key.whereClauseName, modificationStatus: key.modificationStatus, Update: true, groupBy: key.groupBy })
                str += key.groupBy + ",";
            }

        })

        result.copyOfClauseRow = copyOfClauseRow;
        result.forSave = forSave;
        result.checkboxlist = groupBy;
        result.clauserow = row;
        return result;
    }

    //Save to get the field value and send it to add page
    cmntSave = (e) => {

    }

    fnPageFieldValidation = (value) => {
        thisObj.props.form.setFieldsValue({ Pages: value });
    }

    Clause = () => {
        thisObj.props.form.validateFields(["ShortName", "LongName"], { force: true }, (err, values) => {
            if (!err) {
                const state = thisObj.state;
                checkedListBeforeOpenClause = thisObj.state.checkedList;
                var tempCheckedList = [thisObj.props.form.getFieldValue("ShortName")];
                if (JSON.parse(thisObj.state.checkedList).length != 0) {
                    tempCheckedList = JSON.parse(thisObj.state.checkedList);
                }

                thisObj.setState({
                    readyShow: false, checkedList: JSON.stringify(tempCheckedList),
                    clauseShow: true, condnShow: false, CheckBoxList: thisObj.checkDataFormation(state.OriginalCheckBoxList, values.ShortName)
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
    //called when complexWhereClause button pressed
    Condition = () => {
        thisObj.props.form.validateFields(["ShortName", "LongName"], { force: true }, (err, values) => {
            if (!err) {
                var values = {};
                values["FormName"] = "ValuelevelConfiguration";
                values["ActionName"] = "ComplexConfiguration";
                values["DomainName"] = thisObj.props.data.Domain;
                values["VariableName"] = thisObj.state.checkedList;
                values["DomainID"] = thisObj.props.data.DomainID;
                values["StudyID"] = JSON.parse(sessionStorage.studyDetails).studyID;

                CallServerPost('Variable/GetComplexValuelevelConfigurationFormData', values).then(
                    function (response) {
                        const responseData = response.value;
                        if (responseData.status == 0) {
                            errorModal(responseData.message);
                        } else {
                            thisObj.setState({
                                readyShow: false, condnShow: true, clauseShow: false,
                                complexWhereClauseFormData: responseData.formData,
                                selectOptionsForComplexWhere: { variablename: responseData.VariableName, comparator: responseData.selectOptions.comparator, operator: responseData.selectOptions.operator },
                                selectOptionsForComplexWhereForValue: responseData.Value
                            });
                        }        
                    }).catch(error => error);

            }
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
                selectOptionsForComplexWhere: { variablename: [], value: [], comparator: [], operator: [] },
                selectOptionsForComplexWhereForValue: []
            });
        }
    }

    onChange = (e) => {
        let temp = JSON.stringify(e);
        thisObj.setState({ checkedList: temp })
    }
    shortNameChange = (value) => {
        var data = [value]
        thisObj.setState({ checkedList: JSON.stringify(data) });
    }

    save = () => {
        thisObj.props.form.validateFields((err, values) => {

            if (!err) {
                values.GroupBy = [];
                if (JSON.parse(thisObj.state.checkedList).length != 0) {
                    values.GroupBy = JSON.parse(thisObj.state.checkedList).reverse().toString();
                }
                values.StudyID = JSON.parse(sessionStorage.studyDetails).studyID;
                if (thisObj.state.readyShow) {
                    const formData = thisObj.state.formData;

                    var tempData = [];
                    Object.keys(thisObj.state.copyOfClauseRow).forEach(function (key, index) {
                        let currentObj = thisObj.state.copyOfClauseRow[key];

                        let temp = {
                            whereClauseCondition: currentObj.whereClauseCondition, whereClauseName: currentObj.whereClauseName, domain: values.Domain, topicVariable: values.ShortName, topicVariableLabel: values.LongName,
                            groupBy: values.GroupBy, studyID: values.StudyID,
                            variableName: values.VariableName,
                            modificationStatus: currentObj.modificationStatus,
                            updatedBy: JSON.parse(sessionStorage.userProfile).userID, whereClauseType: currentObj.whereClauseType,
                        };
                        tempData.push(temp)
                    })
                    thisObj.CommonEach(formData,
                        [{ name: "ShortName", action: "defaultValue", set: values.ShortName },
                        { name: "LongName", action: "defaultValue", set: values.LongName }]);


                    thisObj.setState({ savedDeletedClauseRows: JSON.stringify(thisObj.state.DeletedClauseRows), savedCheckedList: thisObj.state.checkedList, savedclauseRows: JSON.stringify([thisObj.state.copyOfClauseRow]) });
                    thisObj.props.saveValueLevel(tempData);
                }
                else {
                    thisObj.setState({ loading: true });

                    //thisObj.props.saveValueLevel({valueLevelConfig:values})
                    PostCallWithZoneForDomainCreate('Variable/GenerateDefaultWhereCondition', values).then(
                        function (response) {
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

    fnToDeleteRow = (rowindex) => {
        var rows = thisObj.state.copyOfClauseRow;
        if (rows[rowindex].modificationStatus != 0) {
           
            delete rows[rowindex]
            
        }
        else {            
            let tempDelete = thisObj.state.DeletedClauseRows;


            rows[rowindex].modificationStatus = 3;
            let deletedClauses = [];            
            deletedClauses = tempDelete;
            deletedClauses.push(rows[rowindex]);
            thisObj.setState({ DeletedClauseRows: deletedClauses });

                //CallServerPost('Variable/DeleteValueListWhereCaluseRef', rows[rowindex]).then(
                //    function (response) {
                //        //console.log(response);
                //        const responseData = response;
                //        if (responseData.status == 0) {
                //            errorModal(responseData.message);
                //        }
                //        else {
                //            let data = thisObj.rowForm(responseData.value.ConditionList, "Delete")
                //            //successModalCallback(responseData.message, thisObj.Cancel);
                

            //        }
            //    }).catch(error => error);
        }

        thisObj.rowForm(rows, "delete");

    }


    concat = (updatedRows, data) => {
        let concatRows = [];
        let isSatisfy = false;
        Object.keys(updatedRows).forEach(function (updatedKey, updatedIndex) {
            isSatisfy = false;
            let tempCurrentSet = updatedRows[updatedKey];

            data.forEach(function (key, index) {

                if (tempCurrentSet.whereClauseName == key.whereClauseName) {
                    isSatisfy = true;
                    key.modificationStatus = 4;
                    
                    return;
                }
                else {
                    isSatisfy = false
                }
            })
            if (!isSatisfy) {
                if (tempCurrentSet.modificationStatus == 0 || tempCurrentSet.modificationStatus == 3 ) {
                    tempCurrentSet.modificationStatus = 3;
                    concatRows.push(tempCurrentSet);

                }
            }

        });
        return concatRows.concat(data);
    }

    rowForm = (data, actionFor) =>
    {
        const formData = thisObj.state.formData;
        let concatData = [];

        if (thisObj.props.action == "Update" && actionFor != "delete" && actionFor != undefined) {
            concatData = thisObj.concat(thisObj.state.copyOfClauseRow, data);
        }
        else {
            concatData = data;
        }
        var result = { showRow: 0 };
        if (Object.keys(concatData).length > 0) {
            result = thisObj.rowFormation(concatData);
        }
        if (result.showRow == 0)
        {
            thisObj.CommonEach(formData,[{ name: "ShortName", action: "editable", set: true },
                    { name: "LongName", action: "editable", set: true }])

            var data = [thisObj.props.form.getFieldValue("ShortName")]
            thisObj.setState({ copyOfClauseRow: concatData, checkedList: JSON.stringify(data), clauseRow: [], readyShow: true, loading: false });
        }
        else
        {
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
            const btn = <div><ButtonWithToolTip tooltip="Edit" name="Edit" shape="circle" style={{ marginRight: "5px" }} classname="fas fa-pen" size="small" />
                <ButtonWithToolTip name="Delete" onClick={() => thisObj.fnToDeleteRow(rowIndex)} tooltip="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
            </div>

            if (rowKey.modificationStatus != 3) {
                showRow = 1;
                temp.push({ Actions: btn, whereClauseCondition: rowKey.whereClauseCondition, whereClauseName: rowKey.whereClauseName, modificationStatus: rowKey.modificationStatus })
            }

        })
        return { clauseRow: temp, showRow: showRow, concat: concat};
    }
    //saveComplexWhereClause
    saveComplexWhereClause = (whereClauseCnd, whereClauseName) => {
        let temp = [];
        const btn = (<div><ButtonWithToolTip name="Edit" tooltip="Edit" shape="circle" style={{ marginRight: "5px" }} classname="fas fa-pen" size="small" />
            <ButtonWithToolTip tooltip="Delete" name="Delete" shape="circle" classname="fas fa-trash-alt" size="small" />
        </div>);
        temp.push({ Actions: btn, whereClauseCondition: whereClauseCnd, whereClauseName: whereClauseName });
        thisObj.setState({ clauseRow: temp, readyShow: true, loading: false, condnShow: false });
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        var deafultOption = (<Option disabled key="-1" >--Select--</Option>);
        var allOptions = [deafultOption];
        var { clauseRow, formData, selectOptions, loading, visible, readyShow, clauseShow, condnShow, checkedList, CheckBoxList, complexWhereClauseFormData, selectOptionsForComplexWhere, selectOptionsForComplexWhereForValue } = this.state;
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
                onCancel={this.props.handleCancel}
                onOk={this.handleSubmit}
                maskClosable={false}
                wrapClassName="modalwrap"
                footer={[
                    <Button name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.Cancel}>
                        Cancel
                    </Button>,

                    <Button name="Save" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }} onClick={this.save}>
                        Save
                    </Button>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <LayoutContentWrapper id="defineBotTable">
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            {
                                (visible) ?
                                    Object.keys(formData).length > 0 && (

                                        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                                            <div>
                                                <SingleForm props={this} responseData={{ formData: formData, selectOptions: selectOptions }} getFieldDecorator={getFieldDecorator} />
                                            </div>
                                            {
                                                (readyShow) ?
                                                    <div style={{ border: "1px solid lightgray", display: "flex", height: "100%", flexDirection: "column", padding: "5px", margin: "0 10px", borderRadius: "5px" }}>
                                                        <ReactTable
                                                            size="small"
                                                            pagination={false}
                                                            columns={clauseColumns}
                                                            dataSource={clauseRow}
                                                            filterDropdownVisible={false}
                                                            scroll={{ x: 400, y: "calc(100% - 34px)" }}
                                                            simpleWhereClause={this.Clause}
                                                            complexWhereClause={this.Condition}
                                                        />
                                                    </div> :
                                                    (clauseShow) ?
                                                        <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0 10px" }}>
                                                            <label for="variableBox" title="variableBox"> <strong> Choose the variables to construct the Where Condition </strong></label>
                                                            <div style={{ minHeight: "210px", height: "100%", display: "flex", flexDirection: "column", border: "1px solid lightgray", borderRadius: "5px", overflowY: "auto" }}>
                                                                <div style={{ padding: "5px" }} id="checkboxgroup">
                                                                    <CheckboxGroup options={CheckBoxList} value={JSON.parse(checkedList)} onChange={(e) => { this.onChange(e) }} />
                                                                </div>
                                                            </div>
                                                            <label for="SelectedVariable" title="Selected Variable" style={{ marginTop: "6px", marginBottom: "-10px" }}> <strong>Selected Variable</strong></label>
                                                            <Input value={JSON.parse(checkedList).reverse().toString()} style={{ marginTop: "10px", width: "100%" }} />
                                                        </div> :
                                                        (condnShow) ?
                                                            <div id="complexWhereClause">
                                                                <ComplexWhereClause visible={condnShow} handleCancel={this.Cancel} complexWhereClauseFormData={complexWhereClauseFormData} selectOptionsForComplexWhere={selectOptionsForComplexWhere} selectOptionsForComplexWhereForValue={selectOptionsForComplexWhereForValue} saveComplexWhereClause={this.saveComplexWhereClause} defaultValForVar={checkedList} />                                                            
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
