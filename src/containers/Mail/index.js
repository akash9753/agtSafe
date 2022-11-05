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
var thisObj, emailTemplateID;
var deleteModal, showPermissionModal;

const projectRole = getProjectRole();
class EmailTemplate extends Component {


    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addEmailTemplate = this.addEmailTemplate.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            showPermissionModal: false,
            emailTemplateID,
            modalLoad: false,
        };

        thisObj = this;
        const permissions = thisObj.props.permissions;
        showProgress();
        CallServerPost('EmailTemplate/GetAll', {})
            .then(
                function (response) {
                    //Loader 
                    hideProgress();

                    if (response.value != null)
                    {
                        var datas = [];
                        const emailTemplateList = response.value;
                        //const emailTemplateList = [{
                        //    emailTemplateID: 1,
                        //    templateName: "test",
                        //    triggerEventText: "test",
                        //    emailSubject: "test",
                        //    status:"Active"
                        //}];
                        const perLevel = checkPermission(permissions, ["self"]);
                        for (var i = 0; i < emailTemplateList.length; i++) {
                            const appid = emailTemplateList[i].emailTemplateID;
                            const editCell = <div>

                                {perLevel >= 1 ?
                                    <ButtonWithToolTip
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        name={emailTemplateList[i].termName + "_Edit"}
                                        disabled={false}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.editEmailTemplate(appid, permissions)}
                                    /> : ""}
                                {/*{perLevel >= 4 ?*/}
                                {/*    <ButtonWithToolTip*/}
                                {/*        tooltip="Delete"*/}
                                {/*        name={emailTemplateList[i].termName + "_Delete"}*/}
                                {/*        shape="circle"*/}
                                {/*        classname="fas fa-trash-alt"*/}
                                {/*        size="small"*/}
                                {/*        style={margin}*/}
                                {/*        onClick={() => thisObj.deleteEmailTemplate(appid)}*/}
                                {/*    /> : ""}*/}

                            </div>;
                            datas.push({
                                key: emailTemplateList[i].emailTemplateID,
                                templateName: emailTemplateList[i].templateName,
                                triggerEventText: emailTemplateList[i].triggerEventText,
                                emailSubject: emailTemplateList[i].emailSubject,
                                emailBody: emailTemplateList[i].emailBody,
                                status: emailTemplateList[i].active ? "Active" : "InActive",
                                actions: editCell
                            });
                        }
                        allDataSource = datas;
                        thisObj.setState({ dataSource: datas, loading: false });
                    }
                    hideProgress();
                })
            .catch(error => {

                hideProgress();
                //console.log(error);
            });
    }
    /*Edit Page show*/
    editEmailTemplate = (emailTemplateID, permissions) =>
    {
        //Loader
        showProgress();
        this.props.history.push({
            pathname: '/trans/editEmailTemplate',
            state: {
                EmailTemplateID: emailTemplateID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );
    }

    /*Create Page show*/

    addEmailTemplate = () => {

        //Loader
        showProgress();
        this.props.history.push({
            pathname: '/trans/addEmailTemplate',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteEmailTemplate = (emailTemplateID) => {
        this.setState({ showEditModal: true, EmailTemplateID: emailTemplateID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        values["EmailTemplateID"] = thisObj.state.EmailTemplateID;
        values["ChangeReason"] = ChangeReason;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;

        showProgress();
        CallServerPost('EmailTemplate/Delete', values)
            .then(
                function (response) {
                    if (response.status == 1) {

                        successModal(response.message, thisObj.props, "/trans/EmailTemplate");
                    } else {
                        errorModal(response.message);
                    }
                    hideProgress();
                }).catch(error => error);
    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showPermissionModal: false });
    }

    showPermissionModal = (emailTemplateID) => {
        this.setState({ showPermissionModal: true, emailTemplateID: emailTemplateID });
    }

    render() {
        const columns = [
            {
                title: 'Template Name',
                dataIndex: 'templateName',
                key: 'templateName',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'templateName'),
            },
            {
                title: 'Trigger Type',
                dataIndex: 'triggerEventText',
                key: 'triggerEventText',
                width: 50,
                sorter: (a, b) => intSorter(a, b, 'triggerEventText'),
            },
            {
                title: 'Subject',
                dataIndex: 'emailSubject',
                key: 'emailSubject',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'emailSubject'),
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
                        <i className="fas fa-envelope" ></i>
                        <span> Email Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        /*addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addEmailTemplate : null}*/
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Email Template" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} />
                    </Form>




                </LayoutContent>

            </LayoutContentWrapper>

        );
    }



}

const WrappedApp = Form.create()(EmailTemplate);
export default WrappedApp;

