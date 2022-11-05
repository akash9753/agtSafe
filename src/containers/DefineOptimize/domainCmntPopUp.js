import React, { Component } from 'react';
import { Col, Button, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost,definePermission, PostCallWithZone, errorModal, successModal, successModalCallback } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/defineBotForm';
import Input from '../../components/uielements/input';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var loopControl = true;
var description = "";
class DomainCmntPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            modalLoading: false,
            responseData: {},
            tempData: {}
        }

        thisObj = this;

    }
    
    static getDerivedStateFromProps(nextProps, state) {
        if (!state.visible && nextProps.visible) {
            thisObj.setState({ visible: nextProps.visible, responseData: nextProps.data });
        } else if (state.visible && !nextProps.visible) {
            thisObj.setState({
                visible: false
            });
        }
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, visible } = this.state;
        const { defineActivityWorkflowStatus } = this.props;
        

        return (
            <Modal
                visible={visible}
                title={this.props.title}
                cancelType='danger'
                onCancel={this.props.handleCancel}
                onOk={this.handleSubmit}
                maskClosable={false}
                footer={[
                
                    <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' onClick={this.props.handleCancel}>
                       Cancel
                    </Button>
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <LayoutContentWrapper>
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        {
                                (visible) ?
                                    Object.keys(responseData.formData).length > 0 && (
                                        <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus} FullHeight={true} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} props={this}/>):""
                        }
                       </div>
                    </LayoutContentWrapper>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(DomainCmntPopUp);
export default WrappedApp;
