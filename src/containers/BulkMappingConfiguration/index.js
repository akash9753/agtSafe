import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress, successModalCallback } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { stringSorter, intSorter } from '../Utility/htmlUtility';

const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var thisObj;
const projectRole = getProjectRole();

class BulkMappingConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource,
            showEditModal: false,
            modalLoad: false,
            bulkMappingConfigurationID: 0,
            action: "List",
        };
        thisObj = this;
        thisObj.getList();
    }


    getList = () => {
        showProgress();
        CallServerPost('BulkMappingConfiguration/GetAllBulkMappingConfig', {})
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        if (response.value != null) {
                            var datas = [];
                            const bulkMappingConfigurationList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < bulkMappingConfigurationList.length; i++) {
                                const bulkMappingConfigurationID = bulkMappingConfigurationList[i].bulkMappingConfigurationID;
                                const editCell = <div>

                                    {perLevel >= 1 ?
                                        <ButtonWithToolTip
                                            tooltip={perLevel >= 2 ? "Edit" : "View"}
                                            name={bulkMappingConfigurationList[i].sourceName + "_Edit"}
                                            shape="circle"
                                            classname="fas fa-pen"
                                            size="small"
                                            style={margin}
                                            onClick={() => thisObj.editBulkMappingConfiguration(bulkMappingConfigurationID, permissions)}
                                        /> : ""}


                                    {perLevel >= 4 ? <ButtonWithToolTip
                                        name={bulkMappingConfigurationList[i].sourceName + "_Delete"}
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteBulkMappingConfiguration(bulkMappingConfigurationID)}
                                    /> : ""}



                                </div>;

                                datas.push({
                                    key: bulkMappingConfigurationList[i].bulkMappingConfigurationID,
                                    sourceValue: bulkMappingConfigurationList[i].sourceValue,
                                    codeListName: bulkMappingConfigurationList[i].codeListName,
                                    targetValue: bulkMappingConfigurationList[i].targetValue,
                                    targetDomain: bulkMappingConfigurationList[i].targetDomain,
                                    targetVariable: bulkMappingConfigurationList[i].targetVariable,
                                    projectName: bulkMappingConfigurationList[i].projectName,
                                    studyName: bulkMappingConfigurationList[i].studyName,
                                    actions: editCell
                                });
                            }
                            thisObj.setState({ dataSource: datas, loading: false });
                        }
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false });
                    }
                    hideProgress();
                });
    }


    editBulkMappingConfiguration = (bulkMappingConfigurationID) => {
        const permissions = this.props.permissions;
        this.props.history.push({
            pathname: '/trans/editBulkMappingConfiguration',
            state: {
                bulkMappingConfigurationID: bulkMappingConfigurationID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addBulkMappingConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addBulkMappingConfiguration',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteBulkMappingConfiguration = (bulkMappingConfigurationID) => {
        this.setState({ showEditModal: true, action: 'Delete', bulkMappingConfigurationID: bulkMappingConfigurationID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["BulkMappingConfigurationID"] = thisObj.state.bulkMappingConfigurationID;
        values["ChangeReason"] = ChangeReason;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;

        CallServerPost('BulkMappingConfiguration/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });

                    if (response.status == 1) {
                        thisObj.setState({ showEditModal: false });
                        successModal(response.message, thisObj.props, "/trans/BulkMappingConfig");
                    } else {
                        thisObj.setState({ showEditModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);


    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }


    bulkMappingConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/importBulkMappingConfiguration',
            state: {
                //    unitConfigurationID: 0
            }
        });
    }

    render() {
        const columns = [
            {
                title: 'Source Value',
                dataIndex: 'sourceValue',
                key: 'sourceValue',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'sourceValue'),
            },
            {
                title: 'CodeList Name',
                dataIndex: 'codeListName',
                key: 'codeListName',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'codeListName'),
            },
            {
                title: 'Target Value',
                dataIndex: 'targetValue',
                key: 'targetValue',
                width: 50,
                sorter: (a, b) => intSorter(a, b, 'targetValue'),
            },
            {
                title: 'Target Domain',
                dataIndex: 'targetDomain',
                key: 'targetDomain',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'targetDomain'),
            },
            {
                title: 'Target Variable',
                dataIndex: 'targetVariable',
                key: 'targetVariable',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'targetVariable'),
            },
            {
                title: 'Project Name',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'projectName'),
            },
            {
                title: 'Study Name',
                dataIndex: 'studyName',
                key: 'studyName',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'studyName'),
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
        const { action, bulkMappingConfigurationID, title, dataSource } = this.state;

        return (

            <LayoutContentWrapper style={{ display: (action == "List" || action == "Delete") ? "block" : "none" }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cubes" ></i>
                        <span> Bulk Mapping Configuration </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all' }}>



                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ y: "calc(100vh - 256px)" }}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addBulkMappingConfiguration : null}
                        importAction={checkPermission(permissions, ['self']) >= 3 ? this.bulkMappingConfiguration : null}


                    />

                    <Form>
                        {(action == "Delete") && <ConfirmModal loading={this.state.modalLoad} title="Delete Bulk Mapping Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                    </Form>

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }



}

const WrappedApp = Form.create()(BulkMappingConfiguration);
export default WrappedApp;

