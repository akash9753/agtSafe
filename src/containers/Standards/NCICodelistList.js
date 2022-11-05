import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddNCICodeList from './addNCICodeList.js';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import { stringSorter } from '../Utility/htmlUtility';
import ViewsList from './ViewsList.js';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class NCICodelistList extends Component {

    constructor(props) {
        super(props);

        this.addNCICodeList = this.addNCICodeList.bind(this);

        this.state = {
            loading: true,
            title: null,
            showAddStandardModal: false,
            showDeleteConfirmationModal: false,
            action: "",
            cdiscDataStandardID: 0,
            showNCICodeList: false,
            showAddNCICodeListModal: false,
            nCICodeListID: 0,
            modalLoad: false,
            viewList:false,
        };

        
        thisObj = this;
        thisObj.getList(thisObj.props);
        

    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
            thisObj.setState({ loading: true });
            thisObj.getList(nextProps);
        
    }

    getList = (data) => {
        CallServerPost('NCICodeList/GetAllNCICodeList', { CDISCDataStandardID: data.cdiscDataStandardID})
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    thisObj.nCICodeList(response);
                }
                else {
                    thisObj.setState({ dataSource: [], loading: false, action: "" });
                }

            });
    }

    addNCICodeList = () => {
        this.setState({ title: "Add NCI Codelist", showAddNCICodeListModal: true, action: 'Create', nCICodeListID: 0 })

    }

    editNCICodeList = (nCICodeListID) => {
        this.setState({ title: "Edit NCI Codelist", showAddNCICodeListModal: true, action: 'Update', nCICodeListID: nCICodeListID })

    }

    handleAddNCICodeListCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddNCICodeListModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteNCICodeList = (nCICodeListID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', nCICodeListID: nCICodeListID });
    }

    views = (nCICodeListID) => {
        this.setState({ title: "Views List", viewList: true, nCICodeListID: nCICodeListID });

    }
    cancelView = () => {
        this.setState({ viewList: false });
    }

    refreshNCICodeList = () => {
        thisObj.setState({ action: "", showAddNCICodeListModal: false });
        thisObj.handleCancelDeleteConfirmationModal();        
        thisObj.setState({ modalLoading: false });
        thisObj.setState({ action: "" });
        thisObj.getList(thisObj.props);
    }
    

    handleDelete = (ChangeReason) => {

        const thisObj = this;
        let values = {};
                thisObj.setState({ modalLoad: true });
                values["NCICodeListID"] = thisObj.state.nCICodeListID;
                values["ChangeReason"] = ChangeReason;

                PostCallWithZone('NCICodeList/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            successModalCallback(response.message, thisObj.refreshNCICodeList);
                        } else {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
           
    }

    thisObj = this;
    nCICodeList = (response) => {
        //console.log(thisObj)
        var datas = [];
        const nCICodeList = response.value
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);

        // Loop to create table datasource
        for (var i = 0; i < nCICodeList.length; i++) {

            const nCICodeListID = nCICodeList[i].nciCodeListID;

            const editCell = <div>

                {perLevel >= 2 /*&& nCICodeListID > 91*/ ? <ButtonWithToolTip
                        name={nCICodeList[i].codeListVersion + "_Delete"}
                        style={{ marginRight: 5 }}
                        tooltip='Delete'
                        shape="circle"
                        classname="fas fa-trash-alt"
                        size="small"
                        onClick={() => thisObj.deleteNCICodeList(nCICodeListID)}
                /> : ""}
                <ButtonWithToolTip
                    tooltip="View"
                    shape="circle"
                    size="small"
                    classname="fas fa-clipboard-list"
                    onClick={() => thisObj.views(nCICodeListID)}

                />

            </div>;
            //console.log(datas);
            datas.push({
                key: nCICodeList[i].nciCodeListID,
                codeListVersion: nCICodeList[i].codeListVersion,
                codeListFilePath: nCICodeList[i].codeListFilePath,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }
    render() {

        const columns = [
            {
                title: 'CodeList Version',
                dataIndex: 'codeListVersion',
                key: 'codeListVersion',
                sorter: (a, b) => stringSorter(a, b, 'codeListVersion'),
                width: 100
            },
            {
                title: 'CodeList File',
                dataIndex: 'codeListFilePath',
                key: 'codeListFilePath',
                sorter: (a, b) => stringSorter(a, b, 'codeListFilePath'),
                width: 100
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const { showAddNCICodeListModal, action, cdiscDataStandardID, title, showNCICodeList, nCICodeListID, viewList } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                <LayoutContent>
                    {
                        (!viewList) ?
                            <Spin indicator={antIcon} spinning={this.state.loading}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span> NCI CodeList</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

               

                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addNCICodeList : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin> :
                            <ViewsList title={title} visible={viewList} cancelView={this.cancelView} permissions={permissions} history={this.refreshNCICodeList} nCICodeListID={nCICodeListID} action={action} />
                    }
                    {(action == "Update" || action == "Create") && <AddNCICodeList readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddNCICodeListModal} title={this.state.title} stdIDForCreateAndUpdate={thisObj.props.cdiscDataStandardID} handleCancel={this.handleAddNCICodeListCancel} history={this.refreshNCICodeList} nCICodeListID={nCICodeListID} action={action} />}
                    {(action == "Delete" ) && <ConfirmModal title="Delete NCI Codelist" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad}/>}
                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(NCICodelistList);
export default WrappedApp;

