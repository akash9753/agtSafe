import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, PostCallWithZone, successModalCallback, DownloadFileWithPostData, checkPermission } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import AddXsltConfigurationFile from './addXsltConfigurationFile.js';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
const floatCss = {
    float: 'right'
}
var thisObj;

class XsltConfigurationFiles extends Component {

    constructor(props) {
        super(props);
        this.addXsltConfigurationFile = this.addXsltConfigurationFile.bind(this);
        this.state = {
            dataSource: [],
            title: null,
            showAddXsltConfigurationFileModal: false,
            showEditXsltConfigurationFileModal: false,
            showDeleteConfirmationModal: false,
            xsltConfigurationFileID: 0,
            action: "",
            modalLoad: false,
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        CallServerPost('XsltConfigurationFiles/GetAllXsltConfigurationFiles', {})
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    if (response.value != null) {
                        var datas = [];
                        const xsltConfigurationFilesList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < xsltConfigurationFilesList.length; i++) {

                            const xsltConfigurationFileID = xsltConfigurationFilesList[i].xsltConfigurationFileID;
                            const fileCell = <div>
                                {perLevel >= 1 ? <ButtonWithToolTip
                                        tooltip="Download"
                                        shape="circle"
                                        classname="fas fa-file-download"
                                        size="small"
                                        style={margin,floatCss}
                                        onClick={() => thisObj.fnToDownloadXsltConfigFile(xsltConfigurationFileID)}
                                /> : ""}
                                <span>{thisObj.getFileName(xsltConfigurationFilesList[i].xsltFile)}</span>
                            </div>;

                            const editCell = <div>
                                {perLevel >= 1 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editXsltConfigurationFile(xsltConfigurationFileID)}
                                /> : ""}

                                {perLevel >= 4 ? <ButtonWithToolTip
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteXsltConfigurationFile(xsltConfigurationFileID)}
                                /> : ""}
                            
                            </div>;
                            datas.push({
                                key: xsltConfigurationFilesList[i].xsltConfigurationFileID,
                                standardName: xsltConfigurationFilesList[i].standardName,
                                defineVersion: xsltConfigurationFilesList[i].defineVersionText,
                                fileName: fileCell,
                                xsltFileType: xsltConfigurationFilesList[i].xsltFileTypeText,
                                actions: editCell
                            });
                        }
                        thisObj.setState({ dataSource: datas, loading: false });
                    }
                }
                else {
                    thisObj.setState({ dataSource: [], loading: false });
                }
            });    
    }
    fnToDownloadXsltConfigFile = (fileID) => {
        var fileName = "";
        this.state.dataSource.map(function (values, keys) {
            if (values.key === fileID) {
                fileName = values.fileName.props.children[1].props.children;   
            }
        });
        DownloadFileWithPostData('XsltConfigurationFiles/DownloadXsltFiles', fileName, { XsltConfigurationFileID: fileID });
    }
    getFileName = (fileURL) => {
        var getFileURL = fileURL;
        var getFileName = getFileURL.split('\Uploads', 2);
        return getFileName[1].replace(/\\/g, '');
    }
    addXsltConfigurationFile = () => {
        this.setState({ title: "Add XsltConfiguration File", showAddXsltConfigurationFileModal: true, action: 'Create', xsltConfigurationFileID: 0 })

    }
    handleAddXsltConfigurationFileCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddXsltConfigurationFileModal: false });
    }
    handleEditXsltConfigurationFileCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showEditXsltConfigurationFileModal: false });
    }

    editXsltConfigurationFile = (xsltConfigurationFileID) => {
        this.setState({ title: "Edit XsltConfiguration File", showAddXsltConfigurationFileModal: true, action: 'Update', xsltConfigurationFileID: xsltConfigurationFileID })
    }

    deleteXsltConfigurationFile = (xsltConfigurationFileID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', xsltConfigurationFileID: xsltConfigurationFileID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["XsltConfigurationFileID"] = thisObj.state.xsltConfigurationFileID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('XsltConfigurationFiles/Delete', values)
            .then(
            function (response) {
                thisObj.setState({ modalLoad: false });
                if (response.status == 1) {
                    thisObj.setState({ showDeleteConfirmationModal: false });
                    successModalCallback(response.message, thisObj.refreshXsltConfigurationFiles);
                } else {
                    thisObj.setState({ showDeleteConfirmationModal: false });
                    errorModal(response.message);
                }
            }).catch(error => error);

    }
    refreshXsltConfigurationFiles = () => {        
        thisObj.handleCancelDeleteConfirmationModal();       
        thisObj.getList();
        thisObj.setState({ action: "", showAddXsltConfigurationFileModal: false, modalLoad: false });
    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { showAddXsltConfigurationFileModal, showEditXsltConfigurationFileModal, action, xsltConfigurationFileID, title, dataSource } = this.state;
        const permissions = this.props.permissions;
        const columns = [
            {
                title: 'Standard Name',
                dataIndex: 'standardName',
                key: 'standardName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'standardName'),
            },
            {
                title: 'Define Version',
                dataIndex: 'defineVersion',
                key: 'defineVersion',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'defineVersion'),
            },
            {
                title: 'File Name',
                dataIndex: 'fileName',
                key: 'fileName',
                width: 100
                //sorter: (a, b) => stringSorter(a, b, 'fileName'),
            },  
            {
                title: 'Xslt File Type',
                dataIndex: 'xsltFileType',
                key: 'xsltFileType',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'xsltFileType'),
            },        
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];
        
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-file-alt" ></i>
                        <span>Xslt Configuration Files</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all'}}>
                    
                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addXsltConfigurationFile : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {(action == "Update" || action == "Create") && <AddXsltConfigurationFile permissions={permissions} readOnly={checkPermission(permissions, ['self']) <= 1} visible={showAddXsltConfigurationFileModal} title={title} handleCancel={this.handleAddXsltConfigurationFileCancel} xsltConfigurationFileID={xsltConfigurationFileID} action={action} />}                    
                    {(action == "Delete") && <ConfirmModal title="Delete XsltConfigurationFiles" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(XsltConfigurationFiles);
export default WrappedApp;

