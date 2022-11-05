import React, { Component } from "react";
import { Col, Row, Form, Icon, Select, Button } from "antd";
import NewListComponentWrapper from "../TreeView/newListComponent.style";
import { NewListWrapper } from "../TreeView/newListComponent.style";
import { InputSearch } from "../../components/uielements/input";
import {
    findInString,
    getValueFromForm,
    EMPTY_STR,
    SOURCE,
    TARGET
} from "../Utility/commonUtils";
import { MappingData } from "../TreeView/getMappingDatas";
import ReactTable from "../Utility/reactTable";
import LayoutContent from "../../components/utility/layoutContent";
import ButtonWithToolTip from "../Tooltip/ButtonWithToolTip";
import Create from "./action";
import Variables from "./variables";

const { Option } = Select;
const antIcon = (
    <Icon type="loading" style={{ fontSize: 24, color: "#17242c" }} spin />
);
var thisObj = "";
const columns = [
    {
        title: "Target",
        dataIndex: "target",
        key: "target",
        width: 100
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 100
    },
    {
        title: "Rule",
        dataIndex: "rule",
        key: "rule"
    }
];
const margin = {
    margin: "0 5px 5px 0"
};
class MappingVariables extends Component {
    static getDerivedStateFromProps(props, state) {
        //console.log("MappingVariables getDerivedStateFromProps");
        const dsName =
            props.selectedDS.type === SOURCE
                ? props.selectedDS.dataset.TABLE_NAME
                : props.selectedDS.dataset.domain;
        const dsKey =
            props.selectedDS.type === SOURCE
                ? "TABLE_NAME"
                : "cdiscDataStdDomainMetadataID";
        const varKey =
            props.selectedDS.type === SOURCE
                ? "COLUMN_NAME"
                : "cdiscDataStdVariableMetadataID";
        if (
            dsName !== state.datasetName ||
            props.selectedDS.type !== state.selectedDS.type
        ) {
            return {
                selectedValue: null,
                searchValue: "",
                selectedDS: props.selectedDS,
                datasetName: dsName,
                datasetkey: dsKey,
                variableKey: varKey
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        const dsKey =
            props.selectedDS.type === SOURCE
                ? "TABLE_NAME"
                : "cdiscDataStdDomainMetadataID";
        const varKey =
            props.selectedDS.type === SOURCE
                ? "COLUMN_NAME"
                : "cdiscDataStdVariableMetadataID";

        this.state = {
            selectedValue: null,
            searchValue: "",
            mappingList: [],
            selectedDS: props.selectedDS,
            datasetName:
                props.selectedDS.type === SOURCE
                    ? props.selectedDS.dataset.TABLE_NAME
                    : props.selectedDS.dataset.domain,
            datasetkey: dsKey,
            variableKey: varKey,
            mapperModalVisible: false,
            variableObj: {},
            domainObj: {},
            MappingConstruct: {},
            sel_target_domaian: EMPTY_STR,
            sel_target_variable: EMPTY_STR,
            action:'List'
        };
        thisObj = this;
        //console.log("MappingVariables constructor");
        //console.log(props);
    }

   
    filterMappingConstruct = (selectedValue,mappingList) =>
    {
        if (thisObj.props.selectedDS.type === SOURCE) {

            thisObj.props.form.setFieldsValue({
                domainSelect: EMPTY_STR,
                variableSelect: EMPTY_STR
            });

            thisObj.setState({
                sel_target_domain: EMPTY_STR,
                sel_target_variable: EMPTY_STR,
                selectedValue,
                mappingList: mappingList.filter(
                    mappingOp =>
                        mappingOp["sourceDataset"] === selectedValue["TABLE_NAME"] &&
                        mappingOp["sourceVariableName"] === selectedValue["COLUMN_NAME"]
                )
            });
        } else {
               


            thisObj.setState({
                sel_target_domain: thisObj.state.datasetName,
                sel_target_variable: selectedValue["variableName"],
                selectedValue,
                mappingList: mappingList.filter(
                    mappingOp =>
                        mappingOp["cdiscDataStdVariableMetadataID"] ===
                        selectedValue["cdiscDataStdVariableMetadataID"]
                )
            });
        }
        thisObj.props.dataSetRefresh()

    };

    onSourceClicked = variableObj => {
        
        if (!this.state.selectedValue || (this.state.selectedValue.COLUMN_NAME !== variableObj.COLUMN_NAME)) {
            //Take updated list from controller
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = this.filterMappingConstruct;
            MappinDatas.RefreshMapping(variableObj);
           
        }
    };

    onTargetClicked = variableObj => {
        if (!this.state.selectedValue || (this.state.selectedValue.variableName !== variableObj.variableName)) {
            //Take updated list from controller
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = this.filterMappingConstruct;
            MappinDatas.RefreshMapping(variableObj);
        }
    };

    refreshMappingData = returnObj => {
        //Take updated list from controller
        let MappinDatas = new MappingData();
        MappinDatas.CallBack = this.filterMappingConstruct;
        MappinDatas.RefreshMapping(returnObj);
    };

    mappingDataRefreshed = returnObj => {
        this.props.allValues.hideSpinner();
        this.setState({ selectedValue: returnObj });
    };

    onDomainChange = domain => {
        const domainObj = this.props.allValues.Standards.Domain.filter(
            dm => dm.domain === domain
        )[0];
        this.setState({ domainObj: domainObj, sel_target_domain: domain });
    };

    onVariableChange = variable => {
        const { domainObj } = this.state;
        const variableObj = this.props.allValues.Standards.Variable.filter(
            vr =>
                vr.cdiscDataStdDomainMetadataID ===
                domainObj.cdiscDataStdDomainMetadataID &&
                vr.variableName === variable
        )[0];
        this.setState({ variableObj: variableObj, sel_target_variable: variable });
    };

    addNewMappingOp = () => { };

    confirmDelete = MappingConstructID => { };

    //Hide the Mapping popup
    hideMapperModal = () =>
    {
        thisObj.refreshMappingData(thisObj.state.selectedValue);
        this.setState({ mapperModalVisible: false });
    };

    //Mapping Create 
    Create = () => {
        this.setState({ mapperModalVisible: true, action: "Create" });
    };

    //Mapping Update 
    MappingEdit = (MappingConstruct) => 
    {
        this.setState({ action:"Update", mapperModalVisible: true, MappingConstruct: MappingConstruct});
    };

    //Mapping List
    getmappingRows = () => {
        const thisObj = this;
        const { mappingList } = this.state;
        //Loop to create table datasource
        let Rows = mappingList.map((mappingConstruct, index) => {
            //console.log(mappingConstruct)
            const MappingConstructID = mappingConstruct.mappingConstructID;

            const editCell = (
                <div>
                    {!JSON.parse(sessionStorage.projectStudyLockStatus) && (
                        <ButtonWithToolTip
                            tooltip="Edit"
                            shape="circle"
                            classname="fas fa-pen"
                            size="small"
                            style={margin}
                            onClick={() => thisObj.MappingEdit(mappingConstruct)}
                        />
                    )}
                    {!JSON.parse(sessionStorage.projectStudyLockStatus) && (
                        <ButtonWithToolTip
                            tooltip="Delete"
                            shape="circle"
                            classname="fas fa-trash-alt"
                            size="small"
                            style={margin}
                            onClick={() => thisObj.confirmDelete(MappingConstructID)}
                        />
                    )}
                </div>
            );
            return {
                key: mappingConstruct.mappingConstructID,
                target:
                    mappingConstruct.targetDataSet +
                    "." +
                    mappingConstruct.targetVariableName,
                action: editCell,
                rule: mappingConstruct.constructString
            };
        });

        return Rows;
    };

    getMappingTable = () => {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { allValues, selectedDS } = this.props;
        const { datasetName, selectedValue, mappingList, sel_target_domain, sel_target_variable } = this.state;

        const targetDomain = getValueFromForm(getFieldsValue, "domainSelect");
        const targetVariable = getValueFromForm(getFieldsValue, "variableSelect");
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <Row gutter={8}>
                    <Col span={6}>
                        <Form.Item label={"Target Domain"} style={{ marginLeft: 10 }}>
                            {getFieldDecorator("domainSelect", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Target Domain should be selected"
                                    }
                                ], initialValue: sel_target_domain
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    disabled={
                                        this.props.projectStudyLockStatus ||
                                        this.props.selectedDS.type === TARGET
                                    }
                                    showSearch
                                    placeholder="Select Domain"
                                    key={"domainSelect"}
                                    onChange={this.onDomainChange}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {allValues.StandardDomainOps}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            key={"variableSelect"}
                            label={"Target Variable"}
                            style={{ marginLeft: 10 }}
                        >
                            {getFieldDecorator("variableSelect", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Target Variable should be selected"
                                    }
                                ], initialValue: sel_target_variable
                            })(
                                <Select
                                    style={{ marginLeft: 10, width: "100%" }}
                                    showSearch
                                    placeholder="Select Target Variable"
                                    key={"variableSelect"}
                                    onChange={this.onVariableChange}
                                    disabled={
                                        this.props.projectStudyLockStatus ||
                                        this.props.selectedDS.type === TARGET ||
                                        targetDomain === ""
                                    }
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {targetDomain !== EMPTY_STR &&
                                        allValues.StandardVaraibleOps[targetDomain]}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col>
                        {sel_target_domain !== EMPTY_STR && sel_target_variable !== EMPTY_STR && !JSON.parse(sessionStorage.projectStudyLockStatus) && (
                            <Button
                                icon="plus"
                                style={{ marginTop: 22, marginLeft: 10, float: "right" }}
                                className="reacTable-addbtn"
                                onClick={this.Create}
                            >
                                Add
                            </Button>
                        )}
                        {selectedDS.type === TARGET && (
                            <Button
                                icon="download"
                                style={{ marginTop: 22, marginRight: 10, float: "right" }}
                                className="reacTable-addbtn"
                                onClick={this.addNewMappingOp}
                            >
                                {"Download " + datasetName}
                            </Button>
                        )}
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <LayoutContent>
                            <ReactTable
                                size="small"
                                columns={columns}
                                dataSource={this.getmappingRows()}
                                title={() => "Mapping Operations"}
                                scroll={{ y: "calc(100vh - 400px)" }}
                            />
                        </LayoutContent>
                    </Col>
                </Row>
            </div>
        );
    };

