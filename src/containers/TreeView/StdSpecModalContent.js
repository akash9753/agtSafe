import React, { Component } from 'react';
import { Tooltip, Col, Row,Button } from 'antd';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import Box from '../../components/utility/box';
import ReactTable from '../Utility/reactTable';
import NewListComponentWrapper from './newListComponent.style';
import DomainList from './domainList';
import { ContactCardWrapper } from './domainCard.style';
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip.js'

var thisObj;

export default class StdSpecModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainData: [], 
            selectedDomain: null,
            settings: {
                data: [],
                licenseKey: 'non-commercial-and-evaluation',
                width: "100%",
                height: props.className === "studyConfig_StdSpec_Parent" ? "calc(100vh - 205px)" : 400,
                stretchH: 'all',
                filters: true,
                editor: false,
                dropdownMenu: ['alignment', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                readOnly: true,
                afterFilter: this.afterFilter,

            },
            dataSource: [],
        }
        thisObj = this;

        this.fnToViewDomain = this.fnToViewDomain.bind(this);
        this.hotTableComponent = React.createRef();
      
    }
    componentDidUpdate() {
        let { filters } = thisObj.state.settings;
        if (!filters) {
            thisObj.setState({ settings: { filters: true } });
        }
    }
    resetTable = () => {
        this.setState({ settings: { filters: false }, dataSource: this.state.mainData, noOfRows: this.state.mainData.length  });
    }

    fnToViewDomain = (selectedDomain) => {

        const { valueData, sourceData  } = this.props;
        var selectedDomain = sourceData.filter(domain => domain.domain === selectedDomain);
        var currentDataSource = [];
        currentDataSource = valueData.filter(variable => variable.cdiscDataStdDomainMetadataID == selectedDomain[0].cdiscDataStdDomainMetadataID);
        currentDataSource = currentDataSource.map((obj, index) => {

            return ({ variableName: obj.variableName, variableLabel: obj.variableLabel, roleText: obj.roleText, coreText: obj.coreText, dataTypeText: obj.dataTypeText, format: obj.format })

        });
        this.setState({ mainData: currentDataSource, selectedDomain: selectedDomain[0], noOfRows: currentDataSource.length, settings: { ...this.state.settings, filters: false } });
    }

    afterFilter = (values) => {
        const inst = this.hotTableComponent.current;

        const currData = inst.hotInstance.getData();
        const newSize = currData.length;
        this.setState({ noOfRows: newSize });
        //console.log(values);
    }

    render() {

        const colHeaders = [
            'Variable Name',
            'Variable Label',
            'Role Text',
            'Core Text',
            'DataType Text',
            'Format'
        ];
       
        const columns = [{
            title: 'Variable Name',
            dataIndex: 'variableName',
            key: 'variableName',
            width:100
        }, {
                title: 'Variable Label',
            dataIndex: 'variableLabel',
            key: 'variableLabel',
            width: 100
        },
        {
            title: 'Role',
            dataIndex: 'roleText',
            key: 'roleText',
            width: 100
        },
        {
            title: 'Core',
            dataIndex: 'coreText',
            key: 'coreText',
            width: 100
        },
        {
            title: 'Data Type',
            dataIndex: 'dataTypeText',
            key: 'dataTypeText',
            width: 100
        },
        {
            title: 'Format',
            dataIndex: 'format',
            key: 'format',
            width: 100
        }];

        const { sourceData, valueData, className } = this.props;
        const { selectedDomain, noOfRows, mainData } = this.state;
        return (
            <NewListComponentWrapper >
                <Row className={className} gutter={4} style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
                    <Col span={6} style={{ height: '100%' }}>
                        <div className="isoNoteListSidebar">
                            <DomainList
                                domains={sourceData}
                                variables={this.props.valueData}
                                fnToViewDomain={this.fnToViewDomain} 
                            />
                        </div>
                    </Col>
                    {
                        selectedDomain !== null && 

                        <Col span={18} style={{ height: '100%' }} >
                            <Tabs defaultActiveKey="1" onChange={this.onTabChange} type="card" style={{ paddingLeft: 20, paddingBottom: 2 }}>
                                <TabPane className={this.state.mainData.length > 0?"overlayTable":"tables" } tab="Variables Metadata" key="1">

                                    <Button type="primary" disabled={noOfRows === mainData.length} size="large" style={{ marginLeft: 15 }} onClick={() => this.resetTable()}>
                                        Reset
                                        </Button>
                                    <span style={{ float: "right", marginRight: "15px", marginTop: "7px" }}>Showing list of records:{this.state.noOfRows}</span>
                                    <HotTable
                                        colHeaders={colHeaders}
                                        ref={this.hotTableComponent}
                                        settings={this.state.settings}
                                        data={this.state.mainData}
                                        style={{ marginTop: 15 }}
                                    />

                                </TabPane>
                                <TabPane tab="Domain Metadata" key="2">
                                    
                                    <ContactCardWrapper>
                                        <div className="isoContactInfoWrapper">
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Domain"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.domain}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Full Name"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.domainDescription}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Key Variables"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.keyVariables}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Purpose"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.purposeText}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Structure"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.structure}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Repeating"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.repeatingText}
                                                </p>
                                            </div>
                                            <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{"Variables Count"}</p>
                                                <p className="isoInfoDetails">
                                                    {selectedDomain.cdiscDataStdDomainMetadataID}
                                                </p>
                                            </div>
                                           
                                        </div>
                                    </ContactCardWrapper>
                                </TabPane>
                            </Tabs>
                            </Col>
                    }
                    
                </Row>
            </NewListComponentWrapper>
        );
    }
}