import React, { Component } from 'react';
import { Input, Form, Select, Col, Row, Modal, Icon, Tooltip, Spin } from 'antd';
import { PostCallWithZone, validJSON, getTimeZone, getProjectRole, CallServerPost, getSaveButtonText, errorModal, successModalCallback, getAddButtonText, showProgress, hideProgress } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';

import Button from '../../components/uielements/button';
const FormItem = Form.Item;
const Option = Select.Option;

const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };

//Importing ButtonWithToolTip for Actions

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj = "";
var projectRole = getProjectRole();

class RoleAssignment extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            loading: true,
            userAssigns: [],
            usersDropDownList: [],
            rolesList: [],
            editIndex: true,
            showConfirmModal: false,
            disableBtn: false
        };
        thisObj = this;
        thisObj.getList();
    }
    componentWillUnmount() {
        sessionStorage.removeItem("projectInActive")
    }

 

    getList = () => {
        thisObj.setState({ loading: true });

        showProgress();
        CallServerPost('UserAssignment/GetUserAssignDataForStudy', { StudyID: thisObj.props.StudyID })
            .then(function (response)
            {
                hideProgress();
                if (response.status === 1) {
                    var userAssignList = [];
                    response.value.rolesList.map(function (obj, index) {
                        if (response.value.userAssignList.length > 0) {
                            userAssignList.push(response.value.userAssignList.filter(x => x.roleID == obj.roleID));
                        }
                    });
                    thisObj.setState({ userAssigns: response.value.userAssignList, usersDropDownList: response.value.usersList, rolesList: response.value.rolesList, loading: false });
                }

            }).catch(error => error);
    }

    create = () => {
        const thisObj = this;

        try {
            //Loader
            showProgress();
            thisObj.props.form.validateFields((err, values) => {
                if (!err) {
                    var entries = [];
                    Object.keys(values).map(function (obj, index) {
                        if (obj.split("_")[0] == "User") {
                            var datas = {};
                            var tempdata = {};

                            for (var i = 0; i < values["User_" + obj.split("_")[1].toString()].length; i++) {

                                datas["ProjectID"] = thisObj.props.projectID;
                                datas["StudyID"] = thisObj.props.StudyID;
                                datas["RoleID"] = obj.split("_")[1];
                                datas["UserID"] = values["User_" + obj.split("_")[1].toString()][i];
                                datas["TimeZone"] = getTimeZone();
                                datas["UpdatedBy"] = projectRole.userProfile.userID;

                                entries.push(datas);
                                datas = {};
                            }

                        }
                    });

                    thisObj.setState({ loading: true, disableBtn: true });

                    CallServerPost('UserAssignment/CreateMultiple', entries)
                        .then(
                            function (response) {
                                //Loader
                                hideProgress();
                                if (response.status == 1) {
                                    successModalCallback(response.message, thisObj.refreshList(thisObj.props));
                                } else {
                                    errorModal(response.message);
                                }
                                thisObj.setState({ disableBtn: false, loading: false });
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
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                var entries = [];
                Object.keys(values).map(function (obj, index) {
                    if (obj.split("_")[0] == "User") {

                        //If already assigned list is not in current values object then it has been considered as delete
                        thisObj.state.userAssigns.map(function (list, i) {
                            if (list.roleID.toString() === obj.split("_")[1]) {
                                if (!values[obj].some(x => x == list.userID)) {
                                    var datas = {};
                                    datas["UserAssignmentID"] = list.userAssignmentID;
                                    datas["ProjectID"] = thisObj.props.projectID;
                                    datas["StudyID"] = thisObj.props.StudyID;
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
                        values[obj].map(function (list, i) {                           
                            if (!thisObj.state.userAssigns.some(x => x.userID == list && x.roleID.toString() === obj.split("_")[1])) {
                                    var datas = {};
                                    datas["UserAssignmentID"] = 0;
                                    datas["ProjectID"] = thisObj.props.projectID;
                                    datas["StudyID"] = thisObj.props.StudyID;
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

                thisObj.setState({ loading: true, disableBtn: true });
                CallServerPost('UserAssignment/UpdateMultiple', entries)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.refreshList(thisObj.props));
                            } else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ loading: false, disableBtn: false });
                        });
            }

        })
    }

    fnToEdit = () => {
        this.setState({ editIndex: !this.state.editIndex });
    }

    handleUpdate = () => {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ showConfirmModal: true });
            }
        })
    }

    handleCancel = () => {
        this.setState({ showConfirmModal: false, loading: false });
    }

    refreshList = () => {
        this.setState({ showConfirmModal: false, loading: false, userAssigns: [], usersDropDownList: [], rolesList: [] });
        this.props.refreshList();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading,
            usersDropDownList,
            userAssigns,
            rolesList,
            editIndex,
            showConfirmModal,
            disableBtn } = this.state;
        const {
            isProjectInActive,
            studyLocked,
            studyName
        } = this.props;
        let role = sessionStorage.getItem("role");
        let roleID = validJSON(role).RoleID;
        return (

            <Modal
                visible={this.props.visible}
                title={studyName+" - User Assignment"}
                style={{ top: 20 }}
                onCancel={disableBtn ? null : this.props.handleCancel}
                width={'80%'}
                afterClose={this.removeAll}
                maskClosable={false}
                footer={[(!isProjectInActive) && !studyLocked ? (
                    userAssigns.length == 0 ? <Button disabled={disableBtn} type="primary" size="large" className="saveBtn" name="Add" onClick={this.create} disabled={this.props.workflowActivityStatusID === 16}>
                        {getAddButtonText()}
                    </Button> : editIndex ? <Button type="primary" size="large" name="Edit" onClick={this.fnToEdit} disabled={this.props.workflowActivityStatusID === 16} >
                            Edit
                    </Button> :
                    <Button disabled={disableBtn} type="primary" size="large" className="saveBtn" name="Save" onClick={this.handleUpdate}>
                        {getSaveButtonText()}
                    </Button>) : null,
                    <Button type="danger" disabled={disableBtn} size="large" className="cancelBtn" name="Cancel" onClick={this.props.handleCancel}>
                        Cancel
                    </Button>
                ]}
            >
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
                                                    initialValue: userAssigns != undefined ? userAssigns.length > 0 ? userAssigns.filter(x => x.roleID == key.roleID).map(obj => obj.userID.toString()):[]:[],
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
                                                        disabled={(
                                                            userAssigns.length == 0 &&
                                                            !isProjectInActive &&
                                                            !studyLocked || (roleID === 4 && key.roleID === 4)) ?
                                                            false
                                                            :
                                                            editIndex}
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

                    {showConfirmModal && <ConfirmModal loading={this.state.loading} title="Update User Assignment" SubmitButtonName="Save" onSubmit={this.update} visible={this.state.showConfirmModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />}
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(RoleAssignment);

export default WrappedApp;