import React, { Component } from 'react';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { showProgress, hideProgress, CallServerPost, errorModal, dynamicModal, successModalCallback, getTimeZone, getProjectRole, checkPermission } from '../Utility/sharedUtility';
import { Dropdown, Menu, Tooltip,message } from 'antd';
import Button from '../../components/uielements/button';
 
var study = []; var thisObj = "";

//for dropdown visible false no need 
var loopcontrolOff = false;

export function workflowActionButton(thisObj, study, permissions, projectInActive, studyLockStatus) {
    var validateRoleWithStatusId = validateRoleWithStatusID(study);
    var showPrevBtnIfID = validateRoleWithStatusId.pre;
    var showNextBtnIfID = validateRoleWithStatusId.nex;
    let wkFlowBtn = [];
    wkFlowBtn = makeWkFlowBtn(thisObj, study, showPrevBtnIfID, showNextBtnIfID);

    let data = wkFlowBtn.map(function (key) {
        const permissionAndStudyLockStatus = () => {
            if (checkPermission(permissions, [key.btnName]) >= 1) {
                if (!studyLockStatus) {
                    return true;
                }
            }
            return false;
        };
        let style = {
            margin: "0px 5px 0px 0px"
        };
        if (key.prev) {
            return (permissionAndStudyLockStatus() ? <Dropdown style={style} disabled={projectInActive ? true : key.disabled} overlay={() => getMenu(key.data, thisObj)} trigger={['click']} placement="bottomLeft">                
                <ButtonWithToolTip
                        name={key.name}
                        tooltip={key.tooltip}
                        shape={key.shape}
                        size={key.size}
                        style={style}
                        disabled={projectInActive ? true : key.disabled}
                        tabIndex="0"
                        classname={key.classname}
                    />                   

            </Dropdown> : null)
        } else {
            return (permissionAndStudyLockStatus() ? <ButtonWithToolTip
                name={key.name}
                tooltip={key.tooltip}
                shape={key.shape}
                classname={key.classname}
                size={key.size}
                style={style}
                disabled={projectInActive ? true : key.disabled}
                onClick={key.onClick}
            /> : null)
        }
    });
    return data;
}

function handleMenuClick(key, study,thisObj) {
    thisObj.setState({
        loading: true
    });
    let tempStudy = JSON.parse(study)
    tempStudy.workflowActivityStatusID = key.key;
    fnToStartWorkflow(getUrl(1), tempStudy, thisObj);
}
function handleVisibleChange(flag){
    loopcontrolOff = flag;
};
function getMenu(data, thisObj) {
    let temStdy = JSON.parse(data);
    var tempD = temStdy.workflowActivityStatusID;

    //check access
    var access = { a: temStdy.annotationRequired, m: temStdy.mappingRequried, d: temStdy.defineRequired };

    if (tempD == 4) {
        return (<Menu onClick={(e) => handleMenuClick(e, data, thisObj)}>
            <Menu.Item key="2">Annotation Assigned</Menu.Item>
        </Menu>);
    } else if (tempD == 8) {
        return (<Menu onClick={(e) => handleMenuClick(e, data, thisObj)}>
            {access.a && <Menu.Item key="2">Annotation Assigned</Menu.Item>}
            <Menu.Item key="6">Mapping Assigned</Menu.Item>
        </Menu>)
    }
    else if (tempD == 14) {
        return (<Menu onClick={(e) => handleMenuClick(e, data, thisObj)}>
            {access.a && <Menu.Item key="2">Annotation Assigned</Menu.Item>}
            {access.m && <Menu.Item key="6">Mapping Assigned</Menu.Item>}
            <Menu.Item key="12">Define Assigned</Menu.Item>
        </Menu>)
    }
    else {
        return (<Menu onClick={(e) => handleMenuClick(e, data, thisObj)}>
           </Menu>)
    }
}
function makeWkFlowBtn(thisObj, study, showPrevBtnIfID, showNextBtnIfID) {
    let tempStudy = JSON.parse(study);
    var WorkflowActivityStatus = tempStudy.workflowActivityStatusID;
    var AnnoReq = tempStudy.annotationRequired;
    var MapReq = tempStudy.mappingRequried;
    var DefReq = tempStudy.defineRequired;
    var NextToolTip = tempStudy.nextToolTip;   
   
    let btn = [
        {
            tooltip: "Move To Previous",
            shape: "circle",
            classname: "fas fa-arrow-left",
            size: "small",
            prev:true,
            id: tempStudy.studyID,
            disabled: (showPrevBtnIfID.indexOf(tempStudy.workflowActivityStatusID) == -1) ? true : false,
            data: study,
            btnName: 'PreviousWorkFlowAction',
            name: tempStudy.studyName + '_PreviousWorkFlowAction'
        },
        {
            tooltip: NextToolTip,
            shape: "circle",
            classname: "fas fa-arrow-right",
            size: "small",
            disabled: (showNextBtnIfID.indexOf(tempStudy.workflowActivityStatusID) == -1) ? true : false,
            btnName: 'NextWorkFlowAction',
            name: tempStudy.studyName + '_NextWorkFlowAction',
            onClick: (function () {
                fnWorkFlow(thisObj, 2, study);
            })
        },
        {
            tooltip: "Comment",
            shape: "circle",
            classname: "far fa-comment-dots",
            btnName: 'Comment',
            name: tempStudy.studyName + '_Comment',
            size: "small",
            onClick: (function () {
                thisObj.fnToViewComment(study);
            })
        },
    ];
    return btn;
}

