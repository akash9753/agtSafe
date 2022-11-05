import React, { Component } from 'react';
import AnnotatedCRF from '../../../TreeView/mozillaPdfViewer';
import { CallServerPost, getStudyDetails, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../../../Utility/sharedUtility';
import { Empty } from 'antd';

let thisObj = {};
export default class ViewStudyInStudyConfig extends Component {

    constructor(props) {
        super(props);
        this.state =
        {
            name: "",
            fileName: "",
            Configured: true
        }
        thisObj = this;
    }


    componentDidMount() {


        let { study, tabName, activeKey} = thisObj.props;

            showProgress();
            CallServerPost('Study/GetDocumentPath',
                { StudyID: study.studyID, ActivityID: 323, RoleID: JSON.parse(sessionStorage.role).RoleID })
                .then(
                    function (response) {
                        if (response && response.value && (Object.keys(response.value).length > 0)) {
                            thisObj.setState({ Configured: true ,name: activeKey, fileName: response.value.docTempName, filePath: response.value.docTempPath });
                        }
                        else {
                            thisObj.setState({ Configured: false });

                        }
                        hideProgress();
                    });
       
    }

    render() {

        let { projectID, study, tabName, activeKey } = this.props;
        let { fileName, Configured } = this.state;
        //console.log(fileName)
        return Configured ?
            (activeKey === tabName && fileName !== "") &&
            <AnnotatedCRF
                fileName={fileName}
                projectID={projectID.toString()}
                studyID={study.studyID.toString()} /> :
            <Empty />
        
    }
}