import React, { Component } from 'react';
import { Col, Row, Select, Form, TreeSelect, Icon, Spin } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { formHTML } from './htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { checkPermission, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';


const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
export function clear() {
    thisObj.handleClear();
}

export default class SingleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        thisObj = this;
    }

    onTreeChange = (value) => {
        this.setState({ value });
    }
    setFile = (file) => {
        const attributeName = this.state.attributeName;
        let data = {};
        data[attributeName] = file.eventKey;
        this.props.setFieldsValue(data);
        this.closeFileDialog();
    }
    showFileDialog = (attributeName) => {
        this.setState({ folderModalVisible: true, attributeName: attributeName });
    }
    closeFileDialog = () => {
        this.setState({ folderModalVisible: false });
    }
    handleClear = () => {        
        thisObj.props.property.props.form.resetFields();
        if (thisObj.props.handleClear !== undefined) {
            thisObj.props.handleClear();
        }
    }
    createForm = (formData, selectData, getFieldDecorator, setFieldsValue, showFileDialog, treeData, responseDatas) => {
        if (typeof treeData == 'undefined' || treeData == null) {
            treeData = [];
        }

        const userRoleDetail = JSON.parse(sessionStorage.getItem("role"));
        const projectstatusid = JSON.parse(sessionStorage.getItem("studydetails"));


        var rowDetails = [];
        const treeArr = [treeData];
        const loop = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode selectable={false} key={item.key} value={item.title} title={item.title}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} value={item.title} title={item.title} />;
            });
        const folderLoop = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode selectable={item.children != null} key={item.key} value={item.title} title={item.title}>
                            {folderLoop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode selectable={item.children != null} key={item.key} value={item.title} title={item.title} />;
            });
        let allData = {
            selectOptions: selectData,
            getFieldDecorator: getFieldDecorator,
            setFieldsValue: setFieldsValue,
            showFileDialog: showFileDialog,
            onTreeChange: this.onTreeChange,
            treeData: loop(treeArr),
            folderTreeData: folderLoop(treeArr),
            formData: formData,
            treeDefaultExpandedKeys: treeData.key,
            props: typeof this.props.props !== "undefined" ? this.props.props : this.props

        };
        const html = formHTML(allData);
        
        let splitClass = 12;
        if (html.left.length == 0 || html.right.length == 0) {
            splitClass = 24;
        }
        if (allData.props !== undefined && allData.props.responseData !== undefined && allData.props.responseData.formData !== undefined &&
            (allData.props.responseData.formData[0].formID === 100 || allData.props.responseData.formData[0].formID === 101)) {
            splitClass = 8;

            var htmlObj = null;
            Object.keys(html).map(function (htmlfield) {
                htmlObj = html[htmlfield];
                
                rowDetails =
                    (
                        (htmlObj.length !== 0) &&
                        htmlObj.map(function (field, index) {
                            return (
                                <Row style={rowStyle} >
                                    {(html.left.length !== 0) && <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                        <Row>
                                            {html.left[index]}
                                        </Row>
                                    </Col>
                                    }
                                    <Col md={splitClass} sm={24} xs={24}  >
                                        <Row> {html.center[index]} </Row>
                                    </Col>
                                    <Col md={splitClass} sm={24} xs={24}  >
                                        <Row> {html.right[index]} </Row>
                                    </Col>
                                </Row>
                            );
                        })
                    );
            });
        }
        else {
            var htmlObj = null;
            (html.left.length > html.right.length ? htmlObj = html.left : htmlObj = html.right);
            rowDetails =
                (
                    (htmlObj.length !== 0) &&
                    htmlObj.map(function (field, index) {
                        return (
                            <Row style={rowStyle} >
                                {(html.left.length !== 0) && <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                    <Row>
                                        {html.left[index]}
                                    </Row>
                                </Col>
                                }
                                <Col md={splitClass} sm={24} xs={24}  >
                                    {html.right[index] !== undefined && html.right[index] !== null ? <Row> {html.right[index]} </Row> :
                                        thisObj.props.projectUserAssignField != undefined && thisObj.props.projectUserAssignField && index === 2 ?
                                            <Row>
                                                <FormItem label="User for project manager role">
                                                    {
                                                        getFieldDecorator("UserID", {
                                                            rules: [{ required: true, message: "Users should be selected" }],
                                                            initialValue: responseDatas.userAssignList != undefined ? responseDatas.userAssignList.length > 0 ? responseDatas.userAssignList.map(obj => obj.userID.toString()) : [] : [],
                                                        })(
                                                            <Select
                                                                mode="multiple"
                                                                showSearch
                                                                style={{ width: "100%" }}
                                                                disabled={userRoleDetail.RoleID > 2 || thisObj.props.projectUserAssignFieldStatus}
                                                                optionFilterProp="children"
                                                                filterOption={(input, option) =>
                                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                placeholder="Please select users"
                                                                aria-name="UserID"
                                                            >
                                                                {responseDatas.usersList.map(function (option) {
                                                                    return (
                                                                        <Option name="UserID_Option" key={option.userID}>
                                                                            {option.userName}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        )}
                                                </FormItem>
                                            </Row> : null}
                                </Col>
                            </Row>
                        );
                    })
                );
        }
        return rowDetails;

    }
    componentDidMount() {

        setTimeout(
            function () {
                this.setState({ loading: false });
            }
                .bind(this),
            200
        );

        //for dataset validation form rule query field
        var getRuleQueryElem = document.getElementById("RuleQuery");
        if (getRuleQueryElem) {
            getRuleQueryElem.parentElement.classList.add("textarea-custom");
        }
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props.property.props);
    }
    render() {
        //console.log(this.props.projectUserAssignField);

        const { responseData, getFieldDecorator, setFieldsValue, editForm, isCreate, property, Editable } = this.props;
        const permissions = this.props.permissions;
        const content = this.createForm(responseData.formData, responseData.selectOptions, getFieldDecorator, setFieldsValue, this.showFileDialog, responseData.folderTree, responseData);
        const editBtn = Editable === false ? <Button name="Edit" type="primary" style={{ float: "right" }} className="editBtn" onClick={this.props.handleEdit} >Edit</Button> : null;
        const saveBtn = isCreate ?
            (<Button style={{ float: "right" }} name="Add" className="saveBtn" onClick={this.props.handleSubmit} >{getAddButtonText()}</Button>)
            : (Editable === false) ?
                (<Button style={{ float: "right" }} name="Save" className="saveBtn" onClick={this.props.handleSubmit} >{getSaveButtonText()}</Button>)
                :
                (null);
        const extraButton1 = this.props.extraButton1;
        const extraButton2 = this.props.extraButton2;
        const extraButton3 = this.props.extraButton3;
        const updateBtn = <Button name="Save" className="saveBtn" name="Update" style={{ float: "Right" }} onClick={this.props.handleSubmitUpdate}> Update </Button>;
        const cancelBtn = <Button type="danger" name="Cancel" style={{ marginRight: 10, float: "left" }} onClick={this.props.handleCancel}> Cancel </Button>;
        const Clear = <Button type="default" name="Clear" onClick={() => { this.handleClear(); if (this.props.handleClear !== undefined) { this.props.handleClear(); } }}> Clear </Button>;

        return (

            <LayoutContent>
                    <Form layout="vertical">
                        <div id="middleDiv" >
                            <div>
                                {content}                                
                            </div>

                        </div>
                        <div>
                            <Row >
                                {
                                    this.props.handleCancel && cancelBtn
                                }

                                {
                                    this.props.handleSubmitUpdate && updateBtn
                                }

                                {
                                    isCreate ? Clear : ""
                                }

                                {
                                    editForm != null ?
                                        (editForm ? editBtn : saveBtn)
                                        : this.props.handleSubmit != null && saveBtn
                                }
                                {
                                    extraButton2
                                }
                                {
                                    extraButton3
                                }

                            </Row>
                        </div>
                    </Form>
            </LayoutContent>
        );
    }
}



