import React, { Component } from 'react';
import { Input, Select, Col, Row, Form, Modal, Popconfirm, Icon, AutoComplete, Spin } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import { checkSelect } from '../Utility/validator';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const FormItem = Form.Item;

let uuid = 0;
let keys = [];
let deleteIndex = -1;
const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };
const iconCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold', marginTop: 5 };
const msgCenter = { textAlign: 'center', color: '#788195', fontSize: 20, fontWeight: 'bold', marginTop: 25 };

class PyArguments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pyArguments: this.props.pyArgs,
            newAdded: false,
            editIndex: -1,
            deleteIndex: -1,
            loading: !this.props.viewOnly,
            modalLoad: false,
            actionName: "",
            allValues: {},
            popvisible: false,
            argSuggestions: {},
            nameDataSource: [],
            descDataSource: [],
            selectedArgs: [],
            selectedFlag: false
        };
        if (!this.props.viewOnly) {
            this.getPyArguments();
        }

    }

    getPyArguments = () => {
        const thisObj = this;
        CallServerPost('PyTemplate/GetPyArguments', {})
            .then(
                function (response) {
                    if (response.status == 1) {
                        response.value.map(function (argSuggest) {
                            if (argSuggest.name == "name") {
                                thisObj.state.nameDataSource.push(argSuggest.value);
                            } else if (argSuggest.name == "desc") {
                                thisObj.state.descDataSource.push(argSuggest.value);
                            }
                        });

                        for (var i = 0; i < thisObj.state.pyArguments.length; i++) {
                            thisObj.state.selectedArgs.push(thisObj.state.pyArguments[i].name)
                        }

                    }
                    thisObj.setState({ loading: false, selectedFlag: true });

                });
    }


    showDeleteModal = (index) => {
        deleteIndex = index;
        this.setState({ popvisible: true });
    }
    editUserAssign = (index) => {
        this.setState({ editIndex: index });
    }
    cancelUserAssign = (index) => {
     //   keys = keys.filter(key => key !== index);
       // uuid--;
        this.setState({ editIndex: -1, newAdded: false });
    }

    remove = (k) => {
        keys = keys.filter(key => key !== k);
        uuid--;
        this.setState({ newAdded: false });
        this.props.form.resetFields();
    }

    confirmDelete = (k) => {
      keys.pop();

        uuid--;
        var pyArguments = [];
        for (var i = 0; i < this.state.pyArguments.length; i++) {
            if (i !== k) {
                pyArguments.push(this.state.pyArguments[i]);
            }
        }
        this.setState({ popvisible: false, pyArguments: pyArguments });
        // this.props.form.resetFields();
    }

    cancelDelete = () => {
        deleteIndex = -1;
        this.setState({ popvisible: false });
    }


    add = () => {
        keys = keys.concat(uuid);
        uuid++;
        this.setState({ newAdded: true });
    }

    handleSubmit = (k) => {
        const thisObj = this;
        thisObj.props.form.validateFields(["argumentNameItem" + k, "typeItem" + k, "descriptionItem" + k], { force: true }, (err, values) => {
            if (!err) {
                if (this.state.editIndex > -1) {
                    var editIndexNow = this.state.editIndex;
                    this.state.pyArguments[editIndexNow].name = values["argumentNameItem" + editIndexNow];
                    this.state.pyArguments[editIndexNow].type = values["typeItem" + editIndexNow];
                    this.state.pyArguments[editIndexNow].desc = values["descriptionItem" + editIndexNow];
                } else {
                    var editIndexNow = this.state.pyArguments.length;
                    this.state.pyArguments.push({ name: values["argumentNameItem" + editIndexNow], type: values["typeItem" + editIndexNow], desc: values["descriptionItem" + editIndexNow] });
                }

                this.reloadModal();
            }
        });
    }

    handleCancel = () => {
        this.reloadModal();
        this.props.handleCancel(this.state.pyArguments);
    }

    reloadModal = () => {
        if (this.state.pyArguments.length === keys.length) {
            uuid = 0;
            keys = [];
        }
        // this.setState({ pyArguments: null, editIndex: -1, newAdded: false, deleteIndex: -1 });
        this.setState({ editIndex: -1, newAdded: false, deleteIndex: -1 });
    }


    fnToValidateArgumentName = (rule, value, callback) => {
        var thisObj = this;
        if (thisObj.state.selectedArgs.indexOf(value) === -1) {
            thisObj.state.selectedArgs.push(value);
        }
        for (var i = 0; i < thisObj.state.pyArguments.length; i++) {
            if (thisObj.state.pyArguments[i].name === value && document.getElementById(rule.field).className.includes('ant-select-enabled') && thisObj.state.editIndex !== i) {
                rule.message = "Argument Name already added!";
                callback('');
                return;
            }
        }

        callback();

    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { editIndex, newAdded, descDataSource, nameDataSource, pyArguments, selectedFlag, selectedArgs } = this.state;
        //const selectedNames = getFieldValue("");
        const filteredNameDataSrcs = () => {
            const tempArr = [...nameDataSource];
            for (var i = 0; i < pyArguments.length; i++) {
                for (var j = 0; j < tempArr.length; j++) {
                    if (tempArr[j] === pyArguments[i].name) {
                        tempArr.splice(j, 1);
                    }
                }
            }

            return tempArr;
        };

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
                    {!this.props.viewOnly && <span style={{ color: 'red' }}>*</span>}
                    <span>Name</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    {!this.props.viewOnly && <span style={{ color: 'red' }}>*</span>}
                    <span>Type</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    { !this.props.viewOnly && <span style={{ color: 'red' }}>*</span>}
                    <span>Description</span>
                </div>
            </Col>
            {
                !this.props.viewOnly &&
                <Col span={2}>
                    <div style={divCenter}>
                        <span>Actions</span>
                    </div>
                </Col>
            }

        </Row>);
        if (pyArguments != null && uuid == 0) {
            for (var i = 0; i < pyArguments.length; i++) {
                keys.push(i);
                uuid++;
            }
        }

        //getFieldDecorator('keys', { initialValue: initvalues });
        // const keys = getFieldValue('keys');
        var deafultOption = [(<Option disabled key="--Select--" >--Select--</Option>)];



        // projectOptions = deafultOption.concat(projectOptions);
        const formItems = pyArguments != null && keys.map((k, index) => {
            return (
                <Row gutter={16} key={k}>
                    <Col key={'argumentCol' + k} span={6}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('argumentNameItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Argument Name is mandatory",
                                },
                                {
                                    validator: this.fnToValidateArgumentName
                                }
                                ],
                                initialValue: k < pyArguments.length ? pyArguments[k].name : "",
                            })(
                                <AutoComplete
                                    dataSource={selectedFlag === true ? filteredNameDataSrcs() : []}
                                    tabIndex="0"
                                    placeholder="Argument Name"
                                    disabled={k < pyArguments.length && k != editIndex}
                                key={'argumentNameSelect' + k}
                                
                                />
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'typeCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('typeItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Type should be selected",
                                }],
                                initialValue: k < pyArguments.length ? pyArguments[k].type : "",
                            })(
                                <Select tabIndex="0" disabled={(k < pyArguments.length && k != editIndex) || getFieldValue('typeItem' + k) == "--Select--"} placeholder="Select Type" key={'typeSelect' + k}>
                                    {
                                        this.props.argTypes.map(function (option) {
                                            return (
                                                <Option key={option["shortValue"]}>
                                                    {option["shortValue"]}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'rolesCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('descriptionItem' + k, {

                                rules: [{
                                    required: true,
                                    message: "Description is mandatory",
                                }],
                                                            
                                initialValue: k < pyArguments.length ? pyArguments[k].desc : "",
                            })(
                                <Input disabled={k < pyArguments.length && k != editIndex} />

                            )}

                        </FormItem>
                    </Col>
                    {

                        this.props.viewOnly ? "" : k < pyArguments.length && k != editIndex ?
                            (<Col>
                                <div style={iconCenter}>
                                    <ButtonWithToolTip
                                        tabIndex="0"
                                        tooltip="Edit"
                                        shape="circle"
                                        classname="ion-edit"
                                        size="small"
                                        style={{ fontSize: '14px', marginLeft: 5 }}
                                        onClick={() => this.editUserAssign(k)}
                                    />
                                    <Popconfirm
                                        title="Are you sure?"
                                        visible={this.state.popvisible && k == deleteIndex}
                                        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                        onConfirm={() => this.confirmDelete(k)}
                                        onCancel={this.cancelDelete}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <ButtonWithToolTip
                                            tabIndex="0"
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="ion-android-delete"
                                            size="small"
                                            style={{ fontSize: '14px', color: '#FF0000', marginLeft: 5 }}
                                            onClick={() => this.showDeleteModal(k)}
                                        />

                                    </Popconfirm>
                                </div>
                            </Col>) :
                            (<Col key={'actionsCol' + k} span={2}>
                                <div style={iconCenter}>

                                    <ButtonWithToolTip
                                        tabIndex="0"
                                        tooltip="Save"
                                        shape="circle"
                                        classname="icon ion-checkmark"
                                        size="small"
                                        style={{ fontSize: '14px', color: "green" }}
                                        onClick={() => this.handleSubmit(k)}
                                    />


                                    {
                                        k != editIndex && !newAdded ? (


                                            <ButtonWithToolTip
                                                tabIndex="0"
                                                tooltip="Delete"
                                                shape="circle"
                                                classname="ion-android-delete"
                                                size="small"
                                                style={{ fontSize: '14px', marginLeft: 5, color: "#FF0000" }}
                                                onClick={() => this.remove(k)}
                                            />) : (
                                                <ButtonWithToolTip
                                                    tabIndex="0"
                                                    tooltip="Cancel"
                                                    shape="circle"
                                                    classname="ion-close-round"
                                                    size="small"
                                                    style={{ fontSize: '14px', marginLeft: 5, color: "#FF0000" }}
                                                    onClick={() => this.cancelUserAssign(k)}
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
                title={"Python Template Arguments"}
                style={{ top: 20 }}
                onCancel={this.state.loading ? null : this.handleCancel}
                width={'80%'}
                maskClosable={false}
                footer={[
                    <div>
                        {
                            !this.props.viewOnly &&
                            <Button key="submit" disabled={this.state.editIndex >= 0 || this.state.newAdded || (this.state.loading ? true : false)} type="primary" size="large" onClick={this.add}>
                                Add New Argument
                            </Button>
                        }

                        {
                            pyArguments.length > 0 &&
                            <Button disabled={this.state.editIndex >= 0 || this.state.newAdded || (this.state.loading ? true : false)} key="done" type="primary" onClick={this.handleCancel}>
                                Done
                                </Button>
                        }

                    </div>,
                ]}
            >
                <Spin indicator={antIcon} spinning={this.state.loading}>
                    {uuid != 0 && topRow}

                    {uuid == 0 && <div style={msgCenter}>
                        <span>No Arguments Added yet!</span>
                    </div>}

                    <Form style={{ marginTop: 16 }} onSubmit={this.handleSubmit}>
                        {formItems}
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(PyArguments);
export default WrappedApp;