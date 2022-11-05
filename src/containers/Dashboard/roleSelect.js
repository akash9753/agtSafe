import React, { Component } from 'react';
import { Select, Modal, Button, Form, Spin, Col, Row, Icon } from 'antd';
import Input from '../../components/uielements/input';
import { checkSelect } from '../Utility/validator';
import { getConfirmButtonText, validJSON } from '../Utility/sharedUtility';
const FormItem = Form.Item;
const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let thisObj = {};
export default class RoleSelect extends Component {
    constructor(props)
    {
        super(props);

        let byLoginPage = props.byLoginPage;
        let r = props.roles;
        let p = props.projects;
        
        let selProj = [];
        if (props.byLoginPage == 0) {
            let sessionSelProj = validJSON(sessionStorage.project);
            selProj = p.find(x => x.projectID === sessionSelProj.ProjectID);
        }
        this.state = {
            loading: false,
            visible: false,
            disableBtn: false,
            roleOptions: props.byLoginPage == 1 ? [] : r[selProj.projectID].map(function (option) {
                return (
                    <Option key={option.roleID}>
                        {option.roleName}
                    </Option>
                )
            })
    }
    }
    static getDerivedStateFromProps(nextProps, currentState) {
        if (currentState.visible != nextProps.visible) {
            return {
                visible: nextProps.visible,
                loading: false 
            }
        }
    }
   // componentWillReceiveProps(nextProps) {
   //    if (this.state.visible != nextProps.visible) {
   //        this.setState({ visible: nextProps.visible, loading: false });
   //     }
   // }
    hideModal = () => {
        this.setState({ visible: false });
    }
    setProjectRole = () => {
        //this.setState({ disableBtn: true });
        this.props.setProjectRole();
    }

    onProjectChange = (value) =>
    {
       
        let { form, roles} = this.props;

        form.setFieldsValue({ 'RoleID': "--Select--" });

        this.setState({
            roleOptions: (roles[value] || []).map(function (option) {
                return (
                    <Option key={option.roleID}>
                        {option.roleName}
                    </Option>
                )
            })
        });
        
    }
    render() {
        const { loading, roleOptions } = this.state;
        const { projects, roles,getFieldDecorator, getFieldValue } = this.props;
        var deafultOption = [(<Option disabled key="--Select--" >--Select--</Option>)];
        var projectOptions = projects.map(function (option) {
            return (
                <Option key={option.projectID}>
                    {option.projectName}
                </Option>
            )
        });
        
        return (
            <Spin indicator={antIcon} spinning={this.state.loading}>
                <Modal
                    visible={this.props.visible}
                    maskClosable={false}
                    title="Project/Role Selection"
                    wrapClassName="vertical-center-modal"
                    onCancel={this.state.disableBtn ? null : this.props.handleCancel}
                    footer={[
                        <Button key="back" size="default" disabled={this.state.disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.props.handleCancel}>Cancel</Button>,
                        <Button key="submit" disabled={this.state.disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' size="default" onClick={this.setProjectRole}>
                            {getConfirmButtonText()}
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="Project"
                            >{
                                    getFieldDecorator("ProjectID", {
                                        rules: [{
                                            required: true,
                                            message: "Please Select Project"
                                        }, { validator: checkSelect, message: "Please Select Project" }],
                                        initialValue:
                                            this.props.byLoginPage == 1 ?
                                                "--Select--"
                                            : projectOptions.findIndex(x => x.projectName === sessionStorage.project.ProjectName) !== -1 ? JSON.parse(sessionStorage.project).ProjectID.toString()  : ""
                                    })(
                                        <Select
                                            showSearch
                                            style={{ width: '100%' }}
                                            onChange={this.onProjectChange}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {projectOptions}
                                        </Select>

                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="Role"
                            >{
                                    getFieldDecorator("RoleID", {
                                        rules: [{
                                            required: true,
                                            message: "Please Select Role"
                                        },
                                            { validator: checkSelect, message: roleOptions.length > 0 ? "Please Select Role" : "" }],
                                        initialValue: this.props.byLoginPage == 1 ?
                                            "--Select--" :
                                            projectOptions.findIndex(x => x.roleName === sessionStorage.role.RoleName) !== -1 ? (sessionStorage.role != null ? JSON.parse(sessionStorage.role).RoleID.toString() : "") : ""

                                    })(
                                        <Select
                                            showSearch
                                            style={{ width: '100%' }}
                                            onChange={() => this.props.onRoleChange}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Option disabled key="--Select--" >--Select--</Option>
                                            {
                                                roleOptions
                                            }
                                        </Select>

                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </Spin>
        );
    }

}