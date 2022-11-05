import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, getProjectRole, DownloadFileWithPostData } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import ErrorList from './modalTable';
import Input from '../../components/uielements/input';
import { fnUploadFiles, fnUploadCancel } from '../Topbar/Upload';
import Progress from '../Utility/ProgressBar';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;
const projectRole = getProjectRole();

const errorListCol = [
    {
        title: 'RuleCode',
        dataIndex: 'ruleCode',
        key: 'ruleCode',
        width: 100
    },
    {
        title: 'Rule Description',
        dataIndex: 'ruleDescription',
        key: 'ruleDescription',
        width: 200
    },
    {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        width: 200

    },
    {
        title: 'RowID',
        dataIndex: 'rowID',
        key: 'rowID',
        width: 200

    },
    {
        title: 'Error Message',
        dataIndex: 'errorMessage',
        key: 'errorMessage'

    },
];

class ImportCDISCDataStdVariableMetadata extends Component {

    constructor(props) {
        super(props);       

        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();
        this.state = {
            pageName:"ImportCDISCDataStdVariableMetaData",
            loading: true,
            date: date,
            showEditConfirmationModal: false,
            ExcelFilePath: null,
            responseData: {
                formData: {},
            },            
            row: [],            
            col: errorListCol,
            showErrorList: false,
            allValues: {},
            modalLoad: false,
            progress: false

        }

        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }

    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('CDISCDataStdVariableMetadata/GetCDISCDataStdVariableMetadataFormData', { FormName: "CDISCDataStdVariableMetadata", ActionName: data.action, ID: 0 }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }
          

    handleCDISCDataStdVariableMetadataCancel = () => {
        thisObj.setState({ showErrorList: false });
        thisObj.props.history();        
    }


    showListPage = () => {
        thisObj.handleCDISCDataStdVariableMetadataCancel();
    }

    handleClear = () => {
        thisObj.setState({ showErrorList: false });
    }

    ErrorModalCancel = () => {
        thisObj.props.form.resetFields();
        thisObj.setState({ showErrorList: false });
    }

    ErrorModalSubmit = () => {
        thisObj.props.form.resetFields();
        thisObj.setState({ showErrorList: false });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;       
        
        thisObj.props.form.validateFields(["ExcelFilePath"], { force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ loading: true });                 
                    values["CDISCDataStdVersionID"] = thisObj.props.cDISCDataStdVersionID;
                    values["UpdatedBy"] = projectRole.userProfile.userID;
                    
                fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);                    
                }
            });
        
    }

    handleCreateUpdate = (values) => {

        const thisObj = this;   
        if (thisObj.props.form.getFieldValue(["ExcelFilePath"]).celFilePath !== null) {
            thisObj.socket_open();
            PostCallWithZone('CDISCDataStdVariableMetadata/Import', values)
                .then(
                function (response) {
                    thisObj.setState({ loading: false, modalLoad: false });
                    if (response.status == 1) {
                        //alert('Success');
                        thisObj.setState({ progress: "exception" });
                        successModalCallback(response.message, thisObj.showListPage);
                    }
                    else {
                        if (response.message !== null) {
                            thisObj.props.form.resetFields();
                            thisObj.setState({ progress: "success" });
                            errorModal(response.message);
                        } else {
                            thisObj.setState({ progress: "exception" });
                        }
                        thisObj.formErrorList(response.value);
                    }
                    }).catch(error => {
                        thisObj.setState({ progress: "exception" });
                    });
        } else {
            errorModal("Please choose standard variable meta data File");
        }
        
    }

    socket_open = () => {
        thisObj.setState({ progress: "active" })
    }

    onCancelIfErrorOccur = () => {
        this.setState({ modalLoad: false, loading: false });
    }

    formErrorList = (data) => {


        let row = []
        data.forEach(function(key, index) {
            row.push({ ruleCode: key.ruleCode, ruleDescription: key.ruleDescription, severity: key.severity, rowID: key.rowID, errorMessage: key.errorMessage })
        })
        thisObj.setState({ showErrorList: true, row: row, });

        //console.log(row)
    }
    handleUpdate = (e) => {

        alert('Update button Clicked');
                
    }

    handleExcelDownloadValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', "Import_CDISCDataStdVariableMetadata_" + this.state.date + ".xlsx", { StudyName: "Import_CDISCDataStdVariableMetadata", DirectoryName: "Import_CDISCDataStdVariableMetadata", SchemaValidationFileName: "Import_CDISCDataStdVariableMetadata.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }


    handleExcelTemplateDownload = () => {

        DownloadFileWithPostData('CDISCDataStandard/DownloadTemplate', "Import_Template.xlsx", { }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, showErrorList, row, col, progress } = this.state;
        const { action } = this.props;


        return (
            
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span> Standard Variable</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Import
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ width: "100%" }}>
                    <Button className ="reacTable-addbtn" style={{ float: "right", marginRight:20 }} onClick={this.handleExcelTemplateDownload}>
                        Download Template
                    </Button>
                    </div>
                

                <LayoutContent>

                    <Spin indicator={antIcon} spinning={loading}>
                        {

                            (action != "") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm isCreate={true} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={thisObj.handleCDISCDataStdVariableMetadataCancel} handleSubmit={thisObj.handleSubmit} handleClear={thisObj.handleClear} />) : <div></div>

                        }

                    </Spin>

                    {<Progress progress={progress} />}

                    
                    <ConfirmModal title="Update Standard Variable Import" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />
                    <ErrorList exportAction={this.handleExcelDownloadValidation} handleCancel={this.ErrorModalCancel} handleSubmit={this.ErrorModalSubmit} visible={showErrorList} row={row} column={col} />
                </LayoutContent>

            </LayoutContentWrapper>

        );
    }
}

const WrappedApp = Form.create()(ImportCDISCDataStdVariableMetadata);
export default WrappedApp;
