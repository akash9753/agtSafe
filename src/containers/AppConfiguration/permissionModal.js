import React, { Component } from 'react';
import { Col, Row, Form, Tooltip, Modal } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone } from '../Utility/sharedUtility';
import Select, { SelectOption } from '../../components/uielements/select';
import Input from '../../components/uielements/input';
import ConfirmModal from '../Utility/ConfirmModal';
import Spin from '../../styles/spin.style';
import { checkSelect } from '../Utility/validator';
const Option = SelectOption;
const FormItem = Form.Item;

let uuid = 0;
let keys = [];
let locRoleID = -1;
const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };
const iconCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold', marginTop: 5 };
const msgCenter = { textAlign: 'center', color: '#788195', fontSize: 20, fontWeight: 'bold', marginTop: 25 };
class PermissionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleID: 0,
            objectCategory: [],
            objectName: [],
            permissionLevel: [],
            permissions: [],
            newAdded: false,
            editIndex: -1,
            deleteIndex: -1,
            showEditModal: false,
            showDeleteModal: false,
            loading: true
        };


    }
    static getDerivedStateFromProps(nextProps, currentstate) {

        if (typeof nextProps.roleId != "undefined" && nextProps.roleId != null && nextProps.roleId != locRoleID && uuid == 0) {
           // const thisObj = this;
            CallServerPost('Permission/GetPermissionData', { RoleID: nextProps.roleId })
                .then(
                    function (response) {
                        var permissionlist = [];
                        if (response.value.permissionList != null) {
                            permissionlist = response.value.permissionList;
                        }
                        return
                        ({
                            roleID: nextProps.roleId,
                            objectCategory: response.value.objectCategoryList,
                            objectName: response.value.objectNameList,
                            permissionLevel: response.value.permissionLevelList,
                            permissions: permissionlist,
                            loading: false
                        })
                    }).catch(error => error);


        }
    }
   /* componentWillReceiveProps(nextProps) {

        if (typeof nextProps.roleId != "undefined" && nextProps.roleId != null && nextProps.roleId != locRoleID && uuid == 0) {
            const thisObj = this;
            CallServerPost('Permission/GetPermissionData', { RoleID: nextProps.roleId })
                .then(
                    function (response) {
                        var permissionlist = [];
                        if (response.value.permissionList != null) {
                            permissionlist = response.value.permissionList;
                        }
                        thisObj.setState({ roleID: nextProps.roleId, objectCategory: response.value.objectCategoryList, objectName: response.value.objectNameList, permissionLevel: response.value.permissionLevelList, permissions: permissionlist, loading: false });

                    }).catch(error => error);
        }
    }*/

    onObjectCategoryChange = (k) => {
        this.forceUpdate();
    }

    remove = (k) => {
        keys = keys.filter(key => key !== k);
        uuid--;
        this.setState({ newAdded: false });
        this.props.form.resetFields();
    }

    showDeleteModal = (k) => {
        this.setState({ showDeleteModal: true, deleteIndex: k });
    }

    handleDelete = () => {
        const thisObj = this;
        this.props.form.validateFields(['ChangeReason'], { force: true }, (err, values) => {
            if (!err) {

                const postValue = {
                    PermissionID: thisObj.state.permissions[this.state.deleteIndex].permissionID,
                    ChangeReason: values.ChangeReason
                };

                thisObj.setState({ loading: true });
                PostCallWithZone('Permission/Delete', postValue)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.reloadModal);
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
    }

    editPermission = (k) => {
        this.setState({ editIndex: k });
    }

    cancelPermission = (k) => {
        if (this.state.newAdded) {
            this.remove(k);
        } else {
            this.props.form.resetFields();
            this.setState({ editIndex: -1 });
        }
    }

    removeAll = () => {
        locRoleID = -1;
        keys = [];
        uuid = 0;
        this.setState({ permissions: null, editIndex: -1, newAdded: false, deleteIndex: -1 });
    }

    add = () => {
        keys = keys.concat(uuid);
        uuid++;
        this.setState({ newAdded: true });
    }

    handleSubmit = (k) => {
        const thisObj = this;
        this.props.form.validateFields(['objectCategoryItem' + k, 'objectNameSelectItem' + k, 'permissionLevelSelectItem' + k], { force: true }, (err, values) => {
            if (!err) {
                if (thisObj.state.editIndex >= 0) {
                    thisObj.setState({ showEditModal: true });
                } else {
                    const postValue = { RoleID: thisObj.state.roleID, UIElementID: values["objectNameSelectItem" + k], PermissionLevelID: values["permissionLevelSelectItem" + k] };
                    thisObj.setState({ loading: true });
                    PostCallWithZone('Permission/Create', postValue)
                        .then(
                            function (response) {
                                if (response.status == 1) {
                                    successModalCallback(response.message, thisObj.reloadModal);
                                } else {
                                    errorModal(response.message);
                                }
                            }).catch(error => error);
                }

            }
        });
    }

    reloadModal = () => {
        uuid = 0;
        keys = [];
        locRoleID = -1;
        this.setState({ permissions: null, editIndex: -1, showEditModal: false, showDeleteModal: false, newAdded: false, deleteIndex: -1 });
        this.props.form.resetFields();
    }

    handleUpdate = () => {
        const thisObj = this;
        var editIndex = this.state.editIndex;
        this.props.form.validateFields(['objectCategorySelectItem' + editIndex, 'objectNameSelectItem' + editIndex, 'permissionLevelSelectItem' + editIndex, 'ChangeReason'], { force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ loading: true });

                const postValue = {
                    PermissionID: thisObj.state.permissions[editIndex].permissionID,
                    RoleID: thisObj.state.roleID,
                    UIElementID: values["objectNameSelectItem" + editIndex],
                    PermissionLevelID: values["permissionLevelSelectItem" + editIndex],
                    ChangeReason: values.ChangeReason
                };

                PostCallWithZone('Permission/Update', postValue)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.reloadModal);
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showDeleteModal: false });
    }

    render() {
        const permissionsrestrictions = this.props.permissions;
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        const { objectName, permissionLevel, permissions, editIndex, newAdded } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const topRow = (<Row gutter={16}>
            <Col span={6}>
                <div style={divCenter}>
                    <span>ObjectCategory</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span>ObjectName</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span>PermissionLevel</span>
                </div>
            </Col>
            <Col span={2}>
                    <div style={divCenter}>
                        <span>Actions</span>
                    </div>
            </Col>
        </Row>);
        if (permissions != null && uuid == 0) {
            for (var i = 0; i < permissions.length; i++) {
                keys.push(i);
                uuid++;
            }
        }

        var deafultOption = [(<Option disabled key="--Select--" >--Select--</Option>)];
        var objectCategoryOptions = this.state.objectCategory.map(function (option) {
            return (
                <Option key={option.productcontrolledTermID}>
                    {option.shortValue}
                </Option>
            )
        });
        objectCategoryOptions = deafultOption.concat(objectCategoryOptions);

        const formItems = keys.map((k, index) => {
            return (
                <Row gutter={16} key={k}>
                    <Col key={'objectCategoryCol' + k} span={6}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('objectCategorySelectItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Please Select ObjectCategory",
                                }, { validator: checkSelect, message: "Please Select ObjectCategory" }],
                                initialValue: k < permissions.length ? permissions[k].objectCategoryID.toString() : "--Select--",
                            })(
                                <Select
                                    showSearch
                                    placeholder="Select ObjectCategory"
                                    disabled={k < permissions.length && k != editIndex}
                                    onChange={() => this.onObjectCategoryChange(k)}
                                    key={'objectCategorySelect' + k}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {objectCategoryOptions}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'objectNameCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('objectNameSelectItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Please Select ObjectName",
                                }],
                                initialValue: k < permissions.length ? permissions[k].objectDisplayName : [],
                            })(
                                <Select disabled={k < permissions.length && k != editIndex || getFieldValue('objectCategorySelectItem' + k) == "--Select--"} placeholder="Please Select objectName" key={'objectNameSelect' + k}>
                                    {
                                        getFieldValue('objectCategorySelectItem' + k) != "--Select--" ?
                                            objectName[getFieldValue('objectCategorySelectItem' + k)].map(function (option) {
                                                return (
                                                    <Option key={option.uiElementID}>
                                                        {option.objectDisplayName}
                                                    </Option>
                                                )
                                            }) : ("")
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'permissionLevelCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('permissionLevelSelectItem' + k, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    message: "Please Select PermissionLevel",
                                }],
                                initialValue: k < permissions.length ? permissions[k].permissionLevelID.toString() : [],
                            })(
                                <Select disabled={k < permissions.length && k != editIndex} key={'permissionLevelSelect' + k} placeholder="Select PermissionLevel">
                                    {permissionLevel.map(function (option) {
                                        return (
                                            <Option key={option.productcontrolledTermID}>
                                                {option.longValue}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    {
                        k < permissions.length && k != editIndex ?
                            (
                                <Col>
                                    <div style={iconCenter}>
                                            <Tooltip title="Edit">
                                                <a onClick={() => this.editPermission(k)}>
                                                    <i className="ion-edit" />
                                                </a>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <a onClick={() => this.showDeleteModal(k)} style={{ color: '#FF0000' }}>
                                                    <i
                                                        style={{ marginLeft: 15 }}
                                                        className="ion-android-delete"
                                                    />
                                                </a>
                                            </Tooltip>
                                    </div>
                                </Col>) :
                            (<Col key={'actionsCol' + k} span={2}>
                                <div style={iconCenter}>
                                    <Tooltip title="Save">
                                        <a onClick={() => this.handleSubmit(k)}>
                                            <i className="anticon anticon-check" style={{ fontSize: '14px' }} />
                                        </a>
                                    </Tooltip>
                                    {
                                        k != editIndex && !newAdded ? (<Tooltip title="Delete">
                                            <a onClick={() => this.remove(k)} style={{ color: '#FF0000' }}>
                                                <i
                                                    style={{ marginLeft: 15 }}
                                                    className="ion-android-delete"
                                                />
                                            </a>
                                        </Tooltip>) : (<Tooltip title="Cancel">
                                            <a onClick={() => this.cancelPermission(k)} style={{ color: '#FF0000' }}>
                                                <i
                                                    style={{ marginLeft: 15 }}
                                                    className="ion-close-round"
                                                />
                                            </a>
                                        </Tooltip>)
                                    }

                                </div>
                            </Col>)
                    }
                </Row>
            );
        });
        return (

            <Modal
                visible={this.props.visible}
                title={"Permission"}
                style={{ top: 20 }}
                onCancel={this.props.handleCancel}
                width={'80%'}
                afterClose={this.removeAll}
                maskClosable={false}
                footer={
                    [
                        <Button key="submit" disabled={this.state.editIndex >= 0 || this.state.newAdded} type="primary" size="large" onClick={this.add}>
                            Add Permission
                    </Button>,
                    ]
                }
            >
                <Spin tip="Loading..." spinning={this.state.loading}>
                    {uuid != 0 && topRow}

                    {uuid == 0 && <div style={msgCenter}>
                        <span>No Permissions yet!</span>
                    </div>}

                    <Form style={{ marginTop: 16 }} onSubmit={this.handleSubmit}>
                        {formItems}
                        <ConfirmModal title="Update Permission" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                        <ConfirmModal title="Delete Permission" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(PermissionModal);

export default WrappedApp;