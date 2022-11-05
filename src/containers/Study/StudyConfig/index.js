import React, { Component } from 'react';
import { Modal, Button, Tabs } from 'antd';
import DatasetConfig from './datasetConfig';
import DomainConfig from './domainConfig';
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
    hideProgress,
    checkPermission
} from '../../Utility/sharedUtility';



const { TabPane } = Tabs;
const mode = "top";
export default class StudyConfigModal extends Component {
    state = {
        ModalText: 'Content of the modal',
        configVisible: this.props.configVisible,
        confirmLoading: false,
        activeKey: "Study Details",
    };

    showModal = () => {
        this.setState({
            configVisible: true,
            
        });
    };

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                configVisible: false,
                confirmLoading: false,
            });
        }, 2000);
    };

    //Role Assignment
    showRoleAssign = () => 
    {
        let thisObj = this;
        let { study } = this.props;
        let { studyID, projectId, isLocked, workflowActivityStatusID, studyName } = study;

        showProgress();
        CallServerPost('ActivityConfiguration/CheckAllActivityConfiguredByStudyID', { StudyID: studyID }).then(function (res) {
            if (res.status === 1) {
                CallServerPost('ActivityConfiguration/GetActivityConfigurationByStudyID',
                    {
                        FormName: "Study",
                        ActionName: "Create",
                        StudyID: studyID,
                        ProjectID: projectId
                    }).then(function (response) {
                        hideProgress();
                        if (response.status === 1) {

                            let activity = response.value.ActivityConfigList || [];
                            if (activity.length > 0) {
                                thisObj.setState({
                                    activeKey:"User Assignment"
                                });

                            }
                            else {
                                hideProgress();

                                errorModal("Please configure the study activities before going into user assignment!");
                            }
                        }
                        else {
                            hideProgress();
                            errorModal("Please configure the study activities before going into user assignment!");
                        }
                    });
            } else {
                hideProgress();
                errorModal(res.message);
            }
        }
        );
    }

    handleCancel = () => {
        //console.log('Clicked cancel button');
        this.setState({
            configVisible: false,
        });
    };

    tabOnChange = (key) =>
    {
        if (key === "User Assignment")
        {
            this.showRoleAssign();
            return;
        }
        
            this.setState({
                activeKey: key
            });
    }

    //Check IS ProtocolConfigured
    //Check IS Crf document configured
    isConfigured = (ActivityName) =>
    {
        return true;
    }

    render() {
        const { configVisible, confirmLoading, activeKey } = this.state;
        const { props } = this;
        const { studyID, projectID, study, refreshList, isProjectInActive, permissions } = this.props;
        const allConfigs = {
            "Study Details": <ViewStudy {...this.props} activeKey={activeKey} tabName={"Study Details"} />,
            ...(study.mappingRequried ? {
                "Domain Config": <DatasetConfig activeKey={activeKey} {...this.props} /> } : ""),
            "Activity Configuration": <ActivityConfig activeKey={activeKey} {...this.props} />,
            ...(checkPermission(permissions, ["UserAssignment"]) >= 1 ? { "User Assignment": <UserAssign permissions={permissions} activeKey={activeKey} study={study} isProjectInActive={isProjectInActive} projectID={projectID} /> } : ""),
            "Study Version": <StudyVersion activeKey={activeKey} {...this.props} />
        };
        return (
            <Modal
                title={"Study Configuration - " + this.props.studyName}
                visible={configVisible}
                width="99%"
                className="StudyConfigModal"
                style={{  top: 10 }}
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
                            {activeKey == iKey && allConfigs[iKey]}
                            </TabPane>
                        ))}
                    </Tabs>
            </Modal>
        );
    }
}
