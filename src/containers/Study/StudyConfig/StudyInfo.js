import React, { Component } from 'react';
import { Modal, Button, Tabs } from 'antd';
import DatasetConfig from './datasetConfig';
import ActivityConfig from './activityConfig';
import StudyComments from './studyComments';
import StudyVersion from './studyVersion';
import WorkflowTimeLine from './workflowTimeline';
import UserAssign from './userAssign';
import ViewStudy from './ViewStudyConfiguration/ViewStudy';
import ProtocolDoc from './ViewStudyConfiguration/ProtocolDocument';
import AnnotatedCRF from './ViewStudyConfiguration/AnnotatedCRF';
import SourceDataset from './ViewStudyConfiguration/SourceDataset';
import StandardSpec from './ViewStudyConfiguration/StandardSpec';
import Comment from '../../TreeView/comments';
import TrackDomainStatus from './ViewStudyConfiguration/TrackDomainStatus';

import {
    CallServerPost,
    errorModal,
    showProgress,
    hideProgress
} from '../../Utility/sharedUtility';



const { TabPane } = Tabs;
const mode = "top";
export default class StudyInfo extends Component {
    state = {
        configVisible: this.props.configVisible,
        confirmLoading: false,
        activeKey: "Study Details",
    };



    handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            configVisible: false,
        });
    };

    tabOnChange = (key) => {
     

        this.setState({
            activeKey: key
        });
    }

    //Check IS ProtocolConfigured
    //Check IS Crf document configured
    isConfigured = (ActivityName) => {
        return true;
    }

    render() {
        const { configVisible, confirmLoading, activeKey } = this.state;
        const { props } = this;
        const { studyID, projectID, study, refreshList, isProjectInActive } = this.props;
        const allConfigs = {
            "Study Details": <ViewStudy {...this.props} activeKey={activeKey} tabName={"Study Details"} />,
            ...(study.mappingRequried ? { "Domain Status": <TrackDomainStatus {...this.props} activeKey={activeKey} tabName={"Domain Status"} /> } : ""),
            "Study Timeline": <WorkflowTimeLine {...this.props} />,
            "ProtocolDocument": <ProtocolDoc {...this.props} activeKey={activeKey} tabName={"ProtocolDocument"} />,
            "AnnotatedCRF": <AnnotatedCRF {...this.props} activeKey={activeKey} tabName={"AnnotatedCRF"} />,
            "StdSpec": <StandardSpec {...this.props} />,
            "SourceDataset": <SourceDataset {...this.props} />,
            "Comment": <Comment permissions={props.permissions.Comment} {...this.props} studyID={props.study.studyID} />
        };
        return (
            <Modal
                title={"Study Info - " + this.props.studyName}
                visible={configVisible}
                width="99%"
                className="StudyConfigModal"
                style={{ top: 10 }}
                confirmLoading={confirmLoading}
                onCancel={this.props.handleCancel}
                maskClosable={false}
                footer={null}
            >
                <Tabs
                    tabPosition="left"
                    activeKey={activeKey}
                    defaultActiveKey={"Activity Configuration"}
                    onChange={this.tabOnChange}
                >
                    {Object.keys(allConfigs).map((iKey, index) => (

                        allConfigs[iKey] && <TabPane tab={iKey} key={iKey}>
                            {allConfigs[iKey]}
                        </TabPane>
                    ))}
                </Tabs>
            </Modal>
        );
    }
}