    render() {
        const { selectedDS, allValues, ProgramForm } = this.props;
        const { selectedValue, datasetName, mapperModalVisible, domainObj, variableObj, MappingConstruct, action} = this.state;
        const targetDomain = getValueFromForm(
            this.props.form.getFieldsValue,
            "domainSelect"
        );
        const targetVariable = getValueFromForm(
            this.props.form.getFieldsValue,
            "variableSelect"
        );
        return (
            <NewListComponentWrapper style={{ marginTop: 10, width: "100%" }}>
                <Row
                    gutter={4}
                    style={{ width: "100%", height: "calc(100vh - 180px)" }}
                >
                    <Col span={6} style={{ height: "calc(100vh - 180px)" }}>
                        <div
                            className="isoNoteListSidebar"
                            style={{ width: "100% !important" }}
                        >
                            <Variables
                                onClick={selectedDS.type == SOURCE ? this.onSourceClicked : this.onTargetClicked}
                                for="Mapping"
                                selectedDS={selectedDS.dataset}
                                selectedVarDS={selectedValue}
                                mappingType={selectedDS.type}
                                allValues={allValues}
                            />

                        </div>
                    </Col>
                    <Col style={{ height: "100%" }} span={18}>
                        {selectedValue !== null && this.getMappingTable()}
                    </Col>
                </Row>
                {selectedValue !== null && mapperModalVisible && (
                    <Create

                        action={action}
                        MappingConstruct={MappingConstruct}

                        allValues={allValues}

                        visible={mapperModalVisible}
                        hideMapperModal={this.hideMapperModal}

                        selectedTargetObj={{
                            TargetDomain: targetDomain,
                            TargetVariable: targetVariable,
                            TargetDomainID: domainObj.cdiscDataStdDomainMetadataID,
                            TargetVariableID: variableObj.cdiscDataStdVariableMetadataID,
                            dsType: selectedDS.type,
                         
                        }}
                     
                        targetObj={{
                            Domain: domainObj,
                            Variable: variableObj
                        }}
                        sourceObj={{
                            Domain: selectedDS.dataset,
                            Variable: selectedValue
                        }}
                    />
                )}
            </NewListComponentWrapper>
        );
    }
}

const WrappedApp = Form.create()(MappingVariables);

export default WrappedApp;
