import React from 'react';
import { Select, Menu, Dropdown, Button, Icon } from 'antd';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import {
    checkPermission
} from '../Utility/sharedUtility';


let Option = Select.Option;
//Permission
const permissionCheck = (btnName, study, permissions) => {
    if (checkPermission(permissions, [btnName]) >= 1) {
        if (!study.locked) {
            return true;
        }
    }
    return false;
};

export function WorkflowDropdown(param) {
    const {
        study,
        permissions,
        studyWorkFlow,
        isProjectInActive,
        fnForComment,
        fnForWorkflow,
        WorkflowActivityStatusTransition,
        ActivityWorkStatusflowByStudy
    } = param;

    let { MappingStatus } = param;
    //Get workflowActivityStatusID of the Study
    //study workflowActivityStatusID
    if (typeof (MappingStatus) == "undefined" || MappingStatus == null) {
        MappingStatus = "";
    }
    const workflowActivityStatusID = typeof studyWorkFlow === "object" && studyWorkFlow.workflowActivityStatusID;

    //study workflowActivityID
    const workflowActivityID = typeof studyWorkFlow === "object" && studyWorkFlow.workflowActivityStatusID;

    let workflowStatusTxt = typeof studyWorkFlow === "object" && studyWorkFlow.workflowActivityStatusText;
    if (studyWorkFlow === undefined) {
        workflowStatusTxt = study.workflowActivityStatusText;
    }

    //Get workflows for the study by workflowActivityStatusID
    //availableWorkflows for that study
    let getSubmitForReview = (wStatus) => "Submit " + wStatus.replace("UnderReview", "") + " for Review";

    const availableWorkflows = WorkflowActivityStatusTransition.filter(w => w.sourceStatusID === workflowActivityStatusID);
    const WFOptions = (
        <Menu onClick={(e) => { fnForWorkflow(parseInt(e.key), study, studyWorkFlow, availableWorkflows) }}>
            {availableWorkflows.map(wrkflow => {
                return <Menu.Item key={wrkflow.targetStatusID}>
                    {wrkflow.targetStatusText.indexOf("UnderReview") >= 0 ? getSubmitForReview(wrkflow.targetStatusText) : wrkflow.targetStatusText}
                </Menu.Item>
                })
            }
        </Menu>);

    //set disable
    let checkDisable = () =>
    {
        // study configured activity status by role
        //for example - > if data analyst is loggedin ? you can get the define status in the following variable 
        let { workflowActivityID, workflowActivityStatusID } = study;

        switch (workflowActivityID)
        {
            case 4:
            case "4":
                {
                    //Don't allow define until mapping get complete
                   //Get Mapping Status Of The Study
                    let Study_Map_Activity = (ActivityWorkStatusflowByStudy || []).find(ws => ws.workflowActivityID === 3);
                    let Sty_Mapping_Status = Study_Map_Activity ? Study_Map_Activity.workflowActivityStatusID : -1;
                    return (workflowActivityStatusID === 10 || workflowActivityStatusID === 20) && (study.mappingRequried && Sty_Mapping_Status !== 9);
                }
            default:
                return false;
        }
        
    }
    return <>
        {
        //    studyWorkFlow && permissionCheck("Workflow", study, permissions) &&
        //    <Select
        //    style={{
        //        width: "80%"
        //    }}
        //    id={"workflowSelect"}
        //    defaultValue={-1}
        //    disabled={isProjectInActive || study.locked}

        //    onChange={(value) => {
        //        value !== -1 &&
        //            fnForWorkflow(value, study, studyWorkFlow, availableWorkflows);
        //    }}
        //>
        //    <Option value={-1}>--Select--</Option>
        //    {availableWorkflows.map(wrkflow => {
        //        return <Option title={wrkflow.targetStatusText} value={wrkflow.targetStatusID}>{wrkflow.targetStatusText}</Option>
        //    })}
            //</Select>
            <Dropdown overlay={WFOptions} disabled={isProjectInActive || study.locked || availableWorkflows.length === 0 || checkDisable() }>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {workflowStatusTxt} <Icon type="down" />
                </a>
            </Dropdown>
        }
        
    </>
}