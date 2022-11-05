import React, { Component } from 'react';
import ProtocolDoc from '../../../TreeView/mozillaPdfViewer';
import { Empty } from 'antd';
import { CallServerPost, getStudyDetails, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../../../Utility/sharedUtility';

let thisObj = {};
export default class ViewStudyInStudyConfig extends Component {

    constructor(props)
    {
        super(props);
        this.state =
        {
            name:"",
            fileName: "",
            Configured:true
        }
        thisObj = this;
    }


    componentDidMount(props, currState)
    {

        let { study, activeKey } = thisObj.props;

        
            showProgress();
            CallServerPost('Study/GetDocumentPath',
                { StudyID: study.studyID, ActivityID: 322, RoleID: JSON.parse(sessionStorage.role).RoleID })
                .then(
                    function (response)
                    {
                        if (response && response.value && (Object.keys(response.value).length > 0)) {
                            thisObj.setState({ name: activeKey, fileName: response.value.docTempName, filePath: response.value.docTempPath });
                        }
                        else
                        {
                            thisObj.setState({ Configured:false });

                        }
                        hideProgress();
                    });
       
       
    }
    render()
    {
        let { projectID, study, activeKey, tabName } = this.props;
        let { fileName, Configured } = this.state;

        return Configured ?
                (activeKey === tabName && fileName !== "") &&
                <ProtocolDoc
                fileName={fileName}
                projectID={projectID.toString()}
                studyID={study.studyID.toString()}
            /> :
            <Empty />


     }
}