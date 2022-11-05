import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';

const { TabPane } = Tabs;

const tabStyle = { height: "calc(100vh - 100px)" };
export default class StudyComments extends Component {
    state = {
        ModalText: 'Content of the modal'
    };



    render() {


        return (
            <div style={tabStyle}>
                <Tabs defaultActiveKey="2">
                    <TabPane
                        tab={
                            <span>
                                <Icon type="apple" />
                                Tab 1
                            </span>
                        }
                        key="1"
                    >
                        Tab 1
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <Icon type="android" />
                                Tab 2
                            </span>
                        }
                        key="2"
                    >
                        Tab 2
                    </TabPane>
                </Tabs>
            </div>)
    }
}