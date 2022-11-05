import React from 'react';
import {
    validJSON,
    showProgress,
    hideProgress,
    CallServerPost
} from '../../../Utility/sharedUtility';
import { HorizontalBar } from 'react-chartjs-2';
import { Card,Row,Empty } from 'antd';
import { Bar } from "react-chartjs-2";

let thisObj = {};
export default class TrackDomainStatus extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            maps_completed_data: [],
            maps_not_yet_completed: [],
            labels: [],
            mount: false,
            description:"Loading..."
        }
        thisObj = this;

    }

    static getDerivedStateFromProps(props,currentState)
    {
        let { activeKey, tabName } = props;

        if (activeKey === tabName && !currentState.mount)
        {
            showProgress();

            //Get Mapping List
            let { study } = thisObj.props;
            CallServerPost('MappingOperations/GetAllMappingOperationsByStudyID', { studyID: study.studyID }).then(
                function (res) {
                    if (typeof res === 'object' && res) {

                        thisObj.DomainConfigByStudy(res.value);
                    }
                    else {
                        thisObj.DomainConfigByStudy([]);
                    }
                    // hideProgress();
                });
        }
        else if (activeKey !== tabName) {
            return{
                mount: false,
             }
        }
        

        return {
            mount:true,
        }
       
    }

    DomainConfigByStudy = (MappingList) =>
    {
        let { study } = thisObj.props;

        //Get Configured Domain Data
        CallServerPost('DomainConfig/GetByStudy', { studyID: study.studyID })
        .then(function (res)
        {
            if (typeof res.value === 'object' && res.value)
            {
                //domainconfig var-> configured domains for the study
                let { domainconfig, stdspec } = res.value;
                let { domainList } = stdspec;

                let mapped = {};
                let not_mapped = {};

                for(let v = 0; v < domainconfig.length > 0; v++)
                {
                    let va = domainconfig[v];
                    let domainObj = domainList.find(d => d.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                    let domainName = domainObj ? domainObj.domain : false;

                    if (domainName)
                    {
                        //Using the following function to check if map is complete for va.cdiscDataStdDomainMetadataID && va.cdiscDataStdVariableMetadataID
                        let isUsedForMapping = MappingList && MappingList.some(ma => ma.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID &&
                            ma.cdiscDataStdVariableMetadataID === va.cdiscDataStdVariableMetadataID);

                        //check if map completed , update 
                        if (isUsedForMapping)
                        {
                            //get the already completed count
                            let count = mapped[domainName];
                            //update the count
                            mapped[domainName] = count ? ++count : 1;

                            not_mapped[domainName] = not_mapped[domainName] ? not_mapped[domainName] : 0;
                        }
                        else
                        {
                            //Keep track of variables that are not completed in the domain.
                            let count = not_mapped[domainName];
                            not_mapped[domainName] = count ? ++count : 1;

                            //Track Domains with even a single variable are not mapped
                            let domainCount = mapped[domainName];
                            mapped[domainName] = domainCount ? domainCount : 0;
                        }
                    }

                }

                let chart_label = Object.keys(mapped);
                thisObj.setState({
                    maps_not_yet_completed: Object.values(not_mapped),
                    maps_completed_data: Object.values(mapped),
                    labels: chart_label,
                    description: chart_label.length === 0 ? "Domain not configured" :""

                });

            }
            else
            {
                thisObj.setState({
                    maps_not_yet_completed: [],
                    maps_completed_data: [],
                    labels: [],
                    description:"Domain not Configured"
                });

            }

            hideProgress();
        });
    }

    render()
    {
        let { maps_not_yet_completed, maps_completed_data, labels, description } = this.state;

        const ChartData = {
                labels,
                datasets: [
                    {
                        label: 'Completed',
                        data: maps_completed_data,
                        backgroundColor: 'lightgreen',
                    },
                    {
                        label: 'Not Completed',
                        data: maps_not_yet_completed,
                        backgroundColor: 'rgb(255, 112, 77)',
                    }
                ],
            };

        return (
            <div className="dash_main_div_full">
                <Card className="dash_main_div_full_flex dash_main_card">

                    <Row className="dash_main_div_full">
                        {labels.length > 0 ?
                            <div className="chart-container dash_main_div_full"
                                style={{
                                    "position": "relative",
                                    height: "calc(100vh - 141px)",
                                    width: "100%"
                                }}>

                                <Bar
                                    height={'100%'}
                                    data={ChartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,

                                        legend: {
                                            display: false,
                                            position: "left"
                                        },

                                        scales: {
                                            yAxes: [{
                                                stacked: true,
                                                //axis line
                                                ticks: {
                                                    stepSize: 2,
                                                    autoSkip: false,
                                                },
                                                //label
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: 'Variable Count'
                                                }
                                            }],
                                            xAxes: [{
                                                gridLines: { display: false },
                                                //double bar
                                                stacked: true,
                                                //axis line
                                                ticks: {
                                                    autoSkip: false
                                                },
                                                //label
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: 'Domain'
                                                }
                                            }]
                                        }
                                    }}

                                />
                            </div>
                            : <Empty description={description}/>}
                    </Row>
                </Card>
            </div>
        );
    }
}
