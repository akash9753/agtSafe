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
import { stringSorter } from '../Utility/htmlUtility';
import Select, { SelectOption } from '../../components/uielements/select';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';


const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, passwordSecurityQuestionID;
var deleteModal;

const projectRole = getProjectRole();
class PasswordSecurityQuestion extends Component {


    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addPasswordSecurityQuestion = this.addPasswordSecurityQuestion.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            modalLoad:false,
            passwordSecurityQuestionID

        };

        thisObj = this;
        showProgress();
        CallServerPost('PasswordSecurityQuestions/GetAllPasswordSecurityQuestions', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const passwordSecurityQuestionList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < passwordSecurityQuestionList.length; i++) {
                            const passwordquestionid = passwordSecurityQuestionList[i].passwordSecurityQuestionID;
                            const editCell = <div>

                                {/*
                                {perLevel >= 1 && passwordquestionid > 45 ? <ButtonWithToolTip
                                    name={passwordSecurityQuestionList[i].questionText + "_Edit"}
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editPasswordSecurityQuestion(passwordquestionid, permissions)}
                                /> : ""}
                                
                                {perLevel >= 4 && passwordquestionid > 45 ? <ButtonWithToolTip
                                    name={passwordSecurityQuestionList[i].questionText + "_Delete"}
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deletePasswordSecurityQuestion(passwordquestionid)}
                                /> : ""}
                                */}

                            </div>;
                            datas.push({
                                key: passwordSecurityQuestionList[i].passwordSecurityQuestionID,
                                questionText: passwordSecurityQuestionList[i].questionText,
                                statusText: passwordSecurityQuestionList[i].statusText,
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

    editPasswordSecurityQuestion = (passwordSecurityQuestionID, permissions) => {
        this.props.history.push({
            pathname:'/trans/editPasswordSecurityQuestion',
            state: {
                PasswordSecurityQuestionID: passwordSecurityQuestionID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addPasswordSecurityQuestion = () => {
        this.props.history.push({
            pathname:'/trans/addPasswordSecurityQuestion',
            state: {
                loading: true,
            }
        }
        );
    }

    deletePasswordSecurityQuestion = (passwordSecurityQuestionID) => {
        this.setState({ showEditModal: true, PasswordSecurityQuestionID: passwordSecurityQuestionID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        thisObj.setState({ modalLoad:true });
        let values = {};

                values["ChangeReason"] = ChangeReason;
                values["PasswordSecurityQuestionID"] = thisObj.state.PasswordSecurityQuestionID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('PasswordSecurityQuestions/Delete', values)
                    .then(
                    function (response) {
                          thisObj.setState({ modalLoad: false });
                            if (response.status == 1) {
                                thisObj.setState({ loading: false });
                                successModal(response.message, thisObj.props,"/trans/passwordSecurityQuestion");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
         

    }

    handleCancel = () => {
        this.setState({ showEditModal: false});
    }



    render() {
        const columns = [
            {
                title: 'Question',
                dataIndex: 'questionText',
                key: 'questionText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'questionText'),
            },
            //{
            //    title: 'Status',
            //    dataIndex: 'statusText',
            //    key: 'statusText',
            //    width: 100,
            //    sorter: (a, b) => stringSorter(a, b, 'statusText'),
            //},
            //{
            //        title: 'Actions',
            //        dataIndex: 'actions',
            //        key: 'actions',
            //        width: 100
            //}
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-question-circle" ></i>
                        <span> Password Security Question</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Password Security Question" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>

                    


                </LayoutContent>

            </LayoutContentWrapper>

        );
    }



}

const WrappedApp = Form.create()(PasswordSecurityQuestion);
export default WrappedApp;

