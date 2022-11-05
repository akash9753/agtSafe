import React, { Component } from 'react';
import moment from 'moment-timezone';
import { Button, Col, Row, Form, Modal, Icon} from 'antd';
import { getRules } from '../Utility/htmlUtility';
import LayoutContent from '../../components/utility/layoutContent';
import TableWrapper from '../../styles/Table/antTable.style';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import {
    PostCallWithZone,
    errorModal,
    successModalCallback,
    getAddButtonText,
    getSaveButtonText,
    showProgress,
    hideProgress,
    getUserID
} from '../Utility/sharedUtility';
import Input from '../../components/uielements/input';
import XLSXFileReader from '../Utility/XLSXFileReader';
import modalStyle from '../../components/card/modal.style';
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const validData = ["CodelistCode","Code", "Extensible", "CodeListName", "CDISCSubmissionValue", "CDISCSynonym", "CDISCDefinition", "PreferredTerm", "ShortName"];

export const splitClass = 24;
export const SM_SPLIT = 24;

const Fields = {
    CodeListVersion: 'CodeListVersion',
    CodeListFilePath:'CodeListFilePath'
};

const codeListVersion= {
    required: true,
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    requirementErrorMessage: "CodeList Version is Mandatory",
    inputTypeErrorMessage: "CodeList Version should contain only alphanumeric values and underscore",
    validationErrorMessage: "CodeList Version should be between 2-20 characters",
    regExText: "/^(?!.* )[a-zA-Z0-9_\ ]+$/",
    minValue: 2,
    maxValue: 20
};

const codeListFile = {
    required: true,
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    requirementErrorMessage: "CodeList File is Mandatory"
};
var thisObj;



class AddCustomCodeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageName: "CustomCodeList",
            loading: true,
            format: ".xlsx",
            showEditConfirmationModal: false,
            CodeListVersion: null,
            CodeListFilePath: null,
            responseData: {
                formData: {},
            },
            nextProp: true,
            modalLoad: false,
            showErrorList: false,
            disableBtn: false,
            dataSource: [],
            validationData: [],
            selectedRowKeys: [],
            selectedrows: [],
            missingData: [],
            fileName: ""
        }

        thisObj = this;
       
    }
  
    componentWillReceiveProps(nextProps) {

        if (thisObj.state.nextProp && nextProps.action != "" && nextProps.action != "Delete") {
            thisObj.setState({
                nextProp: false
            });
        }
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

    handleCustomCodeListCancel = () => {
        thisObj.setState({
            showErrorList: false,
            nextProp: true, responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false, disableBtn: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    showListPage = () => {
        this.handleCustomCodeListCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ title: "Custom Code List", showAddStandardModal: false, cDISCDataStandardID: thisObj.props.stdIDForCreateAndUpdate, showCustomCodeList: true })
    }

   
    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        let { CustomCodeListObj, fileName} = this.state;

            thisObj.props.form.validateFields(["CodeListVersion", "CodeListFilePath"], { force: true }, (err, values) => {
                if (!err)
                {
                    CustomCodeListObj.map(cl =>
                    {
                        //NCI Codelist entry
                        cl.isCustom = 1;
                        cl.CodeListFilePath = fileName;
                        cl.CodeListVersion = values.CodeListVersion;
                        cl.CDISCDataStandardID = thisObj.props.stdIDForCreateAndUpdate;
                        cl.TimeZone = "IST";
                        cl.updatedBy = getUserID();

                        //Custom Code List Entry
                        cl.Extensible = cl.Extensible == "1" ? 1 : 0;

                        cl.Group =  0;
                    });

                    var url = "CustomCodeList/Create";

                    showProgress();
                    PostCallWithZone(url, CustomCodeListObj)
                        .then(
                            function (response)
                            {
                                hideProgress();
                                if (response.status == 1) {
                                    successModalCallback(response.message, thisObj.showListPage);
                                }
                                else
                                {
                                    if (response.value && response.value.length > 0) {
                                        var customCodelistdata = response.value;
                                        customCodelistdata.map(function (CodeList) {
                                            const customCodeList = CodeList;
                                            //extensible
                                            if (customCodeList.extensible) {
                                                customCodeList.extensible = "Yes";
                                            }
                                            else if (!customCodeList.extensible) {
                                                customCodeList.extensible = "No";
                                            }
                                        });
                                        thisObj.setState({ validationData: customCodelistdata });
                                        
                                    }
                                    else
                                    {
                                        errorModal(response.message);
                                    }
                                }
                                
                            }
                        ).catch(error => error);
                }
            });
    }
   
    onCancelIfErrorOccur = () => {
        this.setState({ modalLoad: false, disableBtn: false, loading: false });
    }

    BrowseClear = () => {
        this.props.form.resetFields("CodeListFilePath");
        thisObj.setState({
            fileName:"",dataSource: [], validationData: [], selectedRowKeys: [], selectedrows: [], missingData: []
        });

    };
    Clear = () => {
        this.props.form.resetFields();
        thisObj.setState({
            showErrorList: false,
            dataSource: [], validationData: [], selectedRowKeys: [], selectedrows: [], missingData: []
        });

    };
    getExcelData = (datas, checkedData, fileName ) => {
        if (datas.length > 0) {
            let codelistversion = "";
            thisObj.props.form.validateFields(["CodeListVersion"], { force: true }, (err, values) => {
                if (!err) {
                    codelistversion = values["CodeListVersion"];
                }
            });
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
                let html = [<div>Missing Data:</div>];
                html.push(<p>{missedData.toString()}</p>);
                errorModal(html);
            }
            else
            {
                thisObj.setState({ CustomCodeListObj: datas, fileName: fileName });
            }

        } else {

            errorModal("You have uploaded an empty template");
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

    render() {
        const { props } = this;
        const { getFieldDecorator } = this.props.form;
        const { disableBtn, validationData } = this.state;
        const { action } = this.props;
        const validcolumns = [
            {
                title: 'CodelistCode',
                dataIndex: 'codelistCode',
                key: 'codelistCode',
                width: 125
            },
            {
                title: 'Code',
                dataIndex: 'code',
                key: 'code',
                width: 80
            },
            {
                title: 'Extensible',
                dataIndex: 'extensible',
                key: 'extensible',
                width: 85
            },
            {
                title: 'CodeListName',
                dataIndex: 'codelistName',
                key: 'codelistName',
                width: 110
            },
            {
                title: 'CDISCSubmission Value',
                dataIndex: 'cdiscSubmissionValue',
                key: 'cdiscSubmissionValue',
                width: 130
            },
            {
                title: 'CDISCSynonym',
                dataIndex: 'cdiscSynonym',
                key: 'cdiscSynonym',
                width: 115
            },
            {
                title: 'CDISCDefinition',
                dataIndex: 'cdiscDefinition',
                key: 'cdiscDefinition',
                width: 120
            },
            {
                title: 'PreferredTerm',
                dataIndex: 'preferredTerm',
                key: 'preferredTerm',
                width: 130
            },
            {
                title: 'ShortName',
                dataIndex: 'shortName',
                key: 'shortName',
                width: 88
            },
            {
                title: 'Error Message',
                dataIndex: 'errorMessage',
                key: 'errorMessage'

            },
        ];

        return (
            
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                title={validationData.length == 0 ? "Add Custom CodeList" : "Custom CodeList Error"}
                style={{ top: 25}}
                width={'95%'}
                onCancel={disableBtn ? null : this.handleCustomCodeListCancel}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleCustomCodeListCancel}>
                        Cancel
                    </Button>,
                    (action == "Create" && validationData.length == 0) &&
                    <Button key="Clear" name="Clear" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={this.Clear}>
                        Clear
                    </Button>,
                    this.props.readOnly === false && validationData.length == 0 ?
                        <Button className='ant-btn sc-ifAKCX fcfmNQ saveBtn' name={action === "Create" ? getAddButtonText() : getSaveButtonText()} disabled={disableBtn} onClick={this.handleSubmit}>
                            {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                        </Button> : <div style={{ height: '32px' }}></div>,
                ]}
            >

                 <LayoutContentWrapper>
                       
                    {validationData.length == 0 &&
                        <Row style={{ width: "100%" }}>
                            <Col md={24} sm={SM_SPLIT} xs={SM_SPLIT} style={{ paddingRight: 10 }}>
                                <FormItem label={"CodeList Version"} key={"CodeListVersion"}>
                                    {getFieldDecorator(Fields.CodeListVersion, {
                                        rules: getRules(codeListVersion, props),
                                        initialValue: ''
                                       
                                    })(
                                        <Input
                                            placeholder="CodeList Version"
                                        />,
                                    )}
                                </FormItem>
                            </Col>

                            <Col md={24} sm={SM_SPLIT} xs={SM_SPLIT} style={{ paddingRight: 10 }}>
                                <FormItem label={"CodeList File"} key={"CodeListFile"}>
                               
                                    {getFieldDecorator(Fields.CodeListFilePath, {
                                        rules: getRules(codeListFile, props),
                                        initialValue: ''
                                    })
                                    (
                                        <XLSXFileReader
                                            getFieldDecorator={getFieldDecorator}
                                            column={validData}
                                            form={this.props.form}
                                            Clear={this.BrowseClear}
                                            field={{
                                                attributeName: "Download Template",
                                                requirementErrorMessage: "CodeList File is mandatory"
                                            }}
                                            getExcelData={this.getExcelData}
                                     />)}
                                
                                </FormItem>
                            </Col>

                        </Row>
                    }
                           
                        <Form >
                            <Row>
                                <Col>
                                        
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
                                            onRow={(record) => thisObj.GetData(record)}
                                        />
                                    }
                                </Col>
                            </Row>
                            <Row>
                                {
                                    validationData.length > 0 && validationData.filter(user => user.errorMessage === "" || user.errorMessage === null).length > 0 &&
                                       <div className="steps-action" style={{ float: "right" }} >
                                        <Button
                                            style={{ float: "right" }}
                                            name="Save"
                                            className="saveBtn"
                                            onClick={() => this.handleSubmit()}
                                            size={"medium"}

                                        >Create </Button>
                                    </div>
                            }
                            </Row>
                    </Form>
                      
                 </LayoutContentWrapper>

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddCustomCodeList);
export default WrappedApp;
