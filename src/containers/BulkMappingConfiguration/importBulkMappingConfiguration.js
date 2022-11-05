import { Breadcrumb, Button, Col, Form, Row } from "antd";
import moment from 'moment-timezone';
import React, { Component } from "react";
import LayoutContent from "../../components/utility/layoutContent";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import TableWrapper from '../../styles/Table/antTable.style';
import { CallServerPost, DownloadFileWithPostData, errorModal, successModalCallback, getUserID, hideProgress, PostCallWithZone, showProgress, successModal } from '../Utility/sharedUtility';
import XLSXFileReader from '../Utility/XLSXFileReader';

export const splitClass = 24;
export const SM_SPLIT = 24;
export const PADDING_RIGHT_10 = { paddingRight: "10px" };
const FormItem = Form.Item;
var thisObj = [];
const validData = ["SourceValue", "CodeListVersion", "CodeListName", "TargetValue", "TargetDomain", "TargetVariable", "ProjectName", "StudyName"];

class importBulkMappingConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            validationData: [],
            selectedRowKeys: [],
            selectedrows: [],
            missingData: []
        };
        thisObj = this;
        window.addEventListener('resize', this.Render);
    }

    componentDidUpdate() {
        //for scroll
        thisObj.Render();
    }

    Render = () => {
        if (document.getElementsByClassName("ant-table-body")[0]) {
            if (document.getElementsByClassName("ant-table-body")[0].clientHeight >= document.getElementsByClassName("ant-table-body")[0].scrollHeight) {
                document.getElementsByClassName("ant-table-header")[0].classList.add("autoScroll");
                document.getElementsByClassName("ant-table-header")[0].classList.remove("staticScroll");
            } else {
                document.getElementsByClassName("ant-table-header")[0].classList.add("staticScroll");
                document.getElementsByClassName("ant-table-header")[0].classList.remove("autoScroll");

            }
        }
    }

    excelDownloadTemplate = (name) => {
        showProgress();
        DownloadFileWithPostData("BulkMappingConfiguration/DownloadTemplate", name + "_Template.xlsx", {}).then(
            function (success) {
                //if (success) {
                // successModal("");
                //} else {
                //   errorModal("");
                //}
                hideProgress();
            }).catch(error => {
                //Loader Hide
                hideProgress();
            });
    }


    confirmationCancel = () => {
        this.setState({ confirmation: false });
    };


    Cancel = () => {

        this.props.history.push({
            pathname: '/trans/BulkMappingConfig'
        }
        );
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);

    }

    Clear = () => {
        this.props.form.resetFields();
        thisObj.setState({
            dataSource: [], validationData: [], selectedRowKeys: [], selectedrows: [], missingData: []
        });

    };

    getExcelData = (datas, checkedData) => {
        if (datas.length > 0) {
            var missedData = [];
            validData.map(x => {
                let missingDataFlag = true;
                (checkedData || []).map(uploaddata => {

                    if (x.toLowerCase() === uploaddata.replace(/ /g, "").toLowerCase()) {
                        missingDataFlag = false;
                        return false;
                    }
                });
                if (missingDataFlag) {
                    missedData.push(x);
                }
            });
            if (missedData.length > 0) {
                thisObj.setState({ dataSource: datas, missingData: missedData });
            }
            else {
                thisObj.validateDatas(datas);
            }

        } else {

            errorModal("You have uploaded an empty template");
        }
    }

    rowSelection = (selectedRowKeys, selectedrows) => {
        this.setState({ selectedRowKeys: selectedRowKeys, selectedrows: selectedrows });
    }

    validateDatas = dataSource => {
        if (dataSource.length === 0) {
            errorModal({ title: "Please select record to create", msg: "" });
        } else {
            const zones = moment.tz.guess();
            const tzone = moment.tz(zones).zoneAbbr();
            var mapConfiguration = dataSource.map(rec => {
                return {
                    ...rec,
                    UpdatedBy: getUserID(),
                    TimeZone: tzone
                };
            });

            showProgress();
            CallServerPost("BulkMappingConfiguration/ImportValidateBulkMappingConfiguration", mapConfiguration).then(
                function (response) {
                    if (response.status === 1) {
                        let data = response.value || [];
                        let row = data.map((r, i) => {
                            r.key = i + 1;
                            return r;
                        })
                        thisObj.setState({ validationData: row });
                    }
                    hideProgress();
                }).catch(error => {
                    //Loader Hide
                    hideProgress();
                });
        }
    }

    GetData = (dataRow) => {

        var temp = {};
        var currentDataRow = {};
        var flag = true;
        Object.keys(dataRow).map(function (value) {
            if (value === "errorMessage") {
                if (dataRow[value] !== null && dataRow[value] !== "") {
                    currentDataRow["className"] = "notValidRecord";
                    currentDataRow["title"] = "Invalid record";
                } else {
                    flag = false;
                }
                temp = currentDataRow;
            }
        });

        if (!flag) {
            temp.className = "validRecord";
            temp.title = "Valid record";
        }
        return temp;
    }


    createImportConfiguration = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length != 0) {
            const zones = moment.tz.guess();
            const tzone = moment.tz(zones).zoneAbbr();
            var validRecord = thisObj.state.selectedrows.filter(user => user.errorMessage === "" || user.errorMessage === null);
            var mapConfiguration = validRecord.map(user => {
                return {
                    ...user,
                    UpdatedBy: getUserID(),
                    TimeZone: tzone
                };
            });
            showProgress();
            CallServerPost("BulkMappingConfiguration/ImportBulkMappingConfigurationCreation", mapConfiguration).then(
                function (response) {
                    const responseData = response;
                    if (responseData.status === 0) {
                        errorModal(response.message);
                    } else {
                        successModalCallback(response.message, thisObj.Cancel);
                    }

                    hideProgress();
                }).catch(error => {
                    //Loader Hide
                    hideProgress();
                });
        } else {
            errorModal("Please select one or more record to proceed further");
        }
    }

    render() {
        const { dataSource, selectedRowKeys, missingData, validationData } = this.state;
        const { getFieldDecorator } = this.props.form;

        const validcolumns = [{ title: 'Source Value', dataIndex: 'sourceValue', key: 'SourceValue', width: 100 },
        { title: 'CodeList Version', dataIndex: 'codeListVersion', key: 'CodeListVersion', width: 100 },
        { title: 'CodeList Name', dataIndex: 'codeListName', key: 'CodeListName', width: 100 },
        { title: 'Target Value', dataIndex: 'targetValue', key: 'TargetValue', width: 100 },
        { title: 'Target Domain', dataIndex: 'targetDomain', key: 'TargetDomain', width: 100 },
        { title: 'Target Variable', dataIndex: 'targetVariable', key: 'TargetVariable', width: 100 },
        { title: 'Project Name', dataIndex: 'projectName', key: 'ProjectName', width: 100 },
        { title: 'Study Name', dataIndex: 'studyName', key: 'StudyName', width: 100 },
        { title: 'ErrorMessage', dataIndex: 'errorMessage', key: 'errorMessage', width: 100 },];


        const rowSelection = {
            preserveSelectedRowKeys: true,
            selectedRowKeys,
            onChange: this.rowSelection,
            getCheckboxProps: (record) => ({
                disabled: record.errorMessage !== "" && record.errorMessage !== null,
                key: record.key
            })
        };

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cubes" />
                        &nbsp;&nbsp;&nbsp;<span>Bulk Mapping Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Import</Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent>
                    <Form >
                        <Row>
                            <Col md={18} sm={SM_SPLIT} xs={SM_SPLIT} style={{ paddingRight: 10 }}>
                                <FormItem>
                                    {getFieldDecorator("ImportBulkMappingConfiguration", {
                                        rules: [{
                                            required: true,
                                            message: "File is mandatory"
                                        }]
                                    })(
                                        <XLSXFileReader
                                            getFieldDecorator={getFieldDecorator}
                                            column={validData}
                                            form={this.props.form}
                                            Clear={this.Clear}
                                            field={{
                                                attributeName: "Import Bulk Mapping Configuration",
                                                inputRequirementText: "Mandatory",
                                                defaultValue: "",
                                                requirementErrorMessage: "File is mandatory"
                                            }}
                                            getExcelData={this.getExcelData}
                                        />)}
                                </FormItem>
                            </Col>
                            <Col md={6} sm={SM_SPLIT} xs={SM_SPLIT}>
                                <Button className="reacTable-addbtn" style={{ margin: "0 5px", float: 'right' }} onClick={() => this.excelDownloadTemplate("Import BulkMapConfig")}>
                                    <i className="fas fa-download" /><span style={{ marginLeft: 10 }}>Download Template</span>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={splitClass} sm={SM_SPLIT} xs={SM_SPLIT} style={{ paddingRight: 10, paddingBottom: 10 }}>
                                {missingData.length > 0 &&
                                    <div id="MissingDataValues">
                                        <p id="validData">{"Required Data : " + validData.toString()}</p>
                                        <p id="missingData">{"Missing Data : " + missingData.toString()}</p>
                                    </div>
                                }

                                {validationData.length > 0 &&
                                    <TableWrapper
                                        pagination={false}
                                        style={{
                                            marginTop: 5, height: validationData.length > 0 ? "100%" : "auto", display: "flex", flexDirection: "column"
                                        }}
                                        bordered
                                        className="ImportTable"
                                        id="transBotTable"
                                        size="small"
                                        columns={validcolumns}
                                        dataSource={validationData}
                                        scroll={{ y: "calc(100vh - 252px)" }}
                                        rowSelection={rowSelection}
                                        onRow={(record) => thisObj.GetData(record)}
                                    />
                                }
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: 10 }}>
                            <div className="steps-action" style={{ float: "left" }}>
                                <Button
                                    type="danger"
                                    name="Cancel"
                                    style={{ marginRight: 10, float: "left" }}
                                    onClick={() => this.Cancel()}
                                    size={"medium"}
                                >Cancel</Button>
                                <Button
                                    name="Clear"
                                    type="default"
                                    style={{ marginRight: 10, float: "left" }}
                                    onClick={() => this.Clear()}
                                    size={"medium"}
                                >Clear</Button>
                            </div>

                            {
                                validationData.length > 0 && validationData.filter(user => user.errorMessage === "" || user.errorMessage === null).length > 0 &&
                                <div className="steps-action" style={{ float: "right" }}>
                                    <Button
                                        style={{ float: "right" }}
                                        name="Save"
                                        className="saveBtn"
                                        onClick={() => this.createImportConfiguration()}
                                        size={"medium"}
                                    >Create </Button>
                                </div>
                            }
                        </Row>

                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}
const WrappedApp = Form.create()(importBulkMappingConfiguration);
export default WrappedApp;
