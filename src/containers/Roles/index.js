import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';
import PermissionModal from './permissionModal';
import Select, { SelectOption } from '../../components/uielements/select';
import { stringSorter } from '../Utility/htmlUtility';
//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import CopyRolePermission from "../Roles/copyRolePermissions";

const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, roleID;
var deleteModal, showPermissionModal;

const projectRole = getProjectRole();
class Roles extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addRoles = this.addRoles.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            showPermissionModal: false,
            roleID,
            roleStatusID : 5,
            modalLoad: false,
            showCopyModal: false
        };

        thisObj = this;
        showProgress();
        CallServerPost('Roles/GetAllRoles', {})
            .then(
                function (response) {

                    if (response.value !== null) {
                        var datas = [];
                        const rolesList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ["self"]);
                        for (var i = 0; i < rolesList.length; i++) {
                            const roleid = rolesList[i].roleID;
                            const roleStatusID = rolesList[i].statusID;
                            const editCell = <div>



                                {perLevel >= 1 && rolesList[i].roleID > 9 ? <ButtonWithToolTip
                                    name={rolesList[i].roleName + "_Edit"}
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editRoles(roleid, permissions)}
                                /> : ""}


                                {perLevel >= 4 && rolesList[i].roleID > 9 ? <ButtonWithToolTip
                                    name={rolesList[i].roleName + "_Delete"}
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteRoles(roleid)}
                                /> : ""}

                                {perLevel >= 1 ? <ButtonWithToolTip
                                    name={rolesList[i].roleName + "_Permissions"}
                                    tooltip="Permissions"
                                    shape="circle"
                                    classname="fas fa-user-lock"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.showPermissionModal(roleid,roleStatusID)}
                                /> : ""}


                                {perLevel >= 3 ? <ButtonWithToolTip
                                    name={rolesList[i].roleName + "_Copy"}
                                    tooltip="Copy Permissions"
                                    shape="circle"
                                    classname="fas fa-copy"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.showCopyRolePermissionsModal(roleid)}
                                /> : ""}

                            </div>;
                            datas.push({
                                key: rolesList[i].roleID,
                                roleName: rolesList[i].roleName,
                                status: rolesList[i].statusText,
                                roleDescription: rolesList[i].roleDescription,
                                actions: editCell
                            });
                        }
                        allDataSource = datas;
                        thisObj.setState({ dataSource: datas, loading: false });
                    }
                    hideProgress();
                })
            .catch(error => error);
    }

    editRoles = (roleID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editroles',
            state: {
                RoleID: roleID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );
    }

    addRoles = () => {
        this.props.history.push({
            pathname: '/trans/addroles',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteRoles = (roleID) => {
        this.setState({ showEditModal: true, RoleID: roleID });
    }
    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let postValues = {};
        postValues["RoleID"] = thisObj.state.RoleID;
        CallServerPost('UserAssignment/GetUsersFromUserAssignmentByRoleID', postValues)
            .then(
                function (response) {
                    if (response.status === 1) {
                        thisObj.setState({ modalLoad: false, loading: false, showEditModal: false });
                        errorModal(response.value);
                    } else {
                        thisObj.deleteRole(ChangeReason, thisObj);
                    }
                }).catch(error => error);
    }
    deleteRole = (ChangeReason, thisObj) => {
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["ChangeReason"] = ChangeReason;
        values["RoleID"] = thisObj.state.RoleID;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;
        CallServerPost('Roles/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status === 1) {
                        thisObj.setState({ loading: false, showEditModal: false });
                        successModal(response.message, thisObj.props, "/trans/roles");
                    } else {
                        thisObj.setState({ loading: false, showEditModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showPermissionModal: false, showCopyModal: false });
    }

    showPermissionModal = (roleID, roleStatusID) => {
        this.setState({ showPermissionModal: true, roleID: roleID, roleStatusID: roleStatusID});
    }

    showCopyRolePermissionsModal = (roleID) => {
        CallServerPost('Permission/GetPermissionData', { RoleID: roleID })
            .then(
                function (response) {
                    if (response.value.permissionList.length === 0) {
                        errorModal("No permissions for this role to copy.");
                    } else {
                        thisObj.setState({ showCopyModal: true, roleID: roleID });
                    }
                }).catch(error => error);
    }

    render() {
        const columns = [
            {
                title: 'Role Name',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'roleName'),
            },
            {
                title: 'Role Description',
                dataIndex: 'roleDescription',
                key: 'roleDescription',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'roleDescription'),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'status'),
            },

            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 80
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-user-friends" ></i>
                        <span> Roles</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        //addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addRoles : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    {
                        this.state.showEditModal && <Form>
                            <ConfirmModal loading={this.state.modalLoad} title="Delete Role and Permissions" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                        </Form>
                    }
                    {

                        this.state.showPermissionModal &&
                        (
                            <Form>
                                <PermissionModal permissions={permissions} title="Set Permission" visible={this.state.showPermissionModal} handleCancel={this.handleCancel} roleId={this.state.roleID} roleStatusID={this.state.roleStatusID} />
                            </Form>
                        )
                    }

                    {
                        this.state.showCopyModal && (<CopyRolePermission history={this.props.history} visible={this.state.showCopyModal} roleID={this.state.roleID} handleCancel={this.handleCancel} />)
                    }


                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(Roles);
export default WrappedApp;

