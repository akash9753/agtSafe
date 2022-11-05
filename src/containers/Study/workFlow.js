import React, { Component } from 'react';
import { Input, Form, Select, Col, Row, Modal, Icon, Tooltip, Spin, Timeline, Button } from 'antd';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, checkPermission } from '../Utility/sharedUtility';


//Importing ButtonWithToolTip for Actions
var thisObj, curColor;
class WorkFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false,
            studyWorkFlowStatus: []

        };
        thisObj = this;
        thisObj.getStudyWorkFlowStatusDetails(thisObj.props);
    }

    getStudyWorkFlowStatusDetails = (props) => {
        thisObj = this;
        CallServerPost('StudyWorkflow/GetStudyWorkFlowStatusDetails', { StudyID: props.studyID, ProjectID: props.projectID })
            .then(
                function (response) {
                    if (response.value !== null) {
                        var datas = response.value;
                        var timelineItems = datas.map(item => {
                            return (
                                <Timeline.Item color={thisObj.getColor(item.workflowActivityID, item.workflowActivityStatusID)} style={{ color: curColor}}>{item.workflowActivityStatusText + " on " + item.updatedDateTime + " by " + item.updatedUser}</Timeline.Item>
                            );
                        });
                        thisObj.setState({ studyWorkFlowStatus: timelineItems });
                    }

                }).catch(error => error);
    }

    handleCancel = () => {
        this.setState({ showConfirmModal: false, loading: false });
    }
    getColor = (workflowActivityID, workflowActivityStatusID) => {
        var color = "";
        switch(workflowActivityID) {
            case 1:
                workflowActivityStatusID === 16 ? color = "red" : color = "green";
                break;
            case 2:
                color = "blue";
                break;
            case 3:
                color = "orange";
                break;
            case 4:
                color = "brown";
                break;
            case 5:
                color = "darkcyan";
                break;
            default:
                color = "black";
                break;
        }
        curColor = color;
        return color;
    }
    render() {
        const { studyWorkFlowStatus } = this.state;

        return (
            <Modal
                visible={this.props.visible}
                className='studyWorkflow'
                title={this.props.studyName + " - Timeline"}
                width={'50%'}
                style={{ top: 20 }}
                maskClosable={false}
                onCancel={this.props.handleCancel}
                onOk={this.handleOk}
                footer={[
                    <Button type="primary" size="large" className="okBtn" name="Ok" onClick={this.props.handleCancel}>
                        OK
                    </Button>
                ]}
            >

                <Timeline mode="alternate">
                    {studyWorkFlowStatus}
                </Timeline>

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(WorkFlow);

export default WrappedApp;