import React, { Component } from 'react';
import { Modal, Button, Tabs, List } from 'antd';
import {
    CallServerPost,
    errorModal,
    showProgress,
    hideProgress
} from '../Utility/sharedUtility';
import ProjectConfiguration from '../ProjectConfiguration/index';
import DatasetConfig from './datasetConfig';


const { TabPane } = Tabs;
export default class ProjectConfigModal extends Component {
    state = {
        ModalText: 'Project Configuration',
        configVisible: this.props.configVisible,
        confirmLoading: false,
        activeKey: "Project Configuration"
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

    render() {
        const { configVisible, confirmLoading, activeKey } = this.state;
        const allConfigs = {
            "Project Configuration": <ProjectConfiguration {...this.props}/>
        };
        return (
            <Modal
                title={"Project Configuration - " + this.props.project.sponsorName +" "+ this.props.project.projectName}
                visible={configVisible}
                width="98%"
                style={{ height: "95%", top: 5 }}
                confirmLoading={confirmLoading}
                onCancel={this.props.FormCancel}
                footer={null}
            >
                <Tabs
                    tabPosition="left"
                    activeKey={activeKey}
                    defaultActiveKey={"Project Configuration"}
                    onChange={this.tabOnChange}
                    style={{ height: "calc(100vh - 100px)" }}
                >
                    {Object.keys(allConfigs).map((iKey, index) => (
                        <TabPane tab={iKey} key={iKey}>
                            {allConfigs[iKey]}
                        </TabPane>
                    ))}
                </Tabs>
            </Modal>
        );
    }
}
