import React from 'react';
import { HotTable ,HotColumn} from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Handsontable from "handsontable";
import { Spin, Icon, Button, Row, Col, Tabs } from 'antd';
import ContentTab from '../../TreeView/contentTab';

const headerStyle = { height: "auto", backgroundColor: '#ffffff', padding: "0px  10px 10px 10px" };

export default class ViewImport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hotData: Handsontable.helper.createSpreadsheetData(10, 10),
            secondColumnSettings: {
                title: "Second column header",
                readOnly: true
            }

        }
     }
    render() {
        const { TabPane } = Tabs;
        return (
            <React.Fragment>
            

                <Col span={24} style={{ height: '100%' }}>

                    <Tabs type="card" style={{paddingLeft: 20, paddingBottom: 5, marginTop:15 }}>
                        <TabPane tab="MetaData" key={"1"}>
                        <HotTable
                            data={this.state.hotData}
                            licenseKey="non-commercial-and-evaluation"
                        >
                            <HotColumn title="First column header" />
                            <HotColumn settings={this.state.secondColumnSettings} />
                        </HotTable>,

    </TabPane>
                    <TabPane tab="DatasetValues" key="2">
                                <HotTable
                                    data={this.state.hotData}
                                    licenseKey="non-commercial-and-evaluation"
                                >
                                    <HotColumn title="First column header" />
                                    <HotColumn settings={this.state.secondColumnSettings} />
                                </HotTable>,
                                </TabPane>
                    <TabPane tab="SetValues" key="3">
                                <HotTable
                                    data={this.state.hotData}
                                    licenseKey="non-commercial-and-evaluation"
                                >
                                    <HotColumn title="First column header" />
                                    <HotColumn settings={this.state.secondColumnSettings} />
                                </HotTable>,
                                </TabPane>
                        <TabPane tab="Values" key="4">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                        <TabPane tab="SetV" key="5">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                        <TabPane tab="Data" key="6">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                        <TabPane tab="Stored" key="7">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                        <TabPane tab="location" key="8">
                            fdgdgd
                                </TabPane>
                        <TabPane tab="Memory" key="9">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                        <TabPane tab="datalocated" key="10">
                            <HotTable
                                data={this.state.hotData}
                                licenseKey="non-commercial-and-evaluation"
                            >
                                <HotColumn title="First column header" />
                                <HotColumn settings={this.state.secondColumnSettings} />
                            </HotTable>,
                                </TabPane>
                    </Tabs>,
                    <Button type="danger" onClick={() => this.props.cancel()}> Back</Button>,

                </Col>
                </React.Fragment>
                )

   }

}