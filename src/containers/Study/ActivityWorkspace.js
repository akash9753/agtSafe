import React from 'react';
import { METADATA_ANNOT, CRF_ANNOT, DEFINE } from '../Utility/appConstants';
import { showProgress, hideProgress } from '../Utility/sharedUtility';
import { MappingData, MappingDatas } from '../TreeView/getMappingDatas';


export function ActivityWorkspace(ActivityName)
{
    this.ActivityName = ActivityName;
    this.data = {};

    showProgress();
  
}

ActivityWorkspace.prototype.GoToActivityWorkspace = function ()
{
    let { ActivityName } = this;
    let thisObj = this;

    if (ActivityName === DEFINE)
    {
        this[ActivityName]();
    }
    else
    {
        let MappinDatas = new MappingData();
        MappinDatas.CallBack = () =>
        {
            this[ActivityName]();
        }
        MappinDatas.GetInit();
    }
}

//Annotation Workspace
ActivityWorkspace.prototype.Annotation = function ()
{
    let { data } = this;
    let { allActivityDetails, ActivityWorkFlowStatus, study } = data;

    data.AnnotActvtyList = allActivityDetails.filter(ac => ac.activityID === 323);
    data.wrkFlowStatus = (ActivityWorkFlowStatus || []).find(sta => sta.workflowActivityID === 2);
    showProgress();

    switch (study.annotationTypeText)
    {
        case METADATA_ANNOT:
                this.history.push("/trans/metadataAnnotation", this.data);
                break
        default:
                this.history.push("/trans/annotation", this.data);
                break
    }

}

//Mapping Workspace
ActivityWorkspace.prototype.Mapping = function ()
{
    let { data } = this;

    data.wrkFlowStatus = (data.ActivityWorkFlowStatus || []).find(sta => sta.workflowActivityID === 3);
    showProgress();
    this.history.push("/trans/mapping", this.data);
}

//Program Workspace
ActivityWorkspace.prototype.Program = function () {
    let { data } = this;

    data.wrkFlowStatus = (data.ActivityWorkFlowStatus || []).find(sta => sta.workflowActivityID === 3);
    showProgress();

    this.history.push("/trans/program", this.data);
}

//Define workspace
ActivityWorkspace.prototype.Define = function () {
    let { data } = this;

    data.wrkFlowStatus = (data.ActivityWorkFlowStatus || []).find(sta => sta.workflowActivityID === 4);
    showProgress();
    this.history.push("/trans/define", this.data);
}