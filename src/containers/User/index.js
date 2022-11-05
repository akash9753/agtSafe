import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, DownloadFileWithPostData, successModal, PostCallWithZone, showProgress, hideProgress, checkPermission, UserAssignedPop } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Row, Col, Menu, Form, span, Badge, Tooltip, Pagination, Select } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { HotTable, HotColumn } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Progress from '../Utility/ProgressBar';

//SwitchToolTip Importing
import SwitchToolTip from '../Tooltip/SwitchToolTip';
import { InputSearch } from '../../components/uielements/input';
import Edit from "./editUser";
import { is } from 'immutable';
import { ActionColumn } from "../User/ActionColumn";

const FormItem = Form.Item;
const dataSource = [];
const datas = [];
const { Option } = Select;

const margin = {
    margin: '0 5px 0 0'
};
var thisObj, userID;

var getAdminType = JSON.parse(sessionStorage.getItem("userProfile")).adminType;
function ActionCell(props) {
    return props.value;
}

class User extends Component {

    constructor(props) {
        super(props);
        //Binding functions with 'this' object
        this.handleCancel = this.handleCancel.bind(this);
        this.showUserStatusModal = this.showUserStatusModal.bind(this);
        this.addUser = this.addUser.bind(this);


        //Setting initial state values
        this.state = {
            dataSource,
            datas,
            settings: {
                licenseKey: 'non-commercial-and-evaluation',
                width: "100%",
                height: "calc(100vh - 227px)",
                stretchH: 'all',
                hiddenColumns: {
                    columns: [2],
                    indicators: true
                },
                dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                filters: true,
                progress: false,
                editor: false,
                readOnly: true,
                afterFilter: this.afterFilter,
                afterSelectionEnd: function () {
                    this.deselectCell();
                },
                //   multiColumnSorting: {
                //    initialConfig: [{
                //        column: 0,
                //        sortOrder: 'asc',
                //    }, {
                //            column: 1,
                //            sortOrder: 'asc',
                //        },
                //        {
                //            column: 2,
                //            sortOrder: 'asc',
                //        }
                //    ],
                //},



            },

            showDeleteModal: false,
            search: false,
            showResetModal: false,
            showUserStatusModal: false,
            userStatusID: -1,
            statusSwitch: "",
            userID,
            userName : "",
            modalLoad: false,
            actionName: "",
            switchUser: "Active",
            visible: false,
            updatedDateTimeText: '',
            noOfRows: 0,

        };

        thisObj = this;
        thisObj.getUsersList();

        this.hotTableComponent = React.createRef();

    }

    componentDidMount() {
        this.getUsersList(true);
        const hotObj = this.hotTableComponent.current.instance;
    }

    treeWholeRefresh = () => {
        window.location.reload(false);
        thisObj.setState({ display: "flex" });
        thisObj.getUsersList(true);
    }

    afterFilter = (values) => {
        const inst = this.hotTableComponent.current;

        const currData = inst.hotInstance.getData();
        const newSize = currData.length;
        this.setState({ noOfRows: newSize });
        //console.log(values);
    }


    getUsersList = () => {
        const permissions = thisObj.props.permissions;
        //Getting all users from server
        CallServerPost('Users/GetAllUsers', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];

                        const usersList = response.value;
                        const perLevel = checkPermission(permissions, ["self"]);
                        //Loop to create table datasource
                        const { editUser } = thisObj;

                        for (var i = 0; i < usersList.length; i++) {
                            if (!thisObj.state.switchUser) {
                                const userid = usersList[i].userID;
                                const userName = usersList[i].userName;
                                const userstatusid = usersList[i].userStatusID;
                                const updatedDateTimeText = usersList[i].updatedDateTimeText;

                                const editCell = <div>


                                    {perLevel >= 1 ? <ButtonWithToolTip
                                        name={usersList[i].userName + "_Edit"}
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        style={margin}
                                        action={() => thisObj.editUser(userid, permissions)}

                                    /> : null}

                                    {checkPermission(permissions, ["ResetPassword"]) >= 2 ? <ButtonWithToolTip
                                        name={usersList[i].userName + "_ResetPassword"}
                                        tooltip="Reset Password"
                                        shape="circle"
                                        size="small"
                                        style={margin}
                                        classname="fas fa-unlock-alt"
                                        action={() => thisObj.confirmReset(userid, userName)}
                                    /> : null}

                                    {perLevel >= 2 ? <SwitchToolTip name={usersList[i].userName + "_Switch"} style={margin} switchtooltip={usersList[i].userStatusID == 2 ? "Active" : "Inactive"} size="small"
                                        onChange={(e) => { thisObj.showUserStatusModal(userid, userstatusid, updatedDateTimeText) }}
                                        userID={userid} thisObj={thisObj} checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="cross" />}
                                        checked={usersList[i].userStatusID == 2 ? true : false}
                                        action={(e) => { thisObj.showUserStatusModal(userid, userstatusid, updatedDateTimeText) }}

                                    /> : null}

                                    {getAdminType <= 127 ? <Tooltip title={usersList[i].loginActivity == "1" ? 'Logged In' : false}><Button
                                        style={margin}
                                        onClick={() => thisObj.fnForceUserTologout(userid)}
                                        shape="circle"
                                        size="small"
                                        disabled={usersList[i].loginActivity == "1" ? false : true}>

                                        <Badge status={usersList[i].loginActivity == "1" ? 'success' : 'error'}>
                                            <Icon type="user" />
                                        </Badge>
                                    </Button></Tooltip> : null}

                                </div>;
                                datas.push([usersList[i].userName,
                                usersList[i].displayName,
                                usersList[i].emailAddress,
                                JSON.stringify(
                                    {
                                        permissions: permissions,
                                        perLevel: perLevel,
                                        usersList: usersList[i],
                                        user: this
                                    })]);

                            } else if (thisObj.state.switchUser === usersList[i].userStatusText) {

                                datas.push([usersList[i].userName,
                                usersList[i].displayName,
                                usersList[i].emailAddress,
                                JSON.stringify(
                                    {
                                        permissions: permissions,
                                        perLevel: perLevel,
                                        usersList: usersList[i],
                                    }
                                )])

                            }
                        }

                        //Setting values to state for re-rendering
                        thisObj.setState({ actionName: "Index", dataSource: datas, datas: datas, noOfRows: datas.length, loading: false });
                    }

                });
    }


    //Function to force user to logout
    fnForceUserTologout = (id) => {
        const thisObj = this;
        var values = {};
        values["UserID"] = id;
        CallServerPost('Login/Logout', values)
            .then(
                function (response) {

                    if (response.status === 1) {
                        successModal(response.message, thisObj.props, "/trans/users");
                    } else {
                        errorModal(response.message);
                    }
                });
    }



    //To call edit user page
    editUser = (userID, permissions) => {
        let { switchUser } = this.state;
        this.setState({
            actionName: "Edit",
            userID: userID,
            loading: true,
            readOnly: checkPermission(permissions, ["self"]) <= 1,
            switchUser: switchUser
        });
    }
    //To call add user page
    addUser = () => {
        this.props.history.push({
            pathname: '/trans/adduser',
            state: {
                loading: true,
            }
        }
        );
    }
    //To delete user 
    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        values["UserID"] = thisObj.state.userID;
        values["ChangeReason"] = ChangeReason;

        thisObj.setState({ modalLoad: true });
        //Server Call to delete user by userID
        PostCallWithZone('Users/Delete', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ actionName: "Index", modalLoad: false });

                        successModal(response.message, thisObj.props, "/trans/users");

                    } else {
                        thisObj.setState({ modalLoad: false });

                        thisObj.state.statusSwitch.defaultChecked = !thisObj.state.statusSwitch.defaultChecked;
                        errorModal(response.message);
                    }
                });

    }

    //To reset password user 
    handleResetPassword = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        values["UserID"] = thisObj.state.userID;
        values["UserName"] = thisObj.state.userName;
        values["ChangeReason"] = ChangeReason;
        thisObj.setState({ modalLoad: true });
        //Server Call to delete user by userID
        PostCallWithZone('Users/ResetPassword', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ actionName: "Index", modalLoad: false, showResetModal: false });

                        successModal(response.message, thisObj.props, "/trans/users");
                    } else {
                        thisObj.setState({ modalLoad: false, showResetModal: false });

                        errorModal(response.message);
                    }
                });

    }

    UpdateAnyway = (changeReason) => {

        thisObj.handleUserStatus(changeReason, true);

    }


    //To reset password user 
    handleUserStatus = (ChangeReason, isOverride) => {
        const thisObj = this;
        let values = {};
        values["UserID"] = thisObj.state.userID;
        values["ChangeReason"] = ChangeReason;
        values["UserStatusID"] = thisObj.state.userStatusID;
        values["UpdatedDateTimeText"] = thisObj.state.updatedDateTimeText;
        values["isOverride"] = isOverride !== undefined ? isOverride : false;

        thisObj.setState({ modalLoad: true });
        PostCallWithZone('Users/UpdateUserStatus', values)
            .then(
                function (response) {
                    if (response.status === 0 && response.message.includes("assigned") && thisObj.state.actionName === "UserStatus") {
                        thisObj.setState({ modalLoad: false });
                        UserAssignedPop({
                            title: "Users",
                            msg: response.message,
                            action: "Update",
                            onOk: () => { thisObj.UpdateAnyway(ChangeReason) },
                            onCancel: () => { thisObj.handleCancel() }
                        });
                    } else if (response.status == 1) {
                        thisObj.setState({ actionName: "Index", modalLoad: false, showUserStatusModal: false });
                        successModal(response.message, thisObj.props, "/trans/users");
                    } else {
                        thisObj.setState({ modalLoad: false, showUserStatusModal: false });

                        errorModal(response.message);
                    }
                });

    }

    //To show user status assign modal
    showUserStatusModal = (userID, statusid, updatedDateTimeText) => {
        this.setState({ actionName: "UserStatus", showUserStatusModal: true, userID: userID, userStatusID: statusid == 2 ? 3 : 2, updatedDateTimeText: updatedDateTimeText });
    }

    confirmReset = (userID, userName) => {
        this.setState({ actionName: "PassReset", showResetModal: true, userID: userID, userName: userName });
    }
    userActiveInActive = (userID) => {
        //console.log(this);
    }
    //To hide userassign/delete modal
    handleCancel = () => {
        this.setState({ showUserStatusModal: false, showDeleteModal: false, showAssignModal: false, showResetModal: false });
        this.props.form.resetFields(['Change Reason']);
    }
    //To show confirm delete modal
    confirmDelete = (userID) => {
        this.setState({ actionName: "Delete", showDeleteModal: true, userID: userID });
    }

    fnToShowActiveUsers = (switchUser) => {

        //For cancel from editpage
        if (!switchUser) {
            this.setState({ switchUser: "Active" });
            this.getUsersList();
        } else if (switchUser) {
            this.setState({ switchUser: "" });
            this.getUsersList();
        }
    }

    ActionCol = (props) => {
        return props.value;

    }


    searchFunc = (e) => {
        if (e.target.value !== '') {
            const filteredData = this.state.dataSource.filter(data =>
                data.some(d => typeof d === "string" && (d || '').toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
            );

            this.setState({ datas: filteredData, search: true, current: 1, pagination: 1 });
        }
        else {
            this.setState({ datas: this.state.dataSource, search: false, });
        }

    }

    socket_open = () => {
        thisObj.setState({ progress: "active" })
    }

    auditLog = () => {
        //showProgress();
        thisObj.socket_open();
        DownloadFileWithPostData("Users/GenAuditForUsers", "TransBot_Users_Audit_Report" + ".pdf", {}, "application/pdf").then(function () {
            thisObj.setState({ progress: "exception" });
            //hideProgress();
        });
    }

    //auditLogXls = () => {
    //    const { study } = this.state;
    //    const thisObj = this;
    //    showProgress();
    //    DownloadFileWithPostData("Users/GenAuditForUsersInXLS", "TransBot_Users_Audit_Report" + ".xlsx", {}, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then(
    //        function (success) {
    //            if (success) {
    //                successModal('AuditLog Exported Successfully!', thisObj.props, "/trans/users");
    //            } else {
    //                errorModal('Error Downloading AuditLog!');
    //            }
    //            thisObj.setState({ auditLogPopup: false });
    //            hideProgress();
    //        }).catch(error => {
    //            //Loader Hide
    //            hideProgress();
    //        });
    //}

    userExport = () => {
        showProgress();
        DownloadFileWithPostData("Users/ExportUserList", "TransBot_UserList" + ".pdf", {}, "application/pdf").then(function () {
            hideProgress();
        });
    }

    userExportXLS = () => {
        const { study } = this.state;
        const thisObj = this;
        showProgress();
        DownloadFileWithPostData("Users/ExportUserListXLS", "TransBot_UserList" + ".xlsx", {}, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then(

  
            function (success) {
            //    if (success) {
            //        successModal('User list Exported Successfully!', thisObj.props, "/trans/users");
            //    } else {
            //        errorModal('Error on exporting User list!');
            //    }
            //    thisObj.setState({ exportPopup: false });
            //    hideProgress();
            //}).catch(error => {
            //    //Loader Hide
                hideProgress();
            }
        );
    }

    render() {
        var colHeaders = ["User Name", "Display Name", "Email Address", "Actions"]

        //Form field decorator 
        const { getFieldDecorator } = this.props.form;
        const { userID, switchUser, datas, search, progress } = this.state;
        const permissions = this.props.permissions;
        return (
            (this.state.actionName !== "Edit") ? <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-user" />
                        <span> Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>
              
                <LayoutContent>

                    <Input type="text" allowClear name="TableSearch" style={{ width: '20%', marginLeft: '5px' }} onChange={(e) => this.searchFunc(e)} placeholder="Search" />
                    
                            <Button className="reacTable-addbtn" style={{ float: "right", marginRight: "15px", marginLeft: "-13px" }} onClick={this.addUser}>ADD</Button>

                            <SwitchToolTip
                                style={{ float: "right", marginRight: "25px", marginTop: "8px" }}
                                onChange={() => this.fnToShowActiveUsers(switchUser)}
                                checked={this.state.switchUser !== "" ? true : false}
                                switchtooltip={this.state.switchUser !== "" ? "Active Users" : "All Users"}
                                switchBtn={true}
                            />
                            <div style={{ float: "right" }} >
                                <Button style={{ margin: "0 5px" }} className="reacTable-addbtn" onClick={() => this.auditLog("pdf")}>
                                    <i className="fa fa-file" /><span style={{ marginLeft: 10 }}>Audit Log</span>
                                </Button><Button style={{ margin: "0 5px" }} className="reacTable-addbtn" onClick={() => this.userExportXLS()}>
                                    <i className="fa fa-file" /><span style={{ marginLeft: 10 }}>User Export</span>
                                </Button>
                            </div>

                    <br />
                    <div style={{ marginTop: "5px" }}> </div>

                    <span style={{ marginLeft: "7px" }}>Showing list of records:{search ? this.state.datas.length : this.state.noOfRows}</span>

                    <span loading={this.stateloading}>
                        
                        <div style={{ marginTop: "15px" }}> </div>

                        {this.state.datas &&
                            <HotTable
                                settings={{
                                    ...this.state.settings,
                                    columnSorting: {
                                        sortEmptyCells: true,
                                    },
                                    afterGetColHeader: function (col, TH) {
                                        var BUTTON_CLASS_NAME = 'changeType';
                                        if (col === 3) {
                                            var existingButton = TH.querySelector('.' + BUTTON_CLASS_NAME);
                                           
                                                if (existingButton) {
                                                    existingButton.parentNode.removeChild(existingButton);  
                                                }
                                                return;
                                            
                                        }
                                    }
                                }}
                                data={this.state.datas}
                                colHeaders={colHeaders}
                                ref={this.hotTableComponent}
                                addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addUser : null}
                                afterOnCellMouseUp={(e, coords, td) => {
                                    e.preventDefault();

                                    if (e.realTarget && coords.col === 3) {
                                        let key = Object.keys(e.realTarget).filter((x) => {

                                            return x.indexOf('__reactEventHandlers') >= 0

                                        })
                                        if (e.realTarget[key] && typeof e.realTarget[key].action === "function") {
                                            e.realTarget[key].action();
                                        };
                                    }
                                }}
                                beforeColumnSort={(order, t) => {
                                    if ((order && order[0] && order[0].column == 3) || (t && t[0] && t[0].column == 3))
                                        return false;

                                }}
                            >
                                <HotColumn settings={{ width: "50%" }}>
                                    <ActionCell hot-renderer />
                                </HotColumn>
                                <HotColumn settings={{ width: "50%" }}>
                                    <ActionCell hot-renderer />
                                </HotColumn>
                                <HotColumn settings={{ width: "50%" }}>
                                    <ActionCell hot-renderer />
                                </HotColumn>
                                <HotColumn settings={{ readOnly: true, width: "20%" }}  >
                                    <ActionColumn hot-renderer props={this} />
                                </HotColumn>
                            </HotTable>
                        }
                        <Form>
                            {
                                (this.state.actionName == "Delete") ? <ConfirmModal title="Delete User" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteModal} loading={this.state.modalLoad} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> :
                                    (this.state.actionName == "PassReset") ? <ConfirmModal loading={this.state.modalLoad} title="Reset Password" SubmitButtonName="Reset" onSubmit={this.handleResetPassword} visible={this.state.showResetModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> :
                                        (this.state.actionName == "UserStatus") ? <ConfirmModal loading={this.state.modalLoad} title="Update User Status" SubmitButtonName="Update" onSubmit={this.handleUserStatus} visible={this.state.showUserStatusModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> : ""
                            }
                        </Form>
                    </span>

                    {<Progress progress={progress} />}

                </LayoutContent>
            </LayoutContentWrapper>
                :
                <Edit cancel={this.fnToShowActiveUsers} handleCancel={this.handleCancel} switchUser={switchUser} userID={userID} actionName={this.state.actionName} />

        );
    }


}


const WrappedApp = Form.create()(User);

export default WrappedApp;