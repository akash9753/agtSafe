import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';

//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj;
var deleteModal;

const projectRole = getProjectRole();

class DefineFormConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addDefineFormConfiguration = this.addDefineFormConfiguration.bind(this);

        this.state = {
            dataSource,
            modalLoad: false,
            defineFormConfigurationID:''
        };

        thisObj = this;
        showProgress();
        CallServerPost('DefineFormConfiguration/GetAllDefineFormConfiguration', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const defineFormConfigurationList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < defineFormConfigurationList.length; i++) {

                            const defineFormConfigurationID = defineFormConfigurationList[i].defineFormConfigurationID;

                            const editCell = <div>
                                
                                {perLevel >= 1 && defineFormConfigurationID > 24 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editDefineFormConfiguration(defineFormConfigurationID, permissions)}
                                /> : ""}

                                {perLevel >= 4 && defineFormConfigurationID > 24 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteDefineFormConfiguration(defineFormConfigurationID)}
                                /> : ""}

                            </div>;
                            datas.push({
                                key: defineFormConfigurationList[i].defineFormConfigurationID,
                                DefineVersionText: defineFormConfigurationList[i].defineVersionText,
                                DefineSectionText: defineFormConfigurationList[i].defineSectionText,
                                CDISCDataStandardText: defineFormConfigurationList[i].cdiscDataStandardText,
                                FormText: defineFormConfigurationList[i].formText,
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

    editDefineFormConfiguration = (defineFormConfigurationID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editDefineFormConfiguration',
            state: {
                defineFormConfigurationID: defineFormConfigurationID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addDefineFormConfiguration = () => {
        this.props.history.push({
            pathname: '/trans/addDefineFormConfiguration',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteDefineFormConfiguration = (defineFormConfigurationID) => {
        this.setState({ showModal: true, defineFormConfigurationID: defineFormConfigurationID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};

        thisObj.setState({ modalLoad: true });

        values["DefineFormConfigurationID"] = thisObj.state.defineFormConfigurationID;
        values["TimeZone"] = "IST";
        values["ChangeReason"] = ChangeReason;
        values["UpdatedBy"] = projectRole.userProfile.userID;

        CallServerPost('DefineFormConfiguration/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ modalLoad: false });
                        successModal(response.message, thisObj.props, "/trans/DefineFormConfiguration");
                    } else {
                        errorModal(response.message);
                    }
                }).catch(error => error);


    }

    handleCancel = () => {
        this.setState({ showModal: false });
    }


    render() {
        const columns = [
            {
                title: 'Define Version',
                dataIndex: 'DefineVersionText',
                key: 'DefineVersionText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'DefineVersionText'),
            },
            {
                title: 'Define Section',
                dataIndex: 'DefineSectionText',
                key: 'DefineSectionText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'DefineSectionText'),
            },
            {
                title: 'Data Standard',
                dataIndex: 'CDISCDataStandardText',
                key: 'CDISCDataStandardText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'CDISCDataStandardText'),
            },
            {
                title: 'Form',
                dataIndex: 'FormText',
                key: 'FormText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'FormText'),
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
                        <i className="fas fa-code-branch" ></i>
                        <span> Define Form Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>

                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addDefineFormConfiguration : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Define Form Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>



                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(DefineFormConfiguration);
export default WrappedApp;

