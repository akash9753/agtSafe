import { Breadcrumb, Button, Col, Form, Row } from "antd";
import moment from 'moment-timezone';
import React, { Component } from "react";
import LayoutContent from "../../components/utility/layoutContent";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import TableWrapper from '../../styles/Table/antTable.style';
import { CallServerPost, DownloadFileWithPostData, errorModal, successModalCallback, getUserID, hideProgress, PostCallWithZone, showProgress, successModal } from '../Utility/sharedUtility';
import XLSXFileReader from '../Utility/XLSXFileReader';
import Progress from '../Utility/ProgressBar';

export const splitClass = 24;
export const SM_SPLIT = 24;
export const PADDING_RIGHT_10 = { paddingRight: "10px" };
const FormItem = Form.Item;
var thisObj = [];
const validData = ["SourceUnit", "CodeListVersion", "CodeListName", "TargetUnit", "ConversionFactor", "SourceTestName", "TestCode", "Category", "Specimen", "ProjectName", "StudyName"];

class importConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            validationData: [],
            selectedRowKeys: [],
            selectedrows: [],
            missingData: [],
            progress: false

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
        DownloadFileWithPostData("UnitConfiguration/DownloadTemplate", name + "_Template.xlsx", {}).then(
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
            pathname: '/trans/UnitConfiguration'
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

    //Checkbox  table selection
    rowSelection = (selectedRowKeys, selectedrows) => {
        this.setState({ selectedRowKeys: selectedRowKeys, selectedrows: selectedrows });
    }

    //Validation
    validateDatas = dataSource => {
        if (dataSource.length === 0) {
            errorModal({ title: "Please select record to create", msg: "" });
        } else {
            const zones = moment.tz.guess();
            const tzone = moment.tz(zones).zoneAbbr();
            var unitConfiguration = dataSource.map(unitConfiguration => {
                return {
                    ...unitConfiguration,
                    UpdatedBy: getUserID(),
                    TimeZone: tzone
                };
            });
            unitConfiguration = unitConfiguration.map(function (x) {
                //Decided to change only Display Name,Attribute name is remains same

                x.TestName = x.SourceTestName;
                x.ConversionFactor = parseFloat(x.ConversionFactor);
                return x;
            });
            thisObj.socket_open();
            CallServerPost("UnitConfiguration/ImportValidateUnitConfiguration", unitConfiguration).then(
                function (response) {
                    if (response.status === 1) {
                        let data = response.value || [];
                        let row = data.map((r, i) => {
                            r.key = i + 1;
                            return r;
                        })
                        thisObj.setState({ progress: "exception", validationData: row });
                    }
                    hideProgress();
                }).catch(error => {
                    //Loader Hide
                    hideProgress();
                });
        }
    }
    socket_open = () => {
        thisObj.setState({ progress: "active" })
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

    //Create
    createImportConfiguration = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length != 0) {
            const zones = moment.tz.guess();
            const tzone = moment.tz(zones).zoneAbbr();
            var validRecord = thisObj.state.selectedrows.filter(unitConfiguration => unitConfiguration.errorMessage === "" || unitConfiguration.errorMessage === null);
            var unitConfiguration = validRecord.map(unitConfiguration => {
                return {
                    ...unitConfiguration,
                    UpdatedBy: getUserID(),
                    TimeZone: tzone
                };
            });
            thisObj.socket_open();

            CallServerPost("UnitConfiguration/ImportUnitConfigCreation", unitConfiguration).then(
                function (response) {
                    const responseData = response;
                    thisObj.setState({ progress: "exception" });

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
        const { selectedRowKeys, missingData, validationData, progress } = this.state;
        const { getFieldDecorator } = this.props.form;

        //Column
        const column = [{ title: 'Source Unit', dataIndex: 'sourceUnit', key: 'SourceUnit', width: 100 },
        { title: 'CodeList Version', dataIndex: 'codeListVersion', key: 'CodeListVersion', width: 100 },
        { title: 'CodeList Name', dataIndex: 'codeListName', key: 'CodeListName', width: 100 },
        { title: 'Target Unit', dataIndex: 'targetUnit', key: 'TargetUnit', width: 100 },
        { title: 'Conversion Factor', dataIndex: 'conversionFactor', key: 'ConversionFactor', width: 100 },
        { title: 'Source Test Name', dataIndex: 'testName', key: 'TestName', width: 100 },
        { title: 'Test Code', dataIndex: 'testCode', key: 'Test Code', width: 100 },
        { title: 'Category', dataIndex: 'category', key: 'Category', width: 100 },
        { title: 'Specimen', dataIndex: 'specimen', key: 'Specimen', width: 100 },
        { title: 'Project Name', dataIndex: 'projectName', key: 'ProjectName', width: 100 },
        { title: 'Study Name', dataIndex: 'studyName', key: 'StudyName', width: 100 },
        { title: 'ErrorMessage', dataIndex: 'errorMessage', key: 'errorMessage', width: 105 }
        ];


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
                        <i className="fas fa-wrench" />
                        &nbsp;&nbsp;&nbsp;<span>Unit Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Import</Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent>
                    <Form >
                        <Row>
                            <Col md={18} sm={SM_SPLIT} xs={SM_SPLIT} style={{ paddingRight: 10 }}>
                                <FormItem>
                                    {getFieldDecorator("ImportConfiguration", {
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
                                                attributeName: "Import Unit Configuration",
                                                inputRequirementText: "Mandatory",
                                                defaultValue: "",
                                                requirementErrorMessage: "File is mandatory"
                                            }}
                                            getExcelData={this.getExcelData}
                                        />)}
                                </FormItem>
                            </Col>
                            <Col md={6} sm={SM_SPLIT} xs={SM_SPLIT}>
                                <Button className="reacTable-addbtn" style={{ margin: "0 5px", float: 'right' }} onClick={() => this.excelDownloadTemplate("Import UnitConfig")}>
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
                                            marginTop: 5, height: validationData ? "100%" : "auto", display: "flex", flexDirection: "column"
                                        }}
                                        bordered
                                        className="ImportTable"
                                        id="transBotTable"
                                        size="small"
                                        columns={column}
                                        dataSource={validationData}
                                        scroll={{ y: "calc(100vh - 252px)", x: column.length * 100 }}
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
                            </div>
                            <div className="steps-action" style={{ marginRight: 10, float: "left" }}>
                                <Button
                                    name="Clear"
                                    type="default"
                                    onClick={() => this.Clear()}
                                    size={"medium"}
                                >Clear</Button>
                            </div>
                            {
                                validationData.length > 0 && validationData.filter(unitConfiguration => unitConfiguration.errorMessage === "" || unitConfiguration.errorMessage === null).length > 0 &&
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
                    {<Progress progress={progress} />}

                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}
const WrappedApp = Form.create()(importConfiguration);
export default WrappedApp;
