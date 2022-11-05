import React, { Component } from 'react';
import { Select, Input, Breadcrumb, Col, Row, Form, Steps, message, Modal, Icon, Tooltip, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, showProgress, hideProgress } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import { checkSelect } from '../Utility/validator';
import ReactTable from '../Utility/reactTable';
import { stringSorter } from '../Utility/htmlUtility';

const Option = Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const dataSource = [];
let uuid = 0;
let keys = [];
let locUserID = -1;
const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };
const iconCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold', marginTop: 5 };
const msgCenter = { textAlign: 'center', color: '#788195', fontSize: 20, fontWeight: 'bold', marginTop: 25 };

class AssignmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: 0,
            dataSource,
            projects: [],
            studies: [],
            roles: [],
            userAssigns: [],
            newAdded: false,
            editIndex: -1,
            deleteIndex: -1,
            loading: true
        };
        this.getList(this.props);

    }


    getList = (nextProps) => {

        if (typeof nextProps.userId != "undefined" && nextProps.userId != null && nextProps.userId != locUserID) {
            const thisObj = this;
            showProgress();
            CallServerPost('UserAssignment/GetUserAssignData', { UserID: nextProps.userId })
                .then(

                function (response) {
                    var uAssignlist = [];
                    if (response.value.userAssignList != null) {
                        uAssignlist = response.value.userAssignList;

                        }
                        hideProgress();
                    thisObj.setState({ dataSource: uAssignlist, userID: nextProps.userId, projects: response.value.projectList, studies: response.value.studyList, roles: response.value.rolesList, userAssigns: uAssignlist, loading: false });

                }).catch(error => error);
        }
    }


    handleCancel = () => {
        this.props.handleCancel();
    }
    render() {


        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { studies, roles, userAssigns, editIndex } = this.state;
        const columns = [
            {
                title: 'Project',
                dataIndex: 'projectText',
                key: 'projectText',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'projectText'),
            },
            {
                title: 'Study',
                dataIndex: 'studyText',
                key: 'studyText',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'studyText'),
            },
            {
                title: 'Role',
                dataIndex: 'roleText',
                key: 'roleText',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'roleText'),
           },

        ];
        
        return (

            <Modal
                visible={this.props.visible}
                title={"Assignment Details"}
                style={{ top: 20 }}
                onCancel={this.handleCancel}
                width={'80%'}
                afterClose={this.removeAll}
                maskClosable={false}
                footer={[
                ]}
            >

                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AssignmentDetails);
export default WrappedApp;

