import React, { Component } from 'react';
import SourceDataSetModalContent from '../../../TreeView/SourceDataSetModalContent';
import { CallServerPost, getStudyDetails, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../../../Utility/sharedUtility';
import { MappingData, MappingDatas } from '../../../TreeView/getMappingDatas';

let thisObj = {};
export default class ViewStudyInStudyConfig extends Component
{

    constructor(props)
    {
        super(props);

        this.state =
        {
            allDataSource: [],
            dataSource:[]
        }

        thisObj = this;
    }

    componentDidMount()
    {
        let { study } = thisObj.props;

    /*Source Dataset modal*/
        if (study &&
            typeof study === "object" &&
            study.mappingRequried)
        {
                showProgress();
                let MappinDatas = new MappingData();

                MappinDatas.CallBack = () =>
                {
                    /*Source Dataset modal*/
                    hideProgress();
                    thisObj.setState({ allDataSource: MappingDatas.SourceDataset.Domain, dataSource: MappingDatas.SourceDataset.Variable });
                }
                MappinDatas.GetInit();
        }
        else
        {
            errorModal("No source dataset available")
        }
    }

    static getDerivedStateFromProps() {

    }
    render() {

        let { projectID, study } = this.props;
        let { fileName } = this.state;
        return <SourceDataSetModalContent className="studyConfig_SrcDataset_Parent" sourceData={this.state.allDataSource} valueData={this.state.dataSource} />

    }
}