import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';
import { stringSorter  } from '../Utility/htmlUtility';
//import PermissionModal from './permissionModal';
//import Select, { SelectOption } from '../../components/uielements/select';

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

class StandardConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addStandardConfiguration = this.addStandardConfiguration.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            modalLoad:false,
        };

        thisObj = this;

        CallServerPost('StandardConfiguration/GetAllStandardConfiguration', {})
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const standardConfigurationList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ['self']);
                    for (var i = 0; i < standardConfigurationList.length; i++) {

                        const standardConfigurationID = standardConfigurationList[i].standardConfigurationID;

                        const editCell = <div>
                            
                            {perLevel >= 1 && standardConfigurationID > 395 ? <ButtonWithToolTip
                                tooltip={ perLevel >= 2 ? "Edit" : "View"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.editStandardConfiguration(standardConfigurationID, permissions)}
                            /> : ""}                      

                            {perLevel >= 4 && standardConfigurationID > 395 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteStandardConfiguration(standardConfigurationID)}
                            /> : ""}

                        </div>;
                        datas.push({
                            key: standardConfigurationList[i].standardConfigurationID,
                            standardElementText: standardConfigurationList[i].standardElementText,
                            standardAttributeText: standardConfigurationList[i].standardAttributeText,
                            model: standardConfigurationList[i].model,
                            columnName: standardConfigurationList[i].columnName,                            
                            actions: editCell
                        });
                    }
                    allDataSource = datas;
                    thisObj.setState({ dataSource: datas, loading: false });
                }

            })
            .catch(error => error);
    }

    editStandardConfiguration = (standardConfigurationID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editStandardConfiguration',
            state: {
                StandardConfigurationID: standardConfigurationID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addStandardConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addStandardConfiguration',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteStandardConfiguration = (standardConfigurationID) => {
        this.setState({ showEditModal: true, StandardConfigurationID: standardConfigurationID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};

                thisObj.setState({ modalLoad: true });

                values["StandardConfigurationID"] = thisObj.state.StandardConfigurationID;
                values["TimeZone"] = "IST";
                values["ChangeReason"] = ChangeReason;
                values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('StandardConfiguration/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ loading: false });
                            successModal(response.message, thisObj.props, "/trans/StandardConfiguration");
                        } else {
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
                title: 'Standard Element',
                dataIndex: 'standardElementText',
                key: 'standardElementText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'standardElementText'),
            },
            {
                title: 'Standard Attribute',
                dataIndex: 'standardAttributeText',
                key: 'standardAttributeText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'standardAttributeText'),
            },
            {
                title: 'Model',
                dataIndex: 'model',
                key: 'model',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'model'),
            },
            {
                title: 'Column Name',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'columnName'),
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
                        <i className="fas fa-dice-d20" ></i>
                        <span> Standard Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>
                    
                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addStandardConfiguration : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Standard Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>



                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(StandardConfiguration);
export default WrappedApp;