//Function to differ prev or next or initiated
function fnWorkFlow(thisObj, forWhatOpt, data) {
    var tempStudy = JSON.parse(data);
    if (tempStudy.eSignRequired) {

        sessionStorage.study = data;
        let EsignText = { AnnotationInProgress: "I have annotated this document", AnnotationUnderReview: "I have reviewed this annotated document", MappingInProgress: "I have performed mapping on this document", MappingUnderReview: "I have reviewed this mapped document", ProgramGenerationInProgress: "I have done the program generation", DefineGenerationInProgress: "I have generated the define XML", DefineGenerationUnderReview: "I have reviewed generated define XML"}

        dynamicModal({
            title: "Confirmation", icon: "exclamation-circle", msg: "Do you want to change the status?",
            onOk: () => {
                showProgress();
              thisObj.setState({esign: true, esignText: EsignText[tempStudy.workflowActivityStatusText.replace(/\s/g, '')] })
                hideProgress();

                    }
        });
    }

    else {
        dynamicModal({
            title: "Confirmation", icon: "exclamation-circle", msg: "Do you want to change the status?", onOk: () => {
                thisObj.setState({
                    loading: true
                });
                if (tempStudy.workflowActivityStatusText.toLocaleLowerCase().replace(/\s/g, '') == "studyinitiated") {

                    fnToStartWorkflow("StudyWorkflow/WorkflowStart", tempStudy, thisObj);
                }
                else {
                    fnToStartWorkflow(getUrl(forWhatOpt), tempStudy, thisObj);
                }
            }
        });
    
    }

}

//Esignature 
export function afterEsignVerfied(Reason, props) {
    var tempStudy = JSON.parse(sessionStorage.study);
    tempStudy.eSignVerified  = true;
    fnToStartWorkflow("StudyWorkflow/UpdateNextWFAStatus", tempStudy, props);

}

//to get Url
function getUrl(data) {
    switch (data) {
        case 1:
            return "StudyWorkflow/UpdatePreviousWFAStatus";
        case 2:
            return "StudyWorkflow/UpdateNextWFAStatus";
    }
}

//function to post request for update status
function fnToStartWorkflow(url, study, props) {

    const projectRole = getProjectRole();

    study.RoleID = (JSON.parse(sessionStorage.role) != undefined) ? JSON.parse(sessionStorage.role).RoleID : 0;
    study.TimeZone = getTimeZone();
    study.ChangeReason = study.WorkflowActivityStatusText;
    study.UpdatedBy = projectRole.userProfile.userID;
    study.changeReason = study.nextToolTip;
    showProgress();
    CallServerPost(url, study)
        .then(function (response) {
            if (response.status == 1) {

                message.success(response.message);
                props.getList(props.props);
                props.setState({ loading: false, esign: false });

            } else {
                props.setState({ loading: false, esign: false });
                message.error(response.message);
            }
            hideProgress();

        });
}

function validateRoleWithStatusID(study) {
    let roleID = JSON.parse(sessionStorage.role).RoleID;
    let temStdy = JSON.parse(study);

    //check access
    var access = { a: temStdy.annotationRequired, m: temStdy.mappingRequried, d: temStdy.defineRequired };

    ////return id's are workflow statusID
    switch (roleID) {        
        case 5:
            //Role  Data Annotator
            return { pre: [-1], nex: (access.a) ? [ 2, 3] : [-1] };
        case 6:
            //Role Annotation Reviewer
            return { pre: (access.a) ? [4] : [-1], nex: (access.a) ? [4, 5] : [-1] };
        case 7:
            //Role  Mapping Programmer
            return { pre: [-1], nex:  (access.m) ? [6, 7] : [-1] };
        case 8:
            //Role Mapping Reviewer
            return { pre: (access.m) ? [8] : [-1], nex: (access.m) ?[8, 9, 10, 11] :[-1]};
        
        case 9:
            //Role  Data Analyst
            return { pre: (access.m) ? [14] : [-1], nex: (access.d) ? [12, 13, 14, 15] :[-1]};
        default:
            return { pre: [-1], nex: [-1] };

    }
}
