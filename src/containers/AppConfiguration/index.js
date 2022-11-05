import React, { Component } from 'react';
import { Row, Col } from 'antd';
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
var thisObj, appConfigID;
var deleteModal, showPermissionModal;

const projectRole = getProjectRole();
class AppConfiguration extends Component {


    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addAppConfiguration = this.addAppConfiguration.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            showPermissionModal: false,
            appConfigID,
            modalLoad: false,
        };

        thisObj = this;
        const permissions = thisObj.props.permissions;
        showProgress();
        CallServerPost('AppConfiguration/GetAllAppConfig', {})
            .then(
                function(response) {

                    if (response.value != null) {
                        var datas = [];
                        const appConfigList = response.value;
                        const perLevel = checkPermission(permissions, ["self"]);
                        for (var i = 0; i < appConfigList.length; i++) {
                            const appid = appConfigList[i].appConfigurationID;
                            const editCell = <div>

                                {perLevel >= 1 ?
                                    <ButtonWithToolTip
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        name={appConfigList[i].termName + "_Edit"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.editAppConfiguration(appid, permissions)}
                                    /> : ""}
                                {/*{perLevel >= 4 ?*/}
                                {/*    <ButtonWithToolTip*/}
                                {/*        tooltip="Delete"*/}
                                {/*        name={appConfigList[i].termName + "_Delete"}*/}
                                {/*        shape="circle"*/}
                                {/*        classname="fas fa-trash-alt"*/}
                                {/*        size="small"*/}
                                {/*        style={margin}*/}
                                {/*        onClick={() => thisObj.deleteAppConfiguration(appid)}*/}
                                {/*    /> : ""}*/}

                            </div>;
                            datas.push({
                                key: appConfigList[i].appConfigurationID,
                                termName: appConfigList[i].termName,
                                termCode: appConfigList[i].termCode,
                                shortValue: appConfigList[i].shortValue,
                                longValue: appConfigList[i].longValue,
                                status: appConfigList[i].statusText,
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

    editAppConfiguration = (appConfigID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editAppConfiguration',
            state: {
                AppConfigurationID: appConfigID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );
    }

    addAppConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addAppConfiguration',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteAppConfiguration = (appConfigID) => {
        this.setState({ showEditModal: true, AppConfigurationID: appConfigID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["AppConfigurationID"] = thisObj.state.AppConfigurationID;
        values["ChangeReason"] = ChangeReason;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;
        CallServerPost('AppConfiguration/Delete', values)
            .then(
                function(response) {
                    if (response.status == 1) {
                        thisObj.setState({ modalLoad: false });
                        successModal(response.message, thisObj.props, "/trans/appConfiguration");
                    } else {
                        thisObj.setState({ modalLoad: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showPermissionModal: false });
    }

    showPermissionModal = (appConfigID) => {
        this.setState({ showPermissionModal: true, appConfigID: appConfigID });
    }

    render() {
        const columns = [
            {
                title: 'Term Name',
                dataIndex: 'termName',
                key: 'termName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'termName'),
            },
            {
                title: 'Term Code',
                dataIndex: 'termCode',
                key: 'termCode',
                width: 50,
                sorter: (a, b) => intSorter(a, b, 'termCode'),
            },
            {
                title: 'Short Value',
                dataIndex: 'shortValue',
                key: 'shortValue',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'shortValue'),
            },
            {
                title: 'Long Value',
                dataIndex: 'longValue',
                key: 'longValue',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'longValue'),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'status'),
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
                        <i className="fas fa-sliders-h" ></i>
                        <span> App Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        //addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addAppConfiguration : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete App Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} />
                    </Form>




                </LayoutContent>

            </LayoutContentWrapper>

        );
    }



}

const WrappedApp = Form.create()(AppConfiguration);
export default WrappedApp;

