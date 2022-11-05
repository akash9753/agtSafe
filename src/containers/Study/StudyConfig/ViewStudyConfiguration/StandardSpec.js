import React, { Component } from 'react';
import StandardSpec from '../../../TreeView/StdSpecModalContent';
import { CallServerPost, getStudyDetails, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../../../Utility/sharedUtility';

let thisObj = {};
export default class ViewStudyInStudyConfig extends Component
{

    constructor(props)
    {
        super(props);
        this.state =
        {
            allDataSource: [],
            dataSource: []
        }
        thisObj = this;
    }

    componentDidMount()
    {
        let { study } = thisObj.props;

        CallServerPost('StandardDomainMetadata/GetAllStdSpecificationDomainByStudyID', { StudyID: study.studyID })
            .then(
                function (response) {
                    if (response.value !== null)
                    {
                        thisObj.setState({
                            allDataSource: response.value.domainList,
                            dataSource: response.value.variableList
                        });
                    }

                });
    }

    static getDerivedStateFromProps() {

    }
    render() {

        return <StandardSpec className="studyConfig_StdSpec_Parent" sourceData={this.state.allDataSource} valueData={this.state.dataSource} />

    }
}