import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, showProgress, hideProgress, PostCallWithZone, DownloadFileWithPostData, errorModalCallback, errorModal, successModal, successModalCallback, getProjectRole, getConfirmButtonText } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { fnUploadFiles, fnUploadCancel } from '../Topbar/Upload';
import { clear } from '../Utility/SingleForm';
import { stringSorter } from '../Utility/htmlUtility';
import ReactTable from '../Utility/reactTable';
import Progress from '../Utility/ProgressBar';

var thisObj;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const projectRole = getProjectRole();


class StudyImport extends Component {

    constructor(props) {
        super(props);
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();

        this.state = {
            pageName: "ImportCDISCDataStdVariableMetaData",
            loading: true,
            responseData: {
                formData: {},
            },
            date: date,
            format: ".xls",
            dataSource:[],
            nextProp: true,
            validationReturn: {},
            action: "Import",
            disableBtn: false,
            progress: ""

        }

        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }

    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('Roles/GetRolesFormData', { FormName: "Study", ActionName: "Import", ID: 0 }).then(
                function (response) {
                    thisObj.setState({visible:data.visible, loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({action: "Import", responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (thisObj.state.nextProp && nextProps.action != "" && nextProps.action != "Delete") {
            thisObj.setState({
                nextProp: false
            });
            thisObj.getFormData(nextProps);
        }
    }

    handleCancel = () => {
        
        thisObj.props.handleCancel();
    }


    showValidationList = (response) => {
        const validationReturn = response.value;
        if (validationReturn != null) {
            var datas = [];
            const validationList = validationReturn;
            for (var i = 0; i < validationList.length; i++) {

                datas.push({
                    key: validationList[i].slNo,
                    slNo: validationList[i].slNo,
                    itemID: validationList[i].itemID,
                    severity: validationList[i].severity,
                    category: validationList[i].category,
                    nodeName: validationList[i].nodeName,
                    description: validationList[i].description,
                    error: validationList[i].error,
                    ruleID: validationList[i].ruleID,
                    
                });
            }

            thisObj.setState({ action: response.message +"-DefineXml Data Validation Results",dataSource: datas, loading: false });
        }
    }


    Finish = () => {
        thisObj.props.handleCancel();
    }

    handleSubmit = (e) => {

        //alert('Create button Clicked');

        e.preventDefault();
        const thisObj = this;



        thisObj.props.form.validateFields(["FilePath"], { force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ progress: "active"});

                values["StudyID"] = thisObj.props.studyID;
                values["UpdatedBy"] = projectRole.userProfile.userID;

                fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);
            }
        });

    }

    socket_open = () => {
        thisObj.setState({ progress: "active" })
    }

    handleCreateUpdate = (values) => {

        const thisObj = this;
     
        PostCallWithZone('Study/ImportExcelDataByXSLT', values)
            .then(
           
                function (response) {
                    hideProgress();
                //console.log(response);
                if (response.status == 1) {
                    thisObj.setState({ progress: "success"});
                    if (response.value == null)
                    {
                        successModalCallback("Imported successfully", thisObj.refreshObj);
                    }
                    else
                    {
                        if (response.message == "Warning")
                        {
                            successModalCallback("Imported successfully", thisObj.showValidationList(response));

                        }
                        else
                        {
                            thisObj.showValidationList(response);
                        }                        
                    }
                }
                else
                {
                    thisObj.setState({ progress: "exception" });

                  errorModalCallback(response.message, thisObj.refreshObj);
                }
            }).catch(error => error);
    }

    onCancelIfErrorOccur = () => {
        this.setState({ disableBtn: false, loading: false });
    }

    refreshObj = () => {
        thisObj.props.handleCancel();
    }

    handleExcelDownloadDataValidation = () => {
        var temp = thisObj.state.action;

        var studyName = temp.substring(0, temp.lastIndexOf('_'));
        let title = thisObj.props.title;

        DownloadFileWithPostData('Study/ExportValidationResults', title + "_DataValidationResults_" + thisObj.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, DataValidationFileName: "DataValidationResults.xlsx" });
    }
    render() {
        //const hideInputSearch = {
        //    display: "none"
        //}
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, dataSource, action, title, progress} = this.state;

        const columns = [
            {
                title: 'SlNo',
                dataIndex: 'slNo',
                key: 'slNo',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'slNo'),
            },
            {
                title: 'Node Name',
                dataIndex: 'nodeName',
                key: 'nodeName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'nodeName'),
            },
            {
                title: 'Rule ID',
                dataIndex: 'ruleID',
                key: 'ruleID',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'ruleID'),
            },
            {
                title: 'Item ID',
                dataIndex: 'itemID',
                key: 'itemID',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'itemID'),
            },
            {
                title: 'Error',
                dataIndex: 'error',
                key: 'error',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'error'),
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'description'),
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'category'),
            },
            {
                title: 'Severity',
                dataIndex: 'severity',
                key: 'severity',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'severity'),

            },
      ];

        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    maskClosable={false}
                    title={(action == "Import") ? "Import" : this.props.title}
                    style={{ top: (action == "Import") ? '30vh' : '5vh' }}
                    width={(action != "Import")?"95%":"520px"}
                    onCancel={this.state.disableBtn ? null : this.props.handleCancel}
                   
                    footer={[
                        (action == "Import") && <Button disabled={this.state.disableBtn} key="back" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleCancel}>Cancel</Button>,
                       
                        (action == "Import") && <Button disabled={this.state.disableBtn} key="clear" name="Clear" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                            Clear
                        </Button>,
                        (action == "Import") && <Button disabled={this.state.disableBtn} key="Ok" name="Confirm" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' onClick={this.handleSubmit}>
                            {getConfirmButtonText()}
                       </Button>,
                        (action != "Import") && <Button key="submit" name="Finish" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' onClick={this.Finish}>
                            Finish
                       </Button>,
                    ]}
                >
                    <div id="withHeaderScroll">
                        
                        {

                            (action == "Import") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm props={this} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) :
                                (
                                        <ReactTable
                                        showingErrors={dataSource.length}
                                        columns={columns}
                                        dataSource={dataSource}
                                        pagination={true}
                                        //inputSearchVisible={hideInputSearch}
                                        exportAction={dataSource.length == 0 ? null : this.handleExcelDownloadDataValidation}
                                        scroll={{ x: "100%", y:"calc(100vh - 300px)"}} />  

                                )
                        }
                          
                       
                    </div>
                  
                </Modal>
                {<Progress progress={progress} NoInitialPercent={false} />}
            </div>
         
        );
    }
}

const WrappedApp = Form.create()(StudyImport);
export default WrappedApp;
