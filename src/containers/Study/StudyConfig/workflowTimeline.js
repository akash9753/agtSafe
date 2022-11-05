import React, { Component } from 'react';
import { Tabs, Col,Row ,Button} from 'antd';
import { CallServerPost } from '../../Utility/sharedUtility';
import { Modal, Timeline } from 'antd';

const { TabPane } = Tabs;

const tabStyle = { height: "calc(100vh - 100px)" };
var thisObj, curColor;
export default class WorkflowTimeLine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false,
            studyWorkFlowStatus: [],
            ModalText: 'Content of the modal'

        };
        thisObj = this;
        thisObj.getStudyWorkFlowStatusDetails(thisObj.props);
    }

    getStudyWorkFlowStatusDetails = (props) => {
        let { study } = props;
        let { studyID, projectID } = study;
        CallServerPost('StudyWorkflow/GetStudyWorkFlowStatusDetails', { StudyID: studyID, ProjectID: projectID })
            .then(
                function (response) {
                    if (response.value !== null) {
                        var datas = response.value;
                        var timelineItems = datas.map(item => {
                            return (
                                <Timeline.Item color={thisObj.getColor(item.workflowActivityID, item.workflowActivityStatusID)} style={{ color: curColor }}>{item.workflowActivityStatusText + " on " + item.updatedDateTime + " by " + item.updatedUser}</Timeline.Item>
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
        switch (workflowActivityID) {
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

    render()
    {
        const { studyWorkFlowStatus } = this.state;

        return (
            <div style={tabStyle}>
                <Row gutter={[16, 16]} >
                    <Col span={24} >
                        <Timeline mode="alternate" className="workflow_timeline paddingTop">
                            {studyWorkFlowStatus}
                        </Timeline>
                    </Col>
                    <Col span={24} >
                        <Button type="primary" size="large" className="okBtn rightbutton saveBtn" name="Ok" onClick={this.props.handleCancel}>
                            OK
                        </Button>
                    </Col>
                </Row>
            </div>

        )
    }
}