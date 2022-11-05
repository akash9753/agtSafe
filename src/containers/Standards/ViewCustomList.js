import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import { checkSelect } from '../Utility/validator';
import { Icon, Spin, Form,  Input, Button, Select, Col, Row, Modal } from 'antd';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import EditCustomCodeList from './editCustomCodeList.js';
import ADDCustomCodeList from './addSingleCustomCodeList';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import ConfirmModal from '../Utility/ConfirmModal';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const { Option } = Select;
const splitClass = 5;
const FormItem = Form.Item;

var thisObj;
const margin = {
    margin: "0 5px 5px 0"
};

class ViewCustomList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
        };
        thisObj = this;

    }

    viewCustomCodeList = () => {
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ loading: true });
                CallServerPost('CustomCodeList/ViewCustomCodeList', {
                    CustomCodeListID: thisObj.props.customCodeListID, FieldName: thisObj.props.form.getFieldValue("FieldName"),
                    Value: thisObj.props.form.getFieldValue("Value"), Condition: thisObj.props.form.getFieldValue("Condition")
                })
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                if (response.value !== null) {
                                    var customCodelistdata = response.value;
                                    customCodelistdata.map(function (CodeList) {
                                        const customCodeList = CodeList;
                                        //extensible
                                        if (customCodeList.extensible) {
                                            customCodeList.extensible = "Yes";
                                        }
                                        else if (!customCodeList.extensible) {
                                            customCodeList.extensible = "No";
                                        }
                                        //group
                                        if (customCodeList.group) {
                                            customCodeList.group = "Yes";
                                        }
                                        else if (!customCodeList.group) {
                                            customCodeList.group = "";
                                        }

                                        customCodeList.actions = <div>
                                            <ButtonWithToolTip
                                                tooltip="Edit"
                                                shape="circle"
                                                size="small"
                                                classname="fas fa-pen"
                                                onClick={() => thisObj.editCustomCodeList(customCodeList.rowNum)}

                                            />
                                            {perLevel >= 2 /*&& nCICodeListID > 91*/ ?
                                                <ButtonWithToolTip
                                                    style={{ marginRight: 5 }}
                                                    tooltip='Delete'
                                                    shape="circle"
                                                    classname="fas fa-trash-alt"
                                                    size="small"
                                                    onClick={() => thisObj.deleteCustomCodeList(customCodeList.rowNum)}
                                                /> : ""}


                                        </div>;
                                    });
                                    thisObj.setState({ dataSource: customCodelistdata, loading: false, viewCustomList: false });
                                }
                            } else {
                                thisObj.setState({ dataSource: customCodelistdata, loading: false }, () => {
                                    errorModal(response.message);
                                });
                            }
                        }).catch(error => error);
            }
        });
    }
    cancelView = () => {
        this.setState({ viewCustomList: false });
    }

    deleteCustomCodeList = (rowNum) =>
    {
        let {  CodeListVersion } = this.props;
        let values = {};
        values["CodeListVersion"] = CodeListVersion;
        values["RowNum"] = rowNum;
        showProgress();
        PostCallWithZone('CustomCodeList/DeleteBatch', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status == 1) {

                        successModalCallback(response.message, thisObj.viewCustomCodeList);
                    }
                    else {
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    editCustomCodeList = (rowNum) =>
    {
        this.setState({ showEditModal: true, action: 'Update', rowNum: rowNum})
    }

    clearFields = () => {
        thisObj.props.form.resetFields();
        this.setState({ dataSource: "" })
    }

    FnAddCustomCodeList = () =>
    {
        this.setState({ showADDModal: true, action: 'Create' });
    }

    onChange = () => {
        thisObj.props.form.resetFields(["Value","Condition"]);
    }
    cancelEdit = () => {
        this.setState({ showAddCustomCodeListModal: false, action: "" }, this.viewCustomCodeList);
    
    }

    render() {

        const columns = [
            {
                title: 'CodelistCode',
                dataIndex: 'codelistCode',
                key: 'codelistCode',
                width: 125
            },
            {
                title: 'Code',
                dataIndex: 'code',
                key: 'code',
                width: 80
            },
            {
                title: 'Extensible',
                dataIndex: 'extensible',
                key: 'extensible',
                width: 83
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
                title: 'PreferredTerm',
                dataIndex: 'preferredTerm',
                key: 'preferredTerm',
                width: 130
            },
            {
                title: 'ShortName',
                dataIndex: 'shortName',
                key: 'shortName',
                width: 88
            },
            {
                title: 'Group',
                dataIndex: 'group',
                key: 'group',
                width: 60
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 110
            }
        ];

        const { customCodeListID, CodeListVersion} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { rowNum, showEditModal, action, showADDModal } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
               
                <Modal
                    visible={this.props.visible}
                    maskClosable={false}
                    title={"Custom Codelist View"}
                    style={{ top: 20 }}
                    width={'90%'}
                    onCancel={this.props.cancelView}
                    footer={null}
                >

                    <LayoutContent className="CustomCodelist_LayoutContent">

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
                                                    initialValue: "--Select--",
                                                })(
                                                    <Select
                                                        onChange={this.onChange}      >
                                                        <Option value="--Select--" >--Select--</Option>
                                                        <Option value="Code">Code</Option>
                                                        <Option value="CodelistName">CodelistName</Option>
                                                        <Option value="CDISCSubmissionValue">CDISCSubmission Value</Option>
                                                        <Option value="PreferredTerm">Preferred Term</Option>
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
                                    <Col style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop:"18px" }}>
                                        <Button type="primary" onClick={this.viewCustomCodeList} >Search</Button>
                                    </Col>
                                    <Col style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "18px", marginLeft: "10px" }}>
                                        <Button type="default" onClick={this.clearFields}>Clear</Button>
                                    </Col>
                                        
                                        

                                </Row>
                            </Form>
                        </Spin>
                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            addAction={checkPermission(permissions, ['self']) >= 3 ? this.FnAddCustomCodeList : null}
                            scroll={{ y: "calc(100vh - 395px)", x: columns.length * 100 }}
                        />
                        {(action == "Update") && <EditCustomCodeList
                            readOnly={checkPermission(permissions, ["self"]) <= 1}
                            visible={showEditModal}
                            cancel={this.cancelEdit}
                            rowNum={rowNum}
                            customCodeListID={customCodeListID}
                            CodeListVersion={CodeListVersion}
                          
                        />}
                        {(action == "Create") && <ADDCustomCodeList
                            readOnly={checkPermission(permissions, ["self"]) <= 1}
                            visible={showADDModal}
                            cancel={() => { this.setState({ showADDModal: false, action: "" }) }}
                            CodeListVersion={CodeListVersion}
                        />}
                        {(action == "Delete") && <ConfirmModal title="Delete Custom Codelist" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                   
                    </LayoutContent>

                    <div style={{ paddingTop: 20 }}>

                        
                        <Button type="danger" onClick={() => this.props.cancelView()}> Back</Button>
     
                    </div>
                </Modal>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(ViewCustomList);
export default WrappedApp;

