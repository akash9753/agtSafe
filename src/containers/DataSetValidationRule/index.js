import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, showProgress, hideProgress, PostCallWithZone, successModal, errorModal, successModalCallback, getProjectRole, checkPermission } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import Select, { SelectOption } from '../../components/uielements/select';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { stringSorter, intSorter } from '../Utility/htmlUtility';


const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj;

const projectRole = getProjectRole();
class DataSetValidationRule extends Component {


    constructor(props) {
        super(props);

        this.state = {
            dataSource,
            showEditModal: false,
            DataSetValidationRuleID:0,
            modalLoad: false,
        };

        thisObj = this;
        showProgress();
        CallServerPost('DataSetValidationRule/GetAllDataSetValidationRule', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const appConfigList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < appConfigList.length; i++) {
                            const appid = appConfigList[i].dataSetValidationRuleID;
                            const editCell = <div>
                                {perLevel >= 1 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editDataSetValidationRule(appid, permissions)}
                                /> : ""}
                                {perLevel >= 4 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteDataSetValidationRule(appid)}
                                /> : ""}
                            </div>;
                            datas.push({
                                key: appid,
                                cdiscDataStandardText: appConfigList[i].cdiscDataStandardText,
                                cdiscDataStdVersionText: appConfigList[i].cdiscDataStdVersionText,
                                ruleID: appConfigList[i].ruleID,
                                cdiscDataStdDomainClassText: appConfigList[i].cdiscDataStdDomainClassText,
                                ruleApplicableLevel: appConfigList[i].ruleApplicableLevel,
                                cdiscDataStdDomainMetadataText: appConfigList[i].cdiscDataStdDomainMetadataText,
                                cdiscDataStdVariableMetadataText: appConfigList[i].cdiscDataStdVariableMetadataText,
                                actions: editCell
                            });
                        }
                        allDataSource = datas;
                        thisObj.setState({ dataSource: datas, loading: false });
                    }
                    hideProgress();
                })
            .catch(error => error);
    }

    //To call edit DataSetValidationRule page
    editDataSetValidationRule = (DataSetValidationRuleID, permissions) => {
        thisObj.props.history.push({
            pathname: '/trans/CreateDataSetValidationRule',
            state: {
                DataSetValidationRuleID: DataSetValidationRuleID,
                loading: true,
                ActionName: "Update",
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }
    //To call add DataSetValidationRule page
    addDataSetValidationRule = () => {
        thisObj.props.history.push({
            pathname: '/trans/CreateDataSetValidationRule',
            state: {
                DataSetValidationRuleID: 0,
                loading: true,
                ActionName:"Create"
            }
        }
        );
    }
    deleteDataSetValidationRule = (ID) => {
        this.setState({ showModal: true, action:'Delete', DataSetValidationRuleID: ID });
    }
    handleCancel = () => {
        this.setState({ showModal: false});

    }
    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["DataSetValidationRuleID"] = thisObj.state.DataSetValidationRuleID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('DataSetValidationRule/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ modalLoad: false });
                        successModal(response.message, thisObj.props, "/trans/DataSetValidationRule");
                    } else {
                        thisObj.setState({ showModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    render() {
        const columns = [
            {
                title: 'Standard',
                dataIndex: 'cdiscDataStandardText',
                key: 'cdiscDataStandardText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStandardText'),
            },
            {
                title: 'Version',
                dataIndex: 'cdiscDataStdVersionText',
                key: 'cdiscDataStdVersionText',
                width: 100,
                sorter: (a, b) => intSorter(a, b, 'cdiscDataStdVersionText'),
            },
            {
                title: 'RuleID',
                dataIndex: 'ruleID',
                key: 'ruleID',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'ruleID'),
            },
            {
                title: 'RuleApplicableLevel',
                dataIndex: 'ruleApplicableLevel',
                key: 'ruleApplicableLevel',
                width: 110,
                sorter: (a, b) => stringSorter(a, b, 'ruleApplicableLevel'),
            },
            {
                title: 'Domain Class',
                dataIndex: 'cdiscDataStdDomainClassText',
                key: 'cdiscDataStdDomainClassText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStdDomainClassText'),
            },
            {
                title: 'Domain',
                dataIndex: 'cdiscDataStdDomainMetadataText',
                key: 'cdiscDataStdDomainMetadataText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStdDomainMetadataText'),
            },
            {                
                title: 'Variable',
                dataIndex: 'cdiscDataStdVariableMetadataText',
                key: 'cdiscDataStdVariableMetadataText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStdVariableMetadataText'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-sliders-h" ></i>
                        <span> Dataset Validation Rule</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>
                    <ReactTable
                        columns={columns}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addDataSetValidationRule : null}
                        dataSource={this.state.dataSource}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    <Form>
                        {this.state.action === 'Delete' && <ConfirmModal title="Delete DataSet Validation Rule" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }



}

const WrappedApp = Form.create()(DataSetValidationRule);
export default WrappedApp;

