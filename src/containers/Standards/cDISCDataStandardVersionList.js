import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import AddVersion from './addVersion.js';
import CDISCDataStdRoleList from './cDISCDataStdRoleList.js';
import CDISCDataStdOrigin from './cDISCDataStdOrigin.js'
import StandardCodelistList from './StandardCodelistList.js';
import ImportCDISCDataStdVariableMetadata from './importCDISCDataStdVariableMetadata.js';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import { intSorter } from '../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var pageRefresh = false;

class StandardVersionList extends Component {

    constructor(props) {
        super(props);

        this.versionList = this.versionList.bind(this);

        this.state = {
            loading:true,
            action: "",
            title:"",
            showAddStdVersion:false,
            showDeleteConfirmationModal:false,
            cDISCDataStdVersionID: 0,
            cDISCDataStandardID: 0,
            showCDISCDataStdRole: false,
            showCDISCDataStdOrigin:false,
            showStandardCodeList: false,
            showStandardVariableImport: false,
            showVersionList:false,
            dataSource,
            modalLoad: false,
        };

        thisObj = this;

        thisObj.getList(thisObj.props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageRefresh){
            thisObj.setState({ loading: true });
            thisObj.getList(nextProps);
        }
       }

    getList = (data) => {
        
        CallServerPost('CDISCDataStdVersion/GetCDISCDataStdVersionByDataStdID', { CDISCDataStandardID: data.currentTreeNodeObject.dataRef.key })
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.versionList(response);
                }
                else {
                    thisObj.setState({ action: "", showStandardCodeList: false, showCDISCDataStdOrigin: false, showCDISCDataStdRole: false, showStandardVariableImport: false, showVersionList: true, dataSource: [], loading: false });
                }
            });
    }

    editStdVersion = (versionid) => {
        this.setState({ title:"Edit Version",showAddStdVersion: true, action: 'Update', cDISCDataStdVersionID: versionid })
    }

   addStdVersion = () => {
       this.setState({ title: "Add Version",showAddStdVersion: true, action: 'Create', cDISCDataStdVersionID: 0 })
    }

   deleteStdVersion = (versionid) => {
       this.setState({ title: "Delete Version", action: 'Delete', showDeleteConfirmationModal: true, cDISCDataStdVersionID: versionid })
   }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
   }
    handleCancelImport = () => {
        this.setState({ showStandardVariableImport: false });
    }

    
    refreshTree = () => {
        thisObj.props.history();
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddStdVersion: false });
    }

    handleAddStdDomainClassCancel = () => {
        this.setState({ action:"",showAddStdVersion: false });
    }

    showCDISCDataStdRoleList = (versionid) => {
        this.setState({ title: "CDISC Data Std Role", showAddStdVersion: false, showVersionList: false, cDISCDataStdVersionID: versionid, showCDISCDataStdRole: true, showStandardCodeList: false })

    }

    showCDISCDataStdOriginList = (versionid) => {
        this.setState({ title: "CDISC Data Std Origin", showAddStdVersion: false, showVersionList: false, cDISCDataStdVersionID: versionid, showCDISCDataStdOrigin: true, showStandardCodeList: false })

    }


    showStandardCodeList = (standardid, versionid) => {
        this.setState({ title: "Standard CodeList", showAddStdVersion: false, showVersionList: false, cDISCDataStandardID: standardid, cDISCDataStdVersionID: versionid, showCDISCDataStdRole: false, showCDISCDataStdOrigin: false , showStandardCodeList: true })

    }

    showStandardVariableImport = (standardid, versionid) => {
        this.setState({ title: "Standard Variable MetaData Import", showAddStdVersion: false, showVersionList: false, cDISCDataStandardID: standardid, cDISCDataStdVersionID: versionid, showCDISCDataStdRole: false, showCDISCDataStdOrigin: false , showStandardCodeList: false, showStandardVariableImport: true, action: "Import" })

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}
       
                thisObj.setState({ modalLoad: true });
                values["CDISCDataStdVersionID"] = thisObj.state.cDISCDataStdVersionID;
                values["ChangeReason"] = ChangeReason;

                PostCallWithZone('CDISCDataStdVersion/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            successModalCallback(response.message, thisObj.refreshTree);
                        } else {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
           
    }

    versionList = (response) => {
        var datas = [];

        const versionList = response.value
        const permissions = thisObj.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);

        // Loop to create table datasource
        for (var i = 0; i < versionList.length; i++) {

            const standardid = versionList[i].cdiscDataStandardID;
            const versionid = versionList[i].cdiscDataStdVersionID;

            const editCell = <div>


                {perLevel >= 2 /*&& versionid > 5*/ ? <ButtonWithToolTip
                    name={versionList[i].stdVersionName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStdVersion(versionid)}
                /> : ""}

                
                {perLevel >= 4 /*&& versionid > 5*/ ? <ButtonWithToolTip
                        name={versionList[i].stdVersionName + "_Delete"}
                        style={{ marginRight: 5 }}
                        tooltip="Delete"
                        shape="circle"
                        classname="fas fa-trash-alt"
                        size="small"
                        onClick={() => thisObj.deleteStdVersion(versionid)}
                /> : ""}

                {perLevel >= 1 ? <ButtonWithToolTip
                        name={versionList[i].stdVersionName + "_CDISC Data Standard Role"}
                        style={{ marginRight: 5 }}
                        tooltip='CDISC Data Standard Role'
                        shape="circle"
                        classname="fas fa-project-diagram"
                        size="small"
                        onClick={() => thisObj.showCDISCDataStdRoleList(versionid)}
                /> : ""}

                {perLevel >= 1 ? <ButtonWithToolTip
                    name={versionList[i].stdVersionName + "_CDISC Data Standard Origin"}
                    style={{ marginRight: 5 }}
                    tooltip='CDISC Data Standard Origin'
                    shape="circle"
                    classname="fas fa-project-diagram"
                    size="small"
                    onClick={() => thisObj.showCDISCDataStdOriginList(versionid)}
                /> : ""}
       
                {perLevel >= 1 ? <ButtonWithToolTip
                        name={versionList[i].stdVersionName + "_Standard CodeList"}
                        style={{ marginRight: 5 }}
                        tooltip='Standard CodeList'
                        shape="circle"
                        classname="fas fa-ellipsis-v"
                        size="small"
                        onClick={() => thisObj.showStandardCodeList(standardid, versionid)}
                /> : ""}

                {perLevel >= 2 ? <ButtonWithToolTip
                        name={versionList[i].stdVersionName + "_Standard Variable Import"}
                        style={{ marginRight: 5 }}
                        tooltip='Standard Variable Import'
                        shape="circle"
                        classname="fas fa-file-import"
                        size="small"
                        onClick={() => thisObj.showStandardVariableImport(standardid, versionid)}
                /> : ""}
                
            </div>;
            datas.push({
                key: versionList[i].cdiscDataStdVersionID,
                stdVersionName: versionList[i].stdVersionName,
                stdVersionDescription: versionList[i].stdVersionDescription,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ action: "", showStandardCodeList: false, showCDISCDataStdRole: false, showCDISCDataStdOrigin: false, showStandardVariableImport: false, showVersionList: true, dataSource: datas, loading: false });
    }
    render() {
        const columns = [
            {
                title: 'Version Name',
                dataIndex: 'stdVersionName',
                key: 'stdVersionName',
                sorter: (a, b) => intSorter(a, b, 'stdVersionName'),
                width:150
            },
            {
                title: 'Version Description',
                dataIndex: 'stdVersionDescription',
                key: 'stdVersionDescription',
                sorter: (a, b) => intSorter(a, b, 'stdVersionDescription'),
                width:150
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width:150
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const { showVersionList, showAddStdVersion, action, cDISCDataStandardID, cDISCDataStdVersionID, showCDISCDataStdRole, showCDISCDataStdOrigin, title, showStandardCodeList, showStandardVariableImport } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                
                <LayoutContent>

                    
                    {(showStandardCodeList) && <StandardCodelistList permissions={permissions} title={title} visible={showStandardCodeList} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStandardID={cDISCDataStandardID} cDISCDataStdVersionID={cDISCDataStdVersionID} action={action} />}
                    {(showCDISCDataStdRole) && <CDISCDataStdRoleList permissions={permissions} title={title} visible={showCDISCDataStdRole} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdVersionID={cDISCDataStdVersionID} action={action} />}
                    {(showCDISCDataStdOrigin) && <CDISCDataStdOrigin permissions={permissions} title={title} visible={showCDISCDataStdOrigin} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdVersionID={cDISCDataStdVersionID} action={action} />}
                    {(showStandardVariableImport) && <ImportCDISCDataStdVariableMetadata title={title} visible={showStandardVariableImport} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdVersionID={cDISCDataStdVersionID} action={action} />}
                    {(showVersionList) && (<Spin indicator={antIcon} spinning={this.state.loading}>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <i className="fas fa-list-ul" />
                                <span> Version</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                List
                                   </Breadcrumb.Item>
                        </Breadcrumb>

                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addStdVersion : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>)
                    }
                                                    
                    {(action == "Update" || action == "Create") && <AddVersion readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddStdVersion} title={this.state.title} stdIDForCreateAndUpdate={this.props.currentTreeNodeObject.dataRef.key} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdVersionID={cDISCDataStdVersionID} action={action} /> }
                    {(action == "Delete") && <ConfirmModal loading={this.state.modalLoad} title="Delete Version" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} />}

                </LayoutContent>
               
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(StandardVersionList);
export default WrappedApp;

