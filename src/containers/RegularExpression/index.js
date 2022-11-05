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
var thisObj, regularExpressionID;
var deleteModal;

const projectRole = getProjectRole();
class RegularExpression extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addRegularExpression = this.addRegularExpression.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            regularExpressionID,
            modalLoad:false,
        };

        thisObj = this;
        showProgress();
        CallServerPost('RegularExpression/GetAllRegularExpression', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const regularExpressionList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < regularExpressionList.length; i++) {
                            const regularexpressionid = regularExpressionList[i].regularExpressionID;
                            const editCell = <div>

                                
                                
                                {perLevel >= 1 && regularexpressionid > 38 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editRegularExpression(regularexpressionid, permissions)}
                                /> : ""}
                                

                                {perLevel >= 4 && regularexpressionid > 38 ? <ButtonWithToolTip
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteRegularExpression(regularexpressionid)}
                                /> : ""}
                                

                            </div>;
                            datas.push({
                                key: regularExpressionList[i].regularExpressionID,
                                expression: regularExpressionList[i].expression,
                                regExDescription: regularExpressionList[i].regExDescription,
                                statusText: regularExpressionList[i].statusText,
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

    editRegularExpression = (regularExpressionID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editRegularExpression',
            state: {
                RegularExpressionID: regularExpressionID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addRegularExpression = () => {
        this.props.history.push({
            pathname: '/trans/addRegularExpression',
            state: {
                loading: true,
            }
        }
        );
    }

    deleteRegularExpression = (regularExpressionID) => {
        this.setState({ showEditModal: true, RegularExpressionID: regularExpressionID });
    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
               thisObj.setState({ modalLoad: true });

                values["RegularExpressionID"] = thisObj.state.RegularExpressionID;
                values["ChangeReason"] = ChangeReason;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('RegularExpression/Delete', values)
                    .then(
                    function (response) {
                            thisObj.setState({ modalLoad: false });
                            if (response.status == 1) {
                                thisObj.setState({ loading: false });
                                successModal(response.message, thisObj.props, "/trans/RegularExpression");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
           

    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
    }

    render() {
        const columns = [
            {
                title: 'Regular Expression',
                dataIndex: 'expression',
                key: 'expression',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'expression'),
            },
            {
                title: 'Regular Expression Description',
                dataIndex: 'regExDescription',
                key: 'regExDescription',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'regExDescription'),
            },
            {
                title: 'Status',
                dataIndex: 'statusText',
                key: 'statusText',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'statusText'),
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
                        <i className="fas fa-code" ></i>
                        <span> Regular Expression</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addRegularExpression : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete RegularExpression" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>




                </LayoutContent>

            </LayoutContentWrapper>

        );
    }
}

const WrappedApp = Form.create()(RegularExpression);
export default WrappedApp;






