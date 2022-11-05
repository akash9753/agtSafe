import React, { Component } from 'react';
import LayoutContent from '../../components/utility/layoutContent';
import { Form, Modal, Steps, Row, Col, TreeSelect, Spin, Icon } from 'antd';
import { formHTML, genLeftFormItems } from './htmlUtility';
import Button from '../../components/uielements/button';
import SharedDirTree from '../Utility/sharedDirTree';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { getAddButtonText, getSaveButtonText } from './sharedUtility';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const TreeNode = TreeSelect.TreeNode;
const Step = Steps.Step;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;


var thisObj;
export default class WizardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            folderModalVisible: false,
            attributeName: "",
            loading: true
        };
        thisObj = this;
    }
    next(fieldNames) {
        this.props.validateFields(fieldNames, { force: true }, (err, values) => {
            if (!err) {
                const current = this.state.current + 1;
                this.setState({ current });
            }
        });
    }
    handleSubmit = () => {
        const saveCallBack = this.props.saveCallBack;
        this.props.validateFields((err, values) => {
            if (!err) {
                //console.log(values);
                saveCallBack(values);
            }
        });
    }
    handleClear = (value, whichStep, isTableClear) => {
        thisObj.props.property.props.form.resetFields(value);

        //For creatstudy tableclear
        if (whichStep === 3 || whichStep === 2) {
            if (isTableClear) {

                thisObj.props.property.additionalClear(whichStep);
            }
        }
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    onTreeChange = (value) => {
        //console.log('onChange ', value, arguments);
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
    createFormWithSteps = (formData, wizardData, selectData, getFieldDecorator, setFieldsValue, showFileDialog, treeData) => {
        if (typeof treeData === 'undefined' || treeData === null) {
            treeData = [];
        }
        if (wizardData !== null && Object.keys(wizardData).length > 0) { // Create Form wizard
            const wizardLength = Object.keys(wizardData).length;
            let steps = [];
            const treeArr = treeData;

            const loop = data =>
                data.map(item => {
                    if (item.children) {
                        return (
                            <TreeNode selectable={false} key={item.key} value={item.key} title={item.title}>
                                {loop(item.children)}
                            </TreeNode>
                        );
                    }
                    return <TreeNode key={item.key} value={item.key} title={item.title} />;
                });

            const folderLoop = data =>
                data.map(item => {
                    if (item.children) {
                        return (
                            <TreeNode selectable={item.children !== null} key={item.key} value={item.key} title={item.title}>
                                {folderLoop(item.children)}
                            </TreeNode>
                        );
                    }
                    return <TreeNode selectable={item.children !== null} key={item.key} value={item.key} title={item.title} />;
                });
            let allData = {
                selectOptions: selectData,
                getFieldDecorator: getFieldDecorator,
                setFieldsValue: setFieldsValue,
                showFileDialog: showFileDialog,
                onTreeChange: this.onTreeChange,
                treeData: (Object.keys(treeArr).length === 2) ? {
                    Location: loop([treeArr["Location"]]), Document: loop([treeArr["Document"]])
                }:loop([treeArr]),
                folderTreeData: (Object.keys(treeArr).length === 2) ? {
                    Location: folderLoop([treeArr["Location"]]), Document: folderLoop([treeArr["Document"]])
                } : folderLoop([treeArr]),
                treeDefaultExpandedKeys: treeData.key,
                props:this.props
            };
 

            wizardData.map(function (wizard) {
           
                allData["formData"] = formData.filter(formField => formField.wizardID === wizard.wizardID);
                let fieldNames = allData["formData"].map(function (field) {
                    return field.attributeName;
                });

                const html = formHTML(allData);
                let splitClass = 12;
                if (html.left.length === 0 || html.right.length === 0) {
                    splitClass = 24;
                }
                let wizardData = (
                    (html.left.length !== 0) &&
                    <div>
                        {html.left.map(function (field, index) {
                            return (
                                <Row style={rowStyle} >
                                    <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                        <Row>
                                            {html.left[index]}
                                        </Row>
                                    </Col>
                                    <Col md={splitClass} sm={24} xs={24} id={wizard.wizardName + "Right"}  >
                                        <Row>
                                            {html.right[index]}
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        })}
                    </div>
                    );

                steps.push({ title: wizard.wizardName, content: wizardData, fieldNames: fieldNames });
            });
            return steps;
        } else { // Create Form without wizard
            return {};
        }
    }
    //on Handle Cancel Form Will Resetted into Initial step
    getFormInitialStep() {
        this.setState({ current: 0 });
    }

    componentDidMount() {

        setTimeout(
            function () {
                this.setState({ loading: false });
            }
                .bind(this),
            200
        );
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props.property.props);
    }

    render() {
        const { current } = this.state;
        const { responseData, getFieldDecorator, setFieldsValue, update, isCreate, property, isTableClear } = this.props;
        const steps = this.createFormWithSteps(responseData.formData, responseData.wizardData, responseData.selectOptions, getFieldDecorator, setFieldsValue, this.showFileDialog, responseData.folderTree);
        

        return (
          
            <LayoutContent>
                <Spin indicator={antIcon} spinning={this.state.loading}>
                <SharedDirTree visible={this.state.folderModalVisible} handleCancel={this.closeFileDialog} callback={this.setFile} setFieldsValue={setFieldsValue} />
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <Form layout="vertical">

                    <div style={{ marginTop: 16 }} className="steps-content">
                        {
                            steps.map(({ title, content }, i) => (
                            <div
                                key={title}
                                style={{ display: i === this.state.current ? '' : 'none' }}
                            >
                                {content}
                            </div>
                            ))}
                    </div>

                    </Form>
                    <Row  justify="end">
                    <div className="steps-action" style={{ float: 'left' }}>
              
                        <Button name="Cancel" tabIndex="0" type="danger" style={{ marginRight: 10, float: "left" }} onClick={() => { this.props.handleReset !== null && this.props.handleReset(); this.props.handleCancel(); }}> Cancel </Button>
                        {isCreate ?

                                <Button name="Clear" tabIndex="0" type="default" onClick={() => this.handleClear(steps[current].fieldNames, current, isTableClear)} > Clear </Button>
                            : ""}
                        </div>

                        <div className="steps-action" style={{ float: 'right' }}>
                        {
                            this.state.current > 0
                            &&
                                <Button name="Previous" tabIndex="0" style={{ marginRight: 8 }} className="ant-btn-primary" onClick={() => this.prev()}>
                                Previous
                            </Button>
                        }
                        {
                                this.state.current < steps.length - 1
                                &&
                                <Button name="Next" tabIndex="0" type="primary" onClick={() => this.next(steps[current].fieldNames)}>Next</Button>
                        }
                        {
                                this.state.current === steps.length - 1
                            &&
                            //    checkPermission(this.props.permissions, ["self"]) >= 2
                            //&&

                                <Button name={isCreate ? getAddButtonText() : getSaveButtonText()} tabIndex="0" type="primary" className="saveBtn" onClick={() => (update === 1 ? this.props.saveCallBack() : this.handleSubmit())}>{isCreate ? getAddButtonText() : getSaveButtonText()}</Button>
                        }

                        </div>
                    </Row>
                </Spin>
                </LayoutContent>
        );
    }
}