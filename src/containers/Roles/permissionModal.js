import React, { Component } from 'react';
import { Input, Select, Col, Row, Form, Modal, Icon, Spin, message } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import { checkSelect } from '../Utility/validator';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { object } from 'prop-types';

const Option = Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let uuid = 0;
let keys = [];
let locRoleID = -1;
const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };
const iconCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold', marginTop: 5 };
const msgCenter = { textAlign: 'center', color: '#788195', fontSize: 20, fontWeight: 'bold', marginTop: 25 };
var getElems = [];
var thisobj = null;
var scrollFlag = false;


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
            loading: true,
            actionName: "",
            modalLoad: false,
            dropDownConfigFlag: false,
            onCategoryClick: false,
            currentEditIndex: "",
            dropDownObjList: [],
            objectCategoryOptions: [],
            UIElementsArr: [],
            disableBtn: false,
            displays: false

        };
        thisobj = this;
        this.getAllPermissionData();
    }


    getAllPermissionData = () => {
        if (typeof this.props.roleId != "undefined" && this.props.roleId != null && this.props.roleId != locRoleID && uuid == 0) {
            const thisObj = this;
            CallServerPost('Permission/GetPermissionData', { RoleID: this.props.roleId })
                .then(
                    function (response) {
                    var permissionlist = [];
                    if (response.value.permissionList != null) {
                        permissionlist = response.value.permissionList;
                    }
                    thisObj.setState({ roleID: thisObj.props.roleId, objectCategory: response.value.objectCategoryList, objectName: response.value.objectNameList, dropDownObjList: response.value.DropDownObjectList, permissionLevel: response.value.permissionLevelList, permissions: permissionlist, loading: false, UIElementsArr: response.value.uiElementsList });

                    var CategoryOptions = thisObj.state.objectCategory.map(function (option, index) {
                        var len = thisObj.state.permissions.filter(x => x.objectCategoryID == option.productcontrolledTermID).length;
                        if (thisObj.state.objectName[option.productcontrolledTermID].length != len) {
                            return (
                                <Option name="Object Category_Option" key={option.productcontrolledTermID}>
                                    {option.shortValue}
                                </Option>
                            )
                        } else {
                            return (
                                <Option disabled name="Object Category_Option" key={option.productcontrolledTermID}>
                                    {option.shortValue}
                                </Option>
                            )
                        }
                    });

                    thisObj.setState({ objectCategoryOptions: CategoryOptions });
                }).catch(error => error);
            getElems = [];
        }
    }

    componentDidUpdate() {
        var scrollDiv = document.getElementById("permission-wrapper");
        if (scrollDiv !== null && scrollFlag) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
            scrollFlag = false;
        }
    }

    onObjectCategoryChange = (k) => {
        this.forceUpdate();
        this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
        this.setState({ onCategoryClick: true, currentEditIndex: k });
    }

    remove = (k) => {
        keys = keys.filter(key => key !== k);
        uuid--;
        this.setState({ newAdded: false });
        this.props.form.resetFields();
    }

    showDeleteModal = (k) => {
        const { UIElementsArr, permissions } = this.state;

        let error = [<div>Please delete the following permissions:</div>];

        let selectedObj = permissions[k];
        let selectedObjUiElementRecord = UIElementsArr.find(x => x.uiElementID == selectedObj.uiElementID);

        switch (selectedObj.objectCategoryText)
        {
            case "SubMenu":
            {
                     permissions.map(child => {
                         if (child.objectName === selectedObjUiElementRecord.objectName && child.uiElementID !== selectedObjUiElementRecord.uiElementID)
                         {
                            error.push(<div>{error.length}.{child.objectDisplayName + " " + child.objectCategoryText}</div>);
                        }
                    });
                    break;
            }
            default : {
                permissions.map(child => {
                    let ch = UIElementsArr.find(x => x.uiElementID == child.uiElementID);
                    if (ch.parentObjectID === selectedObjUiElementRecord.uiElementID) {
                        error.push(<div>{error.length}.{child.objectDisplayName + " " + child.objectCategoryText}</div>);
                    }
                });
                break;
            }
          
        }
      
        if (error.length > 1 )
        {
            errorModal(error);

        }
        else
        {
            this.setState({ showDeleteModal: true, actionName: "delete", deleteIndex: k });
        }
    }

    handleDelete = (changeReason) => {
        const thisObj = this;
        thisobj = this;
        this.props.form.validateFields(['Change Reason'], { force: true }, (err, values) => {
            if (!err) {

                const postValue = {
                    PermissionID: thisObj.state.permissions[thisObj.state.deleteIndex].permissionID,
                    ChangeReason: changeReason
                };

                thisObj.setState({ modalLoad: true, loading: true, disableBtn: true });
                PostCallWithZone('Permission/Delete', postValue)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            successModalCallback(response.message, thisObj.reloadModal);
                            getElems = [];
                            thisObj.setState({ dropDownConfigFlag: false, onCategoryClick: false });

                        } else {
                            errorModal(response.message);
                        }
                        thisObj.setState({ modalLoad: false, showDeleteModal: false, loading: false, disableBtn: false });
                    }).catch(error => error);
            }
        });
    }

    editPermission = (k) => {
        if (this.state.newAdded) {
            keys.pop();
            keys = keys;
            uuid--;
        }
        this.setState({ editIndex: k, dropDownConfigFlag: true, onCategoryClick: true, newAdded: false });
        //this.setState({ editIndex: k })
    }

    cancelPermission = (k) => {
        if (this.state.newAdded) {
            this.remove(k);
        } else {
            this.props.form.resetFields();
            this.setState({ editIndex: -1, onCategoryClick: false, currentEditIndex: "" });
        }
        //this.setState({ editIndex: -1, newAdded:false })
    }

    modalCancel = () => {
        locRoleID = -1;
        keys = [];
        getElems = [];
        uuid = 0;
        this.setState({ permissions: null, editIndex: -1, newAdded: false, deleteIndex: -1, dropDownConfigFlag: false, onCategoryClick: false });
        this.props.handleCancel();
    }

    add = () => {
        keys = keys.concat(uuid);
        uuid++;
        this.setState({ newAdded: true, dropDownConfigFlag: true });
        scrollFlag = true;
    }

    handleSubmit = (k) => {
        const thisObj = this;
        thisObj.props.form.validateFields(['objectCategorySelectItem' + k, 'objectNameSelectItem' + k, 'permissionLevelSelectItem' + k], { force: true }, (err, values) => {
            if (!err) {
                if (thisObj.state.editIndex >= 0) {
                    thisObj.setState({ showEditModal: true, actionName: "edit" });
                } else {
                    const postValue = { RoleID: thisObj.state.roleID, UIElementID: values["objectNameSelectItem" + k], PermissionLevelID: values["permissionLevelSelectItem" + k] };
                    thisObj.setState({ loading: true, disableBtn: true });
                    PostCallWithZone('Permission/Create', postValue)
                        .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.reloadModal);
                                getElems = [];
                                thisObj.setState({ dropDownConfigFlag: false, onCategoryClick: false });
                            } else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ disableBtn: false, loading: false });
                        }).catch(error => error);
                }
            }
        });
    }



    reloadModal = () => {
        showProgress();
        uuid = 0;
        keys = [];
        locRoleID = -1;
        this.setState({ displays: true, permissions: null, editIndex: -1, showEditModal: false, showDeleteModal: false, newAdded: false, deleteIndex: -1 });
        this.props.form.resetFields();
        setTimeout(() => {
            this.setState({ displays: false });
        }, 5000);
        this.getAllPermissionData();
        hideProgress();
    }
    getSelectedUiId = (categoryId, text) => {
        const thisObj = this;
        var getId = "";
        if (text !== "--Select--") {
            thisObj.state.dropDownObjList[categoryId].map(function (values, keys) {
                if (thisObj.state.dropDownObjList[categoryId][keys].objectDisplayName === text) {
                    getId = thisObj.state.dropDownObjList[categoryId][keys].uiElementID;
                }
            });
            return getId;
        } else {
            return getId;
        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        var editIndex = this.state.editIndex;

        this.props.form.validateFields(['objectCategorySelectItem' + editIndex, 'objectNameSelectItem' + editIndex, 'permissionLevelSelectItem' + editIndex], { force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ loading: true, disableBtn: true, modalLoad: true });
                const checkIntOrString = parseInt(values["objectNameSelectItem" + editIndex]);
                const postValue = {
                    PermissionID: thisObj.state.permissions[editIndex].permissionID,
                    RoleID: thisObj.state.roleID,
                    UIElementID: isNaN(checkIntOrString) ? thisObj.getSelectedUiId(values['objectCategorySelectItem' + editIndex], values["objectNameSelectItem" + editIndex]) : values["objectNameSelectItem" + editIndex],
                    PermissionLevelID: values["permissionLevelSelectItem" + editIndex],
                    ChangeReason: ChangeReason,
                    UpdatedDateTimeText: thisObj.state.permissions[editIndex].updatedDateTimeText
                };

                PostCallWithZone('Permission/Update', postValue)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            successModalCallback(response.message, thisObj.reloadModal);
                            getElems = [];
                            thisObj.setState({ dropDownConfigFlag: false, onCategoryClick: false });

                        } else {
                            errorModal(response.message);
                        }
                        thisObj.setState({ loading: false, disableBtn: false, modalLoad: false, showEditModal: false });
                    }).catch(error => error);
            }
        });
    }

    handleCancel = () => {
        getElems = [];
        this.setState({ showEditModal: false, showDeleteModal: false, dropDownConfigFlag: false, onCategoryClick: false });
    }

    onObjectNameChange = (value) => {
        let k = this.state.currentEditIndex;
        const { UIElementsArr, permissions } = this.state;
        var uiElem = UIElementsArr.filter(x => x.uiElementID == value)[0];
        switch (uiElem.objectCategoryText) {
            case "Module":
                if (uiElem.hasMenu) {
                    var isMenuExist = UIElementsArr.filter(x => x.objectName == uiElem.objectName && x.uiElementID != uiElem.uiElementID)[0];
                    var parentElem = permissions.filter(obj => obj.uiElementID == isMenuExist.uiElementID)[0];
                    if (typeof parentElem == "undefined") {
                        message.error('Please first add ' + isMenuExist.objectDisplayName + ' to the Menu.');
                    //    this.removeFields();
                        this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
                    }
                    break;
                }
                break;
            case "SubModule":
                var parentElem = permissions.filter(obj => obj.uiElementID == uiElem.parentObjectID)[0];
                if (typeof parentElem == "undefined") {
                    message.error('Please first add ' + uiElem.parentObjectText);
                //    this.removeFields();
                    this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
                }
                break;
            case "SubMenu":
                var parentElem = permissions.filter(obj => obj.uiElementID == uiElem.parentObjectID)[0];
                if (typeof parentElem == "undefined") {
                    message.error('Please first add ' + uiElem.parentObjectText);
                //    this.removeFields();
                    this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
                }
                break;
            case "Action":
                var parentElem = permissions.filter(obj => obj.uiElementID == uiElem.parentObjectID)[0];
                if (typeof parentElem == "undefined") {
                    message.error('Please first add ' + uiElem.parentObjectText);
                //    this.removeFields();
                    this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
                }
                break;
            case "Element":
                var parentElem = permissions.filter(obj => obj.uiElementID == uiElem.parentObjectID)[0];
                if (typeof parentElem == "undefined") {
                    message.error('Please first add ' + uiElem.parentObjectText);
                //    this.removeFields();
                    this.props.form.resetFields(['objectNameSelectItem' + k, 'permissionLevelSelectItem' + k]);
                }
                break;

        }


    }

    removeFields = () => {
        keys = keys.filter(key => key !== keys[keys.length - 1]);
        uuid--;
        this.setState({ newAdded: false });
        this.props.form.resetFields();
    }

    render() {

        const permissionsRes = this.props.permissions;
        const perLevel = checkPermission(permissionsRes, ['self']);

        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        const { dropDownConfigFlag, objectName, permissionLevel, permissions, editIndex, newAdded, onCategoryClick, currentEditIndex, objectCategoryOptions, displays } = this.state;
        //console.log(objectName);
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
        const topRow = (<Row style={{ padding: "5px", background: "linear-gradient(to left, #3A6073, #16222A)" }}>
            <Col span={this.state.roleID > 9 ? 6 : 8}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Object Category</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Object Name</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Permission Level</span>
                </div>
            </Col>
            {this.state.roleID > 9 ? <Col span={2}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Actions</span>
                </div>
            </Col> : null}
        </Row>);
        if (permissions != null && uuid == 0) {
            for (var i = 0; i < permissions.length; i++) {
                keys.push(i);
                uuid++;
            }
        }

        const getCategoryFunc = (id) => {
            var getId = "";
            this.state.objectCategory.map(function (option) {
                if (id === option.productcontrolledTermID.toString()) {
                    getId = option.shortValue
                }
            });
            return getId;
        }

        const getElemsArr = (objCategory, ObjName) => {
            var tempObj = {};
            tempObj["ObjectCategory"] = getCategoryFunc(objCategory);
            tempObj["ObjectName"] = ObjName;
            getElems.push(tempObj);
        }

        const getCondElems = (elem) => {
            var checkElemsCategory = [];
            getElems.map(function (value, key) {
                if (elem.length !== 0) {
                    if (elem[0].objectCategoryText !== undefined) {
                        if (getElems[key].ObjectCategory === elem[0].objectCategoryText) {
                            checkElemsCategory.push(getElems[key].ObjectName);
                        }
                    }
                }

            });
            for (var i = 0; i < checkElemsCategory.length; i++) {
                for (var j = 0; j < elem.length; j++) {
                    if (elem[j].objectDisplayName === checkElemsCategory[i]) {
                        elem.splice(j, 1);
                    }
                }
            }

            var nodes;
            return nodes = elem.map(function (x) {
                return (
                    <Option name="Object Name_Option" key={x.uiElementID}>
                        {x.objectDisplayName}
                    </Option>
                )
            });

        }

        const formItems = keys.map((k, index) => {
            return (
                <Row gutter={16} key={k}>
                    <Col key={'objectCategoryCol' + k} span={this.state.roleID > 9 ? 6 : 8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('objectCategorySelectItem' + k, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    message: "Object Category should be selected"
                                }],
                                initialValue: k < permissions.length ? permissions[k].objectCategoryID.toString() : [],
                            })(
                                <Select
                                    showSearch
                                    placeholder=" Select Object Category"
                                    disabled={k < permissions.length }
                                    onChange={() => this.onObjectCategoryChange(k)}
                                    key={'objectCategorySelect' + k}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    aria-name="Object Category"
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
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    message: "Object Name should be selected",
                                }],
                                initialValue: k < permissions.length && getFieldValue('objectCategorySelectItem' + k) === permissions[k].objectCategoryID.toString() ? permissions[k].objectDisplayName.toString() : [],
                            })(
                                <Select
                                    disabled={(k < permissions.length ) || (getFieldValue('objectCategorySelectItem' + k) === undefined || getFieldValue('objectCategorySelectItem' + k) == "")}
                                    placeholder=" Select Object Name"
                                    key={'objectNameSelect' + k}
                                    onSelect={this.onObjectNameChange}
                                    aria-name="Object Name"
                                >
                                    {
                                        getFieldValue('objectCategorySelectItem' + k) !== undefined && getFieldValue('objectCategorySelectItem' + k).length !== 0 ? (dropDownConfigFlag === true && onCategoryClick === true ? (getCondElems(objectName[getFieldValue('objectCategorySelectItem' + k)])) : (objectName[getFieldValue('objectCategorySelectItem' + k)] || []).map(function (option) {
                                            return (
                                                <Option name="Object Name_Option" key={option.uiElementID}>
                                                    {option.objectDisplayName}
                                                </Option>
                                            )
                                        })) : ("")

                                    }
                                </Select>

                                )}
                            {dropDownConfigFlag === true ? null : (getElemsArr(getFieldValue('objectCategorySelectItem' + k), getFieldValue('objectNameSelectItem' + k)))}

                        </FormItem>
                    </Col>
                    <Col key={'permissionLevelCol' + k} span={8} style={this.state.roleID > 9 ? null : { 'paddingRight': '16px' }}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('permissionLevelSelectItem' + k, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    message: "Permission Level should be selected",
                                }],
                                initialValue: k < permissions.length && getFieldValue('objectCategorySelectItem' + k) === permissions[k].objectCategoryID.toString() ? permissions[k].permissionLevelID.toString() : [],
                            })(
                                <Select aria-name="Permission Level" disabled={k < permissions.length && k != editIndex} key={'permissionLevelSelect' + k} placeholder="Select Permission Level">
                                    {permissionLevel.map(function (option) {
                                        return (
                                            <Option name="Permission Level_Option" key={option.productcontrolledTermID}>
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
                                <Col span={2}>
                                    <div style={iconCenter}>
                                        {perLevel >= 2 && this.state.roleID > 9 ? <ButtonWithToolTip
                                            name={permissions[k].objectCategoryText + "_" + permissions[k].objectDisplayName + "_Edit"}
                                            tabIndex="0"
                                            tooltip="Edit"
                                            shape="circle"
                                            classname="ion-edit"
                                            size="small"
                                            style={{ fontSize: '14px', marginLeft: 5 }}
                                            onClick={() => this.editPermission(k)}
                                            disabled={this.props.roleStatusID === 6}
                                        /> : null}
                                        {perLevel >= 4 && this.state.roleID > 9 ? <ButtonWithToolTip
                                            name={permissions[k].objectCategoryText + "_" + permissions[k].objectDisplayName + "_Delete"}
                                            tabIndex="0"
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="ion-android-delete"
                                            size="small"
                                            style={{ fontSize: '14px', color: '#FF0000', marginLeft: 5 }}
                                            onClick={() => this.showDeleteModal(k)}
                                            disabled={this.props.roleStatusID === 6}
                                        /> : null}
                                    </div>
                                </Col>) :
                            (<Col key={'actionsCol' + k} span={2}>
                                <div style={iconCenter}>
                                    <ButtonWithToolTip
                                        name="Permission_Save"
                                        tabIndex="0"
                                        tooltip="Save"
                                        shape="circle"
                                        classname="icon ion-checkmark"
                                        size="small"
                                        style={{ fontSize: '14px', marginLeft: 5, color: "green" }}
                                        onClick={() => this.handleSubmit(k)}
                                        disabled={this.props.roleStatusID === 6}
                                    />
                                    {
                                        k != editIndex && !newAdded ? (<ButtonWithToolTip
                                            name={permissions[k].objectCategoryText + "_" + permissions[k].objectDisplayName + "_Delete"}
                                            tabIndex="0"
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="ion-android-delete"
                                            size="small"
                                            style={{ fontSize: '14px', marginLeft: 5, color: "#FF0000" }}
                                            onClick={() => this.remove(k)}
                                            disabled={this.props.roleStatusID === 6}
                                        />) : (<ButtonWithToolTip
                                            name="Permission_Cancel"
                                            tabIndex="0"
                                            tooltip="Cancel"
                                            shape="circle"
                                            classname="ion-close-round"
                                            size="small"
                                            style={{ fontSize: '14px', marginLeft: 5, color: "#FF0000" }}
                                            onClick={() => this.cancelPermission(k)}
                                        />)
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
                title={"Permissions"}
                style={{ top: 20 }}
                onCancel={this.state.disableBtn ? null : this.modalCancel}
                width={'90%'}
                maskClosable={false}
                footer={
                    [
                        <span style={{ float: "left" }}>Showing list of records:{this.state.permissions && this.state.permissions.length}</span>,

                        perLevel >= 3 && this.state.roleID > 9 ? <Button key="submit" name="Add" disabled={this.state.editIndex >= 0 || this.state.newAdded || this.props.roleStatusID === 6} type="primary" size="large" onClick={this.add}>
                            Add Permissions
                    </Button> : <div style={{ height: "32px" }}></div>,

                    ]
                }
               
            >

                <Spin indicator={antIcon} spinning={this.state.loading}>
                    {uuid != 0 && topRow}

                    {uuid == 0 && <div style={msgCenter}>
                        {displays && <span></span>}
                        {!displays && <span>No Permission Yet</span>}
                    </div>}
                    <div id="permission-wrapper" style={{ maxHeight: "calc(100vh - 210px)", overflowX: "hidden" }}>
                        <Form style={{ marginTop: 16 }} onSubmit={this.handleSubmit}>
                            {formItems}
                            {(this.state.actionName == "edit") && (this.state.showEditModal) ? <ConfirmModal loading={this.state.modalLoad} title="Update Permissions" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> :
                                (this.state.actionName == "delete") && (this.state.showDeleteModal) ? <ConfirmModal loading={this.state.modalLoad} title="Delete Permissions" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> : ""
                            }
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(PermissionModal);

export default WrappedApp;