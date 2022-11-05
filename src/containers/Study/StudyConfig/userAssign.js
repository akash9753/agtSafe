import React, { Component } from 'react';
import { Input, Form, Select, Col, Row,Button } from 'antd';
import {
    validJSON,
    getTimeZone,
    getProjectRole,
    CallServerPost,
    errorModal,
    getAddButtonText,
    getEditButtonText,
    getSaveButtonText,
    successModalCallback,
    showProgress, hideProgress,
    checkPermission
} from '../../Utility/sharedUtility';
import ConfirmModal from '../../Utility/ConfirmModal';

const FormItem = Form.Item;
const Option = Select.Option;

const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };

const tabStyle = { height: "calc(100vh - 100px)" };
var thisObj ;
var projectRole = getProjectRole();

class UserAssign extends Component {

    constructor(props) {
        super(props);

        this.state =
        {
            loading: false,
            userAssigns: [],
            usersDropDownList: [],
            rolesList: [],
            editIndex: true,
            disableBtn: false,
            showConfirmModal: false,
            showUserAssign:false,
        };
        thisObj = this;
    }

    static getDerivedStateFromProps(newProps,currentState)
    {
        let { activeKey } = newProps;
        if (activeKey === "User Assignment" && !currentState.showUserAssign)
        {
            thisObj.getList();
        } else if (activeKey !== "User Assignment")
        {
            return { showUserAssign: false };
        }
    }
    componentWillUnmount()
    {
        sessionStorage.removeItem("projectInActive")
    }
    getList = () => {
        let { study } = this.props;
        let { studyID } = study;
        showProgress();
        CallServerPost('UserAssignment/GetUserAssignDataForStudy', { StudyID: studyID })
            .then(function (response) {
                hideProgress();
                if (response.status === 1) {
                    var userAssignList = [];
                    response.value.rolesList.map(function (obj, index)
                    {
                        if (response.value.userAssignList.length > 0)
                        {
                            userAssignList.push(response.value.userAssignList.filter(x => x.roleID == obj.roleID));
                        }
                    });
                    thisObj.setState({
                        showUserAssign: true,
                        rolesList: response.value.rolesList,
                        userAssigns: response.value.userAssignList,
                        usersDropDownList: response.value.usersList,
                    });
                }

            }).catch(error => error);
    }

    create = () => {
        const thisObj = this;

        try {
            //Loader
            showProgress();
            let { study } = this.props;

            thisObj.props.form.validateFields((err, values) =>
            {
                if (!err)
                {
                    var entries = [];
                    Object.keys(values).map(function (obj, index)
                    {
                        if (obj.split("_")[0] == "User")
                        {
                            var datas = {};
                            var tempdata = {};

                            for (var i = 0; i < values["User_" + obj.split("_")[1].toString()].length; i++)
                            {

                                datas["ProjectID"] = thisObj.props.projectID;
                                datas["StudyID"] = study.studyID;
                                datas["RoleID"] = obj.split("_")[1];
                                datas["UserID"] = values["User_" + obj.split("_")[1].toString()][i];
                                datas["TimeZone"] = getTimeZone();
                                datas["UpdatedBy"] = projectRole.userProfile.userID;

                                entries.push(datas);
                                datas = {};
                            }

                        }
                    });

                    thisObj.setState({ disableBtn: true });

                    CallServerPost('UserAssignment/CreateMultiple', entries)
                        .then(
                            function (response)
                            {
                                //Loader
                                hideProgress();
                                if (response.status == 1)
                                {
                                    successModalCallback(response.message, thisObj.refreshList(thisObj.props));
                                } else
                                {
                                    errorModal(response.message);
                                }
                            });
                } else {
                    //Loader
                    hideProgress();
                }

            })
        }
        catch (e) {
            hideProgress();
        }
    }

    update = (changeReason) => {
        const thisObj = this;
        let {study } = this.props;
        thisObj.props.form.validateFields((err, values) =>
        {
            if (!err) {
                var entries = [];
                Object.keys(values).map(function (obj, index)
                {
                    if (obj.split("_")[0] == "User")
                    {

                        //If already assigned list is not in current values object then it has been considered as delete
                        thisObj.state.userAssigns.map(function (list, i)
                        {
                            if (list.roleID.toString() === obj.split("_")[1])
                            {
                                if (!values[obj].some(x => x == list.userID))
                                {
                                    var datas = {};
                                    datas["UserAssignmentID"] = list.userAssignmentID;
                                    datas["ProjectID"] = study.projectID;
                                    datas["StudyID"] = study.studyID;
                                    datas["RoleID"] = obj.split("_")[1];
                                    datas["UserID"] = list.userID;
                                    datas["TimeZone"] = getTimeZone();
                                    datas["UpdatedBy"] = projectRole.userProfile.userID;
                                    datas["ChangeReason"] = changeReason;
                                    datas["UpdatedDateTimeText"] = thisObj.state.userAssigns.filter(x => x.roleID == obj.split("_")[1])[0].updatedDateTimeText;
                                    datas["ActionFor"] = 2;//delete
                                    entries.push(datas);
                                }
                            }
                        });

                        //If current values object list is does not contain the users in alreday assigned list then it has been considered as insert
                        values[obj].map(function (list, i)
                        {
                            if (!thisObj.state.userAssigns.some(x => x.userID == list && x.roleID.toString() === obj.split("_")[1]))
                            {
                                var datas = {};
                                datas["UserAssignmentID"] = list.userAssignmentID;
                                datas["ProjectID"] = study.projectID;
                                datas["StudyID"] = study.studyID;
                                datas["RoleID"] = obj.split("_")[1];
                                datas["UserID"] = list;
                                datas["TimeZone"] = getTimeZone();
                                datas["UpdatedBy"] = projectRole.userProfile.userID;
                                datas["ChangeReason"] = changeReason;
                                //datas["UpdatedDateTimeText"] = thisObj.state.userAssigns.filter(x => x.roleID == obj.split("_")[1])[0].updatedDateTimeText;
                                datas["ActionFor"] = 1; //Create
                                entries.push(datas);
                            }
                        });
                    }
                });
                thisObj.setState({ disableBtn: true });

                showProgress();
                CallServerPost('UserAssignment/UpdateMultiple', entries)
                    .then(
                        function (response)
                        {
                            hideProgress();
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.refreshList(thisObj.props));
                            } else {
                                errorModal(response.message);
                            }
                        });
            }

        })
    }

    fnToEdit = () => {
        this.setState({ editIndex: !this.state.editIndex });
    }

    handleUpdate = () =>
    {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ showConfirmModal: true });
            }
        })
    }

    handleCancel = () => {
        this.setState({ showConfirmModal: false });
    }

    refreshList = () => {
        this.setState({ editIndex:true,showConfirmModal: false, loading: false, userAssigns: [], usersDropDownList: [], rolesList: [] });
        this.getList();
    }
    render()
    {
        const { getFieldDecorator } = this.props.form;
        const {
            usersDropDownList,
            userAssigns,
            rolesList,
            editIndex,
            showConfirmModal,
            disableBtn
        } = this.state;
        const {
            isProjectInActive,
            study,
            studyName,
            permissions
        } = this.props;
        const { locked } = study;
        let role = sessionStorage.getItem("role");
        let roleID = validJSON(role).RoleID;
        return (
            <div style={tabStyle}>
                {rolesList.length > 0 &&
                    <React.Fragment>
                        <Row style={{ padding: "5px", marginBottom: "10px", background: "linear-gradient(to left, #3A6073, #16222A)" }}>
                            <Col span={12}>
                                <div style={divCenter}>
                                    <span style={{ color: "#fff" }}>Roles</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={divCenter}>
                                    <span style={{ color: "#fff" }}>Users</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className="roleAssignParentDiv" >
                            {
                                rolesList.map(function (key, index) {
                                    return (
                                        <Row className="roleAssign" >
                                            <Col span={12}>
                                                <FormItem>
                                                    {
                                                        getFieldDecorator(key.roleID.toString(), {
                                                            initialValue: key.roleID === null ? [] : key.roleName,
                                                        })(
                                                            <Input disabled={true} />
                                                        )}
                                                </FormItem>
                                            </Col>
                                            <Col span={12} style={{ padding: "0px 0px 0px 10px" }}>
                                                <FormItem>
                                                    {
                                                        getFieldDecorator("User_" + key.roleID.toString(), {
                                                            //initialValue: userAssigns.length == 0 ? [] : userAssigns.filter(x => x.roleID == key.roleID).userID.toString(),                                                    
                                                            initialValue: userAssigns != undefined ? userAssigns.length > 0 ? userAssigns.filter(x => x.roleID == key.roleID).map(obj => obj.userID.toString()) : [] : [],
                                                            rules: [{ required: true, message: "Users should be selected" }],
                                                        })(
                                                            <Select
                                                                mode="multiple"
                                                                showSearch
                                                                style={{ width: "100%" }}
                                                                optionFilterProp="children"
                                                                filterOption={(input, option) =>
                                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                disabled={
                                                                    editIndex
                                                                }
                                                                placeholder="Please select user"
                                                                aria-name={key.roleName}
                                                            >
                                                                {
                                                                    usersDropDownList.map(function (option) {
                                                                        return (
                                                                            <Option name={key.roleName + "_Option"} key={option.userID}>{option.userName}</Option>
                                                                        );
                                                                    })
                                                                }
                                                            </Select>
                                                        )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    )
                                })}
                        </Row>

                        {showConfirmModal && <ConfirmModal loading={false} title="Update User Assignment" SubmitButtonName="Save" onSubmit={this.update} visible={this.state.showConfirmModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />}
                    <Row>
                        {(projectRole.userProfile.adminType === 127 || projectRole.userProfile.adminType === 126 ) || ((!isProjectInActive) && !locked && (study.workflowActivityStatusID !== 15 ) && checkPermission(permissions, ["UserAssignment"]) >= 2) ?
                            (
                                
                                    editIndex ?
                                        <Button
                                            type="primary"
                                            style={{ float: "right" }}
                                            size="large"
                                            name="Edit"
                                            onClick={this.fnToEdit}
                                            disabled={this.props.workflowActivityStatusID === 16}
                                        >
                                            {"Edit"}
                                        </Button> :
                                        <Button style={{ float: "right" }} type="primary" size="large" className="saveBtn" name="Save" onClick={this.handleUpdate}>
                                            {getSaveButtonText()}
                                        </Button>) : null}
                                        </Row>
                                        </React.Fragment>
                }
            </div>)
    }
}

const WrappedApp = Form.create()(UserAssign);

export default WrappedApp;