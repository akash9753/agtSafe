import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import { checkSelect } from '../Utility/validator';
import { Icon, Spin, Form, Breadcrumb, Input, Button, Select, Col, Row, Modal } from 'antd';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';


const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const { Option } = Select;
const splitClass = 5;
const FormItem = Form.Item;

var thisObj;


class ViewsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
        };
        thisObj = this;

    }
    viewNCICodeList = () => {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ loading: true });
                CallServerPost('NCICodeList/ViewNCICodeList', {
                    NCICodeListID: thisObj.props.nCICodeListID, FieldName: thisObj.props.form.getFieldValue("FieldName"),
                    Value: thisObj.props.form.getFieldValue("Value"), Condition: thisObj.props.form.getFieldValue("Condition")
                })
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                if (response.value !== null) {
                                    var nCICodelistdata = response.value;
                                    nCICodelistdata.map(function (val) {
                                        if (val.extensible) {
                                            val.extensible = "Yes";
                                        } else if (!val.extensible) {
                                            val.extensible = "No";
                                        }
                                        //group
                                        if (val.group) {
                                            val.group = "Yes";
                                        }
                                        else if (!val.group) {
                                            val.group = "";
                                        }
                                    });
                                    thisObj.setState({ dataSource: nCICodelistdata, loading: false });
                                }
                            } else {
                                errorModal(response.message);
                                thisObj.setState({ loading: false });
                            }
                        }).catch(error => error);
            }
        });
    }

    clearFields = () => {
        thisObj.props.form.resetFields();
        this.setState({ dataSource: "" })
    }

    onChange = () => {
        thisObj.props.form.resetFields(["Value","Condition"]);
    }

    render() {

        const columns = [
            {
                title: 'NCICodelistCode',
                dataIndex: 'nciCodelistCode',
                key: 'nciCodelistCode',
                width: 110
            },
            {
                title: 'Group Code',
                dataIndex: 'code',
                key: 'code',
                width: 80
            },
            {
                title: 'Extensible',
                dataIndex: 'extensible',
                key: 'extensible',
                width: 85
            },
            {
                title: 'CodeListName',
                dataIndex: 'codelistName',
                key: 'codelistName',
                width: 110
            },
            {
                title: 'CDISCSubmission Value',
                dataIndex: 'cdiscSubmissionValue',
                key: 'cdiscSubmissionValue',
                width: 130
            },
            {
                title: 'CDISCSynonym',
                dataIndex: 'cdiscSynonym',
                key: 'cdiscSynonym',
                width: 115
            },
            {
                title: 'CDISCDefinition',
                dataIndex: 'cdiscDefinition',
                key: 'cdiscDefinition',
                width: 120
            },
            {
                title: 'NCIPreferredTerm',
                dataIndex: 'nciPreferredTerm',
                key: 'nciPreferredTerm',
                width: 130
            },
            {
                title: 'Group',
                dataIndex: 'group',
                key: 'group',
                width: 90
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                {/*<Breadcrumb>*/}
                {/*    <Breadcrumb.Item>*/}
                {/*        <i className="fas fa-list-ul" />*/}
                {/*        <span> NCI Codelist</span>*/}
                {/*    </Breadcrumb.Item>*/}
                {/*    <Breadcrumb.Item>*/}
                {/*        View*/}
                {/*    </Breadcrumb.Item>*/}
                {/*</Breadcrumb>*/}

                <Modal
                    visible={this.props.visible}
                    maskClosable={false}
                    title={"NCI Codelist View"}
                    style={{ top: 20 }}
                    width={'90%'}
                    onCancel={this.props.cancelView}
                    footer={[
                    ]}
                >

                <LayoutContent style={{ height:"calc(100% - 450px)" }}>

                    <Spin indicator={antIcon} spinning={this.state.loading}>
                        <Form layout="vertical" style={{ paddingBottom: 15 }}>
                            <Row style={rowStyle} >
                                <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>

                                    <FormItem
                                        label="Field Name"
                                    >{
                                            getFieldDecorator("FieldName", {

                                                rules: [{
                                                    required: true,
                                                    message: 'Field Name should be selected'
                                                }, { validator: checkSelect, message: "Field Name should be selected" }],
                                                initialValue:"--Select--",
                                            })(
                                                <Select
                                                    onChange={this.onChange}      >
                                                    <Option value="--Select--" >--Select--</Option>
                                                    <Option value="Code">Group Code</Option>
                                                    <Option value="CodelistName">CodelistName</Option>
                                                    <Option value="CDISCSubmissionValue">CDISCSubmission Value</Option>
                                                    <Option value="NCICodelistCode">CodelistCode</Option>
                                                </Select>

                                            )}
                                    </FormItem>


                                </Col>
                                <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>


                                    <FormItem
                                        label="Condition"
                                    >{
                                            getFieldDecorator("Condition", {

                                                rules: [{
                                                    required: true,
                                                    message: 'Condition should be selected',
                                                }, { validator: checkSelect, message: "Condition should be selected" }], initialValue: "--Select--",
                                            })(
                                                <Select>
                                                    <Option value="--Select--" >--Select--</Option>
                                                    <Option value="Equal">Equal</Option>
                                                    <Option value="Contains">Contains</Option>

                                                </Select>
                                            )}
                                    </FormItem>

                                </Col>
                                <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>
                                    <FormItem
                                        label="Value"
                                    >{
                                            getFieldDecorator("Value", {

                                                rules: [{
                                                    required: true,
                                                    message: 'Value is mandatory',
                                                }]
                                            })(
                                                <Input />)}
                                    </FormItem>

                                </Col>
                                

                                    <Button type="primary" onClick={this.viewNCICodeList} style={{ marginTop: "32px" }}>Search</Button>
                                     <Button type="default" onClick={this.clearFields} style={{ marginLeft:"10px", marginTop: "32px" }}>Clear</Button>

                                
                                
                            </Row>
                        </Form>
                    </Spin>
                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        scroll={{ y: "calc(100vh - 450px)" }}
                        />
                </LayoutContent>

                <div style={{ paddingTop: 20 }}>

                    <Button type="danger" onClick={() => this.props.cancelView()}> Back</Button>
                    </div>
                </Modal>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(ViewsList);
export default WrappedApp;

