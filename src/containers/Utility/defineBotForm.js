import React, { Component } from 'react';
import { Col, Row, Select, Form, TreeSelect, Icon, Tooltip, BackTop } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { genRightFormItems, genLeftFormItems } from './defineBotHtmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { definePermission } from '../Utility/sharedUtility';

const TreeNode = TreeSelect.TreeNode;
var thisObj;
export default class SingleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: true,
            editBtn: props.readOnly
        };
        thisObj = this;
    }
    handleClear = () => {
        thisObj.props.props.props.form.resetFields();
        thisObj.props.props.setState({});
    }
    handleCancel = () => {
        document.getElementById("backBtn").disabled = true;
        thisObj.props.handleCancel();
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

    componentWillReceiveProps(nextProps) {
        this.setState({ editBtn: nextProps.readOnly });
    }

    createForm = (formData, selectData, getFieldDecorator, setFieldsValue, showFileDialog, treeData,wflow) => {
        if (typeof treeData == 'undefined' || treeData == null) {
            treeData = [];
        }
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
            props: this.props.props,
            disabled: this.state.editBtn,
            wflow:wflow
        };


        rowDetails =
            (
                <Row style={rowStyle} >
                    <Col md={12} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                        {genRightFormItems(allData)}
                    </Col>

                    <Col md={12} sm={24} xs={24}>
                        {genLeftFormItems(allData)}
                    </Col>
                </Row>
            );

        return rowDetails;

    }

    componentDidUpdate() {
        errorMessageTooltip(this.props.property != undefined ? this.props.property.props : this.props.props.props);
    }
    
    render() {        
        var { responseData, getFieldDecorator, setFieldsValue, editForm, isCreate, defineActivityWorkflowStatus } = this.props;
        var { editBtn } = this.state
        var content = this.createForm(responseData.formData, responseData.selectOptions, getFieldDecorator, setFieldsValue, this.showFileDialog, responseData.folderTree, defineActivityWorkflowStatus);
        var editButton = <Button type="primary" name="Edit" disabled={defineActivityWorkflowStatus && !definePermission(defineActivityWorkflowStatus)} className="editBtn" onClick={this.props.ReadOnlyToSave} style={{ float: "right", marginTop: "10px" }}>Edit</Button>
        var saveBtn = <Button type="primary" name="Save" disabled={defineActivityWorkflowStatus && !definePermission(defineActivityWorkflowStatus)} className="saveBtn" onClick={this.props.handleSubmit} style={{ float: "right", marginTop: "10px" }}>Save</Button>

        var backBtn = <Button id="backBtn" className="ant-btn-danger" name="Back" style={{ marginRight: 10, marginTop: "5px", float: "left" }} onClick={this.props.handleCancel}>
            Back
        </Button>

        //var cancelBtn = <Button type="danger" style={{ marginRight: 20, float: "left" }} onClick={this.props.SaveToReadOnly}> Cancel </Button>
        const Clear = <Button type="default" style={{ marginRight: 10, float: "left" }} onClick={() => this.handleClear()}> Clear </Button>

        return (
            <Form layout="vertical" style={{ display: "flex", flexDirection: "column", height: "100%" }}>

                <LayoutContent id="middleDiv" style={{ height: "100%", overflow: "auto", marginLeft:"-4px" }}>
                        <div>
                            {content}
                        </div>

                    </LayoutContent>
                       {
                        (this.props.handleCancel || this.props.handleSubmit)?
                        <LayoutContent style={{height:"auto",marginTop: "10px"}}>
                        
                                {
                                 this.props.handleCancel && backBtn
                                }
                                {
                                    false ? Clear : ""
                                }
                            {
                                (editBtn && !JSON.parse(sessionStorage.projectStudyLockStatus))? editButton:""
                                }
                                {
                                //!editBtn && (this.props.SaveToReadOnly != undefined) && cancelBtn
                                }
                                {
                                    !editBtn && this.props.handleSubmit != null && saveBtn
                                }
                               
                        
                       </LayoutContent>:""

                    }
                </Form>
        );
    }
}



