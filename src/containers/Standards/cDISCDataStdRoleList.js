import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddCDISCDataStdRole from './addCDISCDataStdRole.js';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import { stringSorter, intSorter } from '../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class CDISCDataStdRoleList extends Component {

    constructor(props) {
        super(props);

        this.addCDISCDataStdRole = this.addCDISCDataStdRole.bind(this);

        this.state = {
            loading: true,
            title: null,
            
            showDeleteConfirmationModal: false,
            action: "",
            cdiscDataStdVersionID: 0,
            showCDISCDataStdRoleList: false,
            showAddCDISCDataStdRoleModal: false,
            cDISCDataStdRoleID: 0,
            modalLoad:false,
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
        CallServerPost('CDISCDataStdRole/GetAllCDISCDataStdRole', { CDISCDataStdVersionID: data.cDISCDataStdVersionID })
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    thisObj.cDISCDataStdRoleList(response);
                }
                else {
                    thisObj.setState({ dataSource: [], loading: false });
                }

            });
    }

    addCDISCDataStdRole = () => {
        this.setState({ title: "Add Data Standard Role", showAddCDISCDataStdRoleModal: true, action: 'Create', cDISCDataStdRoleID: 0 })

    }

    editCDISCDataStdRole = (cDISCDataStdRoleID) => {
        this.setState({ title: "Edit Data Standard Role", showAddCDISCDataStdRoleModal: true, action: 'Update', cDISCDataStdRoleID: cDISCDataStdRoleID })

    }

    handleAddCDISCDataStdRoleCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddCDISCDataStdRoleModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteCDISCDataStdRole = (cDISCDataStdRoleID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', cDISCDataStdRoleID: cDISCDataStdRoleID });
    }

    refreshCDISCDataStdRole = () => {
        thisObj.setState({ action: "", showAddCDISCDataStdRoleModal: false });
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.setState({ modalLoading: false });
        thisObj.setState({ action: "" });
        thisObj.getList(thisObj.props);
    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}

      
                thisObj.setState({ modalLoad: true });
                values["CDISCDataStdRoleID"] = thisObj.state.cDISCDataStdRoleID;
                values["ChangeReason"] = ChangeReason;

                PostCallWithZone('CDISCDataStdRole/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            successModalCallback(response.message, thisObj.refreshCDISCDataStdRole);
                        } else {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            
    }

    thisObj = this;
    cDISCDataStdRoleList = (response) => {
        var datas = [];
        const cDISCDataStdRoleList = response.value
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);
        //console.log(cDISCDataStdRoleList);

        // Loop to create table datasource
        for (var i = 0; i < cDISCDataStdRoleList.length; i++) {

            const cDISCDataStdRoleID = cDISCDataStdRoleList[i].cdiscDataStdRoleID;

            const editCell = <div>

                {perLevel >= 2 /*&& cDISCDataStdRoleID > 10041*/ ? <ButtonWithToolTip
                    name={cDISCDataStdRoleList[i].dataStdRoleName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editCDISCDataStdRole(cDISCDataStdRoleID)}
                /> : ""}

                {perLevel >= 4 /*&& cDISCDataStdRoleID > 10041*/ ? <ButtonWithToolTip
                    name={cDISCDataStdRoleList[i].dataStdRoleName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip='Delete'
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteCDISCDataStdRole(cDISCDataStdRoleID)}
                /> : ""}

            </div>;
            //console.log(datas);
            datas.push({
                key: cDISCDataStdRoleList[i].cdiscDataStdRoleID,
                dataStdRoleName: cDISCDataStdRoleList[i].dataStdRoleName,
                cdiscDataStdVersionID: cDISCDataStdRoleList[i].cdiscDataStdVersionID,
                cdiscDataStdVersionText: cDISCDataStdRoleList[i].cdiscDataStdVersionText,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }
    render() {

        const permissions = this.props.permissions;

        const columns = [
            {
                title: 'Data Standard Role Name',
                dataIndex: 'dataStdRoleName',
                key: 'dataStdRoleName',
                sorter: (a, b) => stringSorter(a, b, 'dataStdRoleName'),
                width: 100
            },
            {
                title: 'Data Standard Version',
                dataIndex: 'cdiscDataStdVersionText',
                key: 'cdiscDataStdVersionText',
                sorter: (a, b) => intSorter(a, b, 'cdiscDataStdVersionText'),
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
        const { showAddCDISCDataStdRoleModal, action, cDISCDataStdVersionID, title, showCDISCDataStdRoleList, cDISCDataStdRoleID } = this.state;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span>CDISC Data Standard Role</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>

                    <Spin indicator={antIcon} spinning={this.state.loading}>

                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addCDISCDataStdRole : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>
                    {(action == "Update" || action == "Create") && <AddCDISCDataStdRole readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddCDISCDataStdRoleModal} title={this.state.title} stdVersionIDForCreateAndUpdate={thisObj.props.cDISCDataStdVersionID} handleCancel={this.handleAddCDISCDataStdRoleCancel} history={this.refreshCDISCDataStdRole} cDISCDataStdRoleID={cDISCDataStdRoleID} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Data Standard Role" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(CDISCDataStdRoleList);
export default WrappedApp;

