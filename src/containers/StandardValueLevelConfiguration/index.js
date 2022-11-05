import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';
//import PermissionModal from './permissionModal';
//import Select, { SelectOption } from '../../components/uielements/select';
import { stringSorter } from '../Utility/htmlUtility';
//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

//const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj;
var deleteModal;

const projectRole = getProjectRole();

class StandardValueLevelConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addStandardValueLevelConfiguration = this.addStandardValueLevelConfiguration.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            modalLoad:false,
        };

        thisObj = this;
        showProgress();
        CallServerPost('StandardValueLevelConfiguration/GetAllStandardValueLevelConfiguration', {})
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const standardValueLevelConfigurationList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ['self']);
                    for (var i = 0; i < standardValueLevelConfigurationList.length; i++) {

                        const stdValueLevelConfigurationID = standardValueLevelConfigurationList[i].standardValueLevelConfigurationID;                  

                        const editCell = <div>

                            {perLevel >= 1 ? <ButtonWithToolTip
                                name={standardValueLevelConfigurationList[i].domain + "_Edit"}
                                tooltip={perLevel >= 2 ? "Edit" : "View"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.editStandardValueLevelConfiguration(stdValueLevelConfigurationID, permissions)}
                            /> : ""}

                            {perLevel >= 4 ? <ButtonWithToolTip
                                    name={standardValueLevelConfigurationList[i].domain + "_Delete"}
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteStandardValueLevelConfiguration(stdValueLevelConfigurationID)}
                            /> : ""}
                                     

                        </div>;
                        datas.push({
                            key: standardValueLevelConfigurationList[i].standardValueLevelConfigurationID,
                            domain: standardValueLevelConfigurationList[i].domain,
                            valueLevelVariable: standardValueLevelConfigurationList[i].valueLevelVariable,
                            topicVariable: standardValueLevelConfigurationList[i].topicVariable,
                            groupByVariables: standardValueLevelConfigurationList[i].groupByVariables,
                            topicVariableLabel: standardValueLevelConfigurationList[i].topicVariableLabel,
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

    editStandardValueLevelConfiguration = (standardValueLevelConfigurationID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editStandardValueLevelConfiguration',
            state: {
                StandardValueLevelConfigurationID: standardValueLevelConfigurationID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addStandardValueLevelConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addStandardValueLevelConfiguration',
            state: {
                loading: true,
            }
        }
        );
    }
    
    deleteStandardValueLevelConfiguration = (standardValueLevelConfigurationID) => {
        this.setState({ showEditModal: true, StandardValueLevelConfigurationID: standardValueLevelConfigurationID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};

                thisObj.setState({ modalLoad: true });

                values["StandardValueLevelConfigurationID"] = thisObj.state.StandardValueLevelConfigurationID;
                values["TimeZone"] = "IST";
                values["ChangeReason"] = ChangeReason;
                values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('StandardValueLevelConfiguration/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });

                        if (response.status == 1) {
                            thisObj.setState({ showEditModal: false });
                            successModal(response.message, thisObj.props, "/trans/StandardValueLevelConfiguration");
                        } else {
                            thisObj.setState({ showEditModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
           

    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showPermissionModal: false });
    }


    render() {
        const columns = [
            {
                title: 'Domain',
                dataIndex: 'domain',
                key: 'domain',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'domain'),
            },
            {
                title: 'Value Level Variable',
                dataIndex: 'valueLevelVariable',
                key: 'valueLevelVariable',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'valueLevelVariable'),
            },
            {
                title: 'Topic Variable',
                dataIndex: 'topicVariable',
                key: 'topicVariable',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'topicVariable'),
            },
            {
                title: 'Topic Variable Label',
                dataIndex: 'topicVariableLabel',
                key: 'topicVariableLabel',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'topicVariableLabel'),
            },
            {
                title: 'Group By Variables',
                dataIndex: 'groupByVariables',
                key: 'groupByVariables',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'groupByVariables'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cogs" ></i>
                        <span> Standard Value Level Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addStandardValueLevelConfiguration : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Standard Value Level Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>



                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(StandardValueLevelConfiguration);
export default WrappedApp;

