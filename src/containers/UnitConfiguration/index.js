import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, PostCallWithZone, successModal, successModalCallback, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter, intSorter } from '../Utility/htmlUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import AddUnitConfiguration from '../UnitConfiguration/addUnitConfiguration';
import EditUnitConfiguration from './editUnitConfiguration';
import { List } from 'immutable';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class UnitConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showDeleteConfirmationModal: false,
            unitConfigurationID: 0,
            action: "List",
            modalLoad: false,
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('UnitConfiguration/GetAllUnitConfiguration', {})
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        if (response.value != null) {
                            var datas = [];
                            const unitConfigurationList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < unitConfigurationList.length; i++) {
                                const unitConfigurationID = unitConfigurationList[i].unitConfigurationID;
                                const editCell = <div>

                                    {perLevel >= 1 ?
                                        <ButtonWithToolTip
                                            tooltip={perLevel >= 2 ? "Edit" : "View"}
                                            name={unitConfigurationList[i].sourceName + "_Edit"}
                                            shape="circle"
                                            classname="fas fa-pen"
                                            size="small"
                                            style={margin}
                                            onClick={() => thisObj.editUnitConfiguration(unitConfigurationID, permissions)}
                                        /> : ""}


                                    {perLevel >= 4 ? <ButtonWithToolTip
                                        name={unitConfigurationList[i].sourceName + "_Delete"}
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteUnitConfiguration(unitConfigurationID)}
                                    /> : ""}


                                    
                                </div>;

                                datas.push({
                                    key: unitConfigurationList[i].unitConfigurationID,
                                    sourceUnit: unitConfigurationList[i].sourceUnit,
                                    codeListName: unitConfigurationList[i].codeListName,
                                    targetUnit: unitConfigurationList[i].targetUnit,
                                    conversionFactor: unitConfigurationList[i].conversionFactor,
                                    testName: unitConfigurationList[i].testName,
                                    testCode: unitConfigurationList[i].testCode,
                                    category: unitConfigurationList[i].category,
                                    specimen: unitConfigurationList[i].specimen,
                                    projectName: unitConfigurationList[i].projectName,
                                    studyName: unitConfigurationList[i].studyName,
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

    AddUnitConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addUnitConfiguration',
            state: {
                unitConfigurationID: 0
            }
        });
    }
    ImportUnitConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/importConfiguration',
            state: {
            //    unitConfigurationID: 0
            }
        });
    }
    deleteUnitConfiguration = (unitConfigurationID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', unitConfigurationID: unitConfigurationID });
    }
   
    editCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({
            action: 'List',
        })

    }
    editUnitConfiguration = (unitConfigurationID) => {
        const permissions = this.props.permissions;

        this.props.history.push({
            pathname: '/trans/editUnitConfiguration',
            state: {
                UnitConfigurationID: unitConfigurationID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );

    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["UnitConfigurationID"] = thisObj.state.unitConfigurationID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('UnitConfiguration/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModal(response.message, thisObj.props, "/trans/UnitConfiguration");
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }
    refreshProgramTemplate = () => {
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.getList();
        thisObj.setState({ action: "List", modalLoad: false });
    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }
   
   


    render() {
        const { getFieldDecorator } = this.props.form;
        const { action, unitConfigurationID, title, dataSource } = this.state;
        const columns = [
            {
                title: 'Source Unit',
                dataIndex: 'sourceUnit',
                key: 'sourceUnit',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'sourceUnit'),
            },
            {
                title: 'CodeList Name',
                dataIndex: 'codeListName',
                key: 'codeListName',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'codeListName'),
            },
            {
                title: 'Target Unit',
                dataIndex: 'targetUnit',
                key: 'targetUnit',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'targetUnit'),
            },
            {
                title: 'Conversion Factor',
                dataIndex: 'conversionFactor',
                key: 'conversionFactor',
                width: 60,
                sorter: (a, b) => intSorter(a, b, 'conversionFactor'),
            },
            {
                title: 'Source Test Name',
                dataIndex: 'testName',
                key: 'testName',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'testName'),
            },
            {
                title: 'Test Code',
                dataIndex: 'testCode',
                key: 'testCode',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'testCode'),
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'category'),
            },
            {
                title: 'Specimen',
                dataIndex: 'specimen',
                key: 'specimen',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'specimen'),
            },

            {
                title: 'Project Name',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 47,
                sorter: (a, b) => stringSorter(a, b, 'projectName'),
            },
            {
                title: 'Study Name',
                dataIndex: 'studyName',
                key: 'studyName',
                width: 45,
                sorter: (a, b) => stringSorter(a, b, 'studyName'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50,
            }
        ];
        const permissions = this.props.permissions;

        return (
            <React.Fragment>
                
                <LayoutContentWrapper style={{ display: (action == "List" || action == "Delete") ? "block" : "none" }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <i className="fas fa-wrench" ></i>
                            <span>Unit Configuration</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            List
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    <LayoutContent style={{ wordBreak: 'break-all' }}>
                        <ReactTable
                            columns={columns}
                            dataSource={dataSource}
                            addAction={checkPermission(permissions, ['self']) >= 3 ? this.AddUnitConfiguration : null}
                            importAction={checkPermission(permissions, ['self']) >= 3 ? this.ImportUnitConfiguration : null}
                            scroll={{ y: "calc(100vh - 282px)" }}
                        />

                        {(action == "Delete") && <ConfirmModal title="Delete Unit Configuration" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                       
                    </LayoutContent>
                </LayoutContentWrapper>

            </React.Fragment>
        );
    }

}

const WrappedApp = Form.create()(UnitConfiguration);
export default WrappedApp;

