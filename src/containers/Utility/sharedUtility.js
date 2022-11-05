import axios from 'axios';
import React, { Component } from 'react';
import { Modal, Button, Icon, Tree } from 'antd';
import { clearToken } from '../../helpers/utility';
import moment from 'moment-timezone';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { MappingData, MappingDatas } from "../TreeView/getMappingDatas";

import CryptoJS from 'crypto-js';

export const CREATE = 'Create';
export const UPDATE = 'Update';
export const WH100PER = { width: "100%", height: "100%", overflow: "auto" };

const SESSION_KEY = "sdfsdkj";

const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
const refreshUrl = urlBase + 'Login/RefLogin';

export const SEC_ANS_UI = "/aij6+jFExp8gIXCCoEQY8zQn/r1ANSPPYj02spJ7cY=";
export const PASS_KEY_UI = "j36LL+WQPnIFBEG/HUBuQo373s9Tb7Zc0V3OIKR7YUs=";
export const S_ADMIN = 126;


export function encryptSensitiveData(plainText, key_str) {
    var key_str1 = decryptyData(key_str);
    const key = CryptoJS.enc.Utf8.parse(key_str1);
    const iv = CryptoJS.enc.Utf8.parse(key_str1);
    var encryptedVal = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encryptedVal.toString();
}

function decryptyData(cipherText) {
    const kstr = "transb@!agati654";
    const key = CryptoJS.enc.Utf8.parse(kstr);
    const iv = CryptoJS.enc.Utf8.parse(kstr);
    var decrypted = CryptoJS.AES.decrypt(cipherText, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

//Commenting for now as it calls when page is refreshed which causes session variables to clear
//window.onunload = function (event) {
//    if (sessionStorage.length !== 0 && typeof event !== "undefined") {
//        fnLogout();
//    }
//};

export function CallServerPost(url, postaData) {
    const projectRole = getProjectRole();
    //postaData["UpdatedBy"] = projectRole.userProfile.userID == null ? 0 : projectRole.userProfile.userID;
    url = urlBase + url;


    return PostServerWithCatch(url, postaData)
        .then(response => response.data);

}

export function checkPermission(permissions, keys) {
    var returnObj = 0;
    var permissionObject = permissions;
    if (permissionObject) {
        if (keys[0] == "self") {
            if (typeof permissionObject != "undefined" && permissionObject["self"] != null && permissionObject["self"] !== 0) {
                return permissionObject["self"];
            } else {
                return returnObj;
            }
        }
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (typeof permissionObject[key] != "undefined" && permissionObject[key] != null) {
                permissionObject = permissionObject[key];
            } else {
                return returnObj;
            }
        }
        if (typeof permissionObject["self"] != "undefined" && permissionObject["self"] != null && permissionObject["self"] !== 0) {
            return permissionObject["self"];
        } else {
            return returnObj;
        }
    }
    else {
        return returnObj;
    }
}

function PostServerWithCatch(url, postaData) {
    var call = null;
    let thirdArgument = null;

    if (arguments.length === 2) {
        call = PostServer(url, postaData);
    } else if (arguments.length === 3) {
        thirdArgument = arguments[2];
        call = PostServer(url, postaData, thirdArgument);
    } else {
        call = PostServer(url, postaData);
    }
    return call.catch(function (error) {
        if (error.response.status === 401 && 'token-expired' in error.response.headers) {
            return axios.post(refreshUrl, JSON.parse(sessionStorage.getItem("userProfile"))).then(function (response) {
                var value = response.data.value;
                if (value !== null) {
                    var token = 'Bearer ' + value.token;
                    sessionStorage.removeItem('authorizeToken');
                    sessionStorage.setItem("authorizeToken", token);

                    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authorizeToken");
                    sessionStorage.setItem("timeout", value.timeout);

                    if (thirdArgument !== null) {
                        return PostServer(url, postaData, thirdArgument);
                    } else {
                        return PostServer(url, postaData);
                    }
                } else {
                    fnLogout();
                }
            }).catch(function (error) {
                fnLogout();
            });
        }
    });
}

//function PostServerWithCatch(url, postaData) {
//    var call = null;
//    let thirdArgument = null;

//    if (arguments.length === 2) {
//        call = PostServer(url, postaData);
//    } else if (arguments.length === 3) {
//        thirdArgument = arguments[2];
//        call = PostServer(url, postaData, thirdArgument);
//    } else {
//        call = PostServer(url, postaData);
//    }
//    return call
//        .catch(function (error) {
//            if (error.response.status === 401 && 'token-expired' in error.response.headers) {
//                if (!checkSessionValid()) {
//                    fnLogout();
//                } else {
//                    return axios.post(refreshUrl, JSON.parse(sessionStorage.getItem("userProfile")))
//                        .then(function (response) {
//                            var value = response.data.value;
//                            if (value !== null && value.token !== null) {
//                                var token = 'Bearer ' + value.token;
//                                sessionStorage.removeItem('authorizeToken');
//                                sessionStorage.setItem("authorizeToken", token);

//                                axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authorizeToken");

//                                sessionStorage.removeItem('timeout');
//                                sessionStorage.setItem("timeout", value.timeout);
//                                if (thirdArgument !== null) {
//                                    return PostServer(url, postaData, thirdArgument);
//                                } else {
//                                    return PostServer(url, postaData);
//                                }

//                            } else {
//                                fnLogout();
//                            }
//                        }).catch(function (error) {
//                            fnLogout();
//                        });
//                }
//            }
//        });
//}

function PostServer(url, postaData) {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authorizeToken");
    if (typeof sessionStorage.userProfile !== "undefined" && sessionStorage.userProfile !== null) {
        axios.defaults.headers.common['UserID'] = JSON.parse(sessionStorage.userProfile).userID;
    }
    if (arguments.length !== 3) {
        const reqDatas = { url: url, method: 'POST', data: postaData, timeout: 600000 };
        return axios(reqDatas);
    } else if (arguments.length === 3) {
        return axios.post(url, postaData, arguments[2]);
    }
}
export function PostCallWithZone(url, postaData) {
    if (postaData !== null && Object.keys(postaData).length > 0) {
        const projectRole = getProjectRole();

        const zones = moment.tz.guess();
        const timezone = moment.tz(zones).zoneAbbr();

        postaData["TimeZone"] = timezone;
        postaData["UpdatedBy"] = projectRole.userProfile.userID;
    }
    url = urlBase + url;
    return PostServerWithCatch(url, postaData)
        .then(response => response.data);

}

//not need time zone
export function PostCallWithZoneForDomainCreate(url, postaData) {
    url = urlBase + url;
    return PostServerWithCatch(url, postaData)
        .then(response => response.data);
}

export function DownloadFile(url, fileNameWithExtension) {
    url = urlBase + url;
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authorizeToken");
    if (typeof sessionStorage.userProfile !== "undefined" && sessionStorage.userProfile !== null) {
        axios.defaults.headers.common['UserID'] = JSON.parse(sessionStorage.userProfile).userID;
    }
    const FileDownload = require('js-file-download');

    return PostServerWithCatch(url, {})
        .then((response) => {
            FileDownload(response.data, fileNameWithExtension);
        });
}
export function DownloadFileWithPostData(url, fileNameWithExtension, postaData, mimeType) {
    url = urlBase + url;
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authorizeToken");
    if (typeof sessionStorage.userProfile !== "undefined" && sessionStorage.userProfile !== null) {
        axios.defaults.headers.common['UserID'] = JSON.parse(sessionStorage.userProfile).userID;
    }
    showProgress();
    return PostServerWithCatch(url, postaData, { responseType: 'arraybuffer' })
        .then((response) => {
            hideProgress();
            if (response != undefined && response != null) {
                var FileSaver = require('file-saver');
                var blob = new Blob([response.data], { type: mimeType });
                FileSaver.saveAs(blob, fileNameWithExtension);
            } else {
                errorModal(null);
            }
        });
}

export function UserLogin(payload) {
    const url = urlBase + 'Login/Login';
    return axios.post(url, payload)
        .then(response => response.data)
        .catch(error => error);
}

export function UserAssignedPop(param) {
    Modal["confirm"]({
        title: <span name='AlertTitle'>{param.title}</span>,
        content: <span name='AlertMessage'>{param.msg}</span>,
        okText: param.action + " anyway",
        cancelText: "Cancel",
        className: "UserAssignedPop",
        okButtonProps: { size: "small" },
        okType: 'ant-btn saveBtn rightBTN UserAssignedPopsaveBtn',
        cancelButtonProps: { size: "small", type: 'danger', className: "UserAssignedPopleftBtn leftBTN" },

        onOk: function () {
            if (param.onOk !== undefined) {
                param.onOk();
            }
        },
        onCancel: function () {
            if (param.onCancel !== undefined) {
                param.onCancel();
            }
        },

    })
}

export function errorModal(msg) {
    if (!msg)
    {
        msg = <span name='AlertMessage'>Operation could not be completed. Contact Administrator</span>;
    }
    Modal.error({
        title: <span name='AlertTitle'>Error</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        content: <span name='AlertMessage'>{msg}</span>,
        okButtonProps: {
            'name': 'AlertOK'
        }
    });
}
export function warningModal(msg, callback) {
    if (msg == null) {
        msg = <span name='AlertMessage'>Operation could not be completed. Contact Administrator</span>;
    }
    Modal.warning({
        title: <span name='AlertTitle'>Error</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        content: <span name='AlertMessage'>{msg}</span>,
        onOk: callback,
        okButtonProps: {
            'name': 'AlertOK'
        }
    });
}
export function dynamicModal(data) {
    Modal.confirm({
        title: <span name='AlertTitle'>{data.title}</span>,
        icon: data.icon,
        content: <span name='AlertMessage'>{data.msg}</span>,
        cancelButtonProps: {
            type: "danger",
        },
        className: "dynamicModal",
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary rightBtnPop ',
        onOk: function () {
            data.onOk();
        },
        okButtonProps: {
            'name': 'AlertOK'
        },
        onCancel: function () {
            return data.onCancel ? data.onCancel() : false;
        },

    });
}

export function successModal(msg, props, pathname) {

    Modal.success({

        title: <span name='AlertTitle'>It's Done</span>,
        content: <span name='AlertMessage'>{msg}</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        okButtonProps: {
            'name': 'AlertOK'
        },
        onOk: function () {
            props.history.push({
                pathname: pathname
            });
        }
    });
}
export function resetPasswordSuccessModal(msg, props, pathname) {

    Modal.success({
        maskClosable: false,
        title: <span name='AlertTitle'>It's Done</span>,
        content: <span name='AlertMessage'>{msg}</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        okButtonProps: {
            'name': 'AlertOK'
        },
        onOk: function () {
            showProgress();
            window.location = "/";
        }
    });
}

export function updatePasswordSuccessModal(msg, props, pathname) {

    Modal.success({
        maskClosable: false,
        title: <span name='AlertTitle'>It's Done</span>,
        content: <span name='AlertMessage'>{msg}</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        okButtonProps: {
            'name': 'AlertOK'
        },
        onOk: function () {
            showProgress();
            fnLogout();
        }
    });
}


export function successModalCallback(msg, callback) {

    Modal.success({

        title: <span name='AlertTitle'>It's Done</span>,
        content: <span name='AlertMessage'>{msg}</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        onOk: callback,
        okButtonProps: {
            'name': 'AlertOK'
        }

    });
}

export function errorModalCallback(msg, callback) {
    if (msg == null) {
        msg = <span name='AlertMessage'>Operation could not be completed. Contact Administrator</span>;
    }
    Modal.error({
        title: <span name='AlertTitle'>Error</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        content: <span name='AlertMessage'>{msg}</span>,
        onOk: callback,
        okButtonProps: {
            'name': 'AlertOK'
        }
    });
}

function getDecryptedData() {
    if (!sessionStorage.hasOwnProperty(SESSION_KEY)) {
        return {};
    }
    const ciphertext = sessionStorage.getItem(SESSION_KEY);
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'dskey1120');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

export function getSesssionValue(key) {
    var decrypted = getDecryptedData();
    if (key in decrypted) {
        return decrypted[key];
    } else {
        return null;
    }
}
export function setSessionValue(key, data) {
    var sessionValue = {};
    if (sessionStorage.hasOwnProperty(SESSION_KEY)) {
        sessionValue = getDecryptedData();
    }
    sessionValue[key] = data;
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(sessionValue), 'dskey1120');
    sessionStorage.setItem(SESSION_KEY, ciphertext);
}

export function setProjestRoleSubmit(thisobj, project, role) {
    const thisObj = thisobj;
    const userProfile = JSON.parse(sessionStorage.userProfile);
    const { login } = thisobj.props;

    thisobj.props.form.validateFields(['RoleID'], { force: true }, (err, values) => {
        if (!err) {
            CallServerPost("Permission/GetPermissionLevelsForRole", { RoleID: parseInt(values.RoleID) })
                .then(function (response) {
                    let Project = project;
                    const Role = role;
                    let selectedRole = Role.filter(role => role.roleID == values.RoleID);

                    sessionStorage.setItem("project", JSON.stringify({ ProjectID: Project.ProjectID, ProjectName: Project.ProjectName }));
                    sessionStorage.setItem("role", JSON.stringify({ RoleID: selectedRole[0].roleID, RoleName: selectedRole[0].roleName }));
                    sessionStorage.setItem('permissions', JSON.stringify(response.value.permissions));
                    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
                    if (thisObj.props.handleCancel !== undefined) {
                        thisObj.props.handleCancel();
                    }
                    else {
                        thisObj.handleCancelProjectRoleSelectionModal();

                    }
                    login({ permissions: response.value.permissions });
                    thisObj.props.history.push('/trans');
                });
        }
    });

}

export function getProjectRole() {
    return { project: JSON.parse(sessionStorage.getItem("project")), role: JSON.parse(sessionStorage.getItem("role")), userProfile: JSON.parse(sessionStorage.getItem("userProfile")) };
}

export function getPermissions() {
    if (typeof localStorage.getItem("permissions") !== "undefined") {
        return JSON.parse(localStorage.getItem("permissions"));
    }
    return {};
}

export function getPermissionValue(objectCategory, objectName) {
    const allpermissions = JSON.parse(localStorage.getItem("permissions"));

}
export function getStudyDetails() {
    return validJSON(sessionStorage.getItem("studyDetails"));
}
export function fnLogout() {
    showProgress();
    PostCallWithZone('Login/Logout', {}).then(
        function (response)
        {
            clearToken();
            window.userParam = null;
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("permissions");
            sessionStorage.removeItem("userProfile");
            window.location = "/";

        }).catch(error => () =>
        {
            hideProgress();
            sessionStorage.clear();
            window.userParam = null;
            window.location = "/";
        });

}

export function getAddButtonText() {
    return "Add";
}
export function getEditButtonText() {
    return "Edit";
}
export const ADD_BTN_TEXT = "Add";

export function getSaveButtonText() {
    return "Save";
}

export function getConfirmButtonText() {
    return "Confirm";
}

export function getTimeZone() {
    const zones = moment.tz.guess();
    const timezone = moment.tz(zones).zoneAbbr();
    return timezone;
}


export function infoModal(msg) {
    if (msg == null) {
        msg = <span name="AlertMessage">Operation could not be completed. Contact Administrator</span>;
    }
    Modal.info({
        title: <span name="AlertTitle">Message</span>,
        okType: 'sc-ifAKCX fcfmNQ ant-btn-primary',
        content: <span name="AlertMessage">{msg}</span>,
        okButtonProps: {
            'name': 'AlertOK'
        }
    });
}

//For NProgress
export function showProgress() {
    Nprogress.start();
}
export function hideProgress() {
    Nprogress.done();
}
//End

//prev next fn used for codelist,variablelevelmetadata,valuelevel,whereclause
export function PrevNext(data, prev = false) {
    let siblings = data.siblings;

    //get tree key for Highlight purpose in tree when prev and next
    let k = data.treeNodeKey.split("-");
    let i = k.length - 1;
    k[i] = prev ? parseInt(k[i]) - 1 : parseInt(k[i]) + 1;

    //Get Selected Node means which one we are going to edit
    let index = siblings.findIndex(x => x.Key === data.Key);
    let node = siblings[index];

    if (node && typeof node === 'object') {
        let treeNodeKey = k.toString().replace(/,/g, "-");
        node = {
            ...node,
            prev: {
                ...siblings[index - 1],
                siblings: siblings,
                treeNodeKey: treeNodeKey
            },
            next: {
                ...siblings[index + 1],
                siblings: siblings,
                treeNodeKey: treeNodeKey
            }
        }
        return {
            data: node, treeNodeKey
        };
    }
    return null;
}
//End
export function validJSON(jsondata) {
    try {
        if (jsondata) {
            return JSON.parse(jsondata);

        } else {
            return {};
        }
    }
    catch {
        return {};
    }
}

export function workspacePermissions() {
    try {
        let permisn = sessionStorage.getItem("permissions");
        let parseJson = JSON.parse(permisn);
        let workspacePermission = parseJson.Project.Study.StudyWorkSpace;
        return workspacePermission ? workspacePermission : {};
    }
    catch {
        return {};
    }
}

export function annotationPermission(wrkflowstatus) {
    let studyDetails = validJSON(sessionStorage.getItem("studyDetails"));
    let userDetails = validJSON(sessionStorage.getItem("userProfile"));
    let role = validJSON(sessionStorage.getItem("role"));
    let locked = validJSON(sessionStorage.projectStudyLockStatus);
    let permisn = workspacePermissions();


    //AdminType Super & System admin
    //ADMIN ,Annotation Inprogress & Annotation Reviewer Role only have permission to annotate 
    //workflowActivityStatusID = 3 means  Annotation Inprogress
    //workflowActivityStatusID = 4 means  Annotation Reviewer
    //If the workflowActivityStatusID of the annotation is 3, then CRF Annotator can work(RoleID = 5 &&  workflowActivityStatusID = 3)
    //If the workflowActivityStatusID of the annotation is 4, then CRF Annotation Reviewer can work( RoleID = 6 && workflowActivityStatusID = 4 )
    //RoleId 5 means CRF Annotator
    //RoleId 6 means Annotation Reviewer
    //workflowActivityStatusID =  2 ? Annotation Assigned
    //workflowActivityStatusID = 3 ?  Annotation Inprogress
    //workflowActivityStatusID =  4 ?  AnnotationUnderReview
    //workflowActivityStatusID =  5 ? AnnotationReviewCompleted
    //workflowActivityStatusID = 18 ? AnnotationInitiated

    return (!locked &&
        (studyDetails && studyDetails.workflowActivityStatusID !== 15) && wrkflowstatus.workflowActivityStatusID !== 5 &&
        ((checkPermission(permisn, ['Annotation']) >= 4 && wrkflowstatus.workflowActivityStatusID !== 18 && wrkflowstatus.workflowActivityStatusID !== 2) ||
            (checkPermission(permisn, ['Annotation']) == 3 && (wrkflowstatus.workflowActivityStatusID === 3 || wrkflowstatus.workflowActivityStatusID === 4)) ||
            (checkPermission(permisn, ['Annotation']) == 2 && wrkflowstatus && wrkflowstatus.workflowActivityStatusID === 3) ||
            (checkPermission(permisn, ['Annotation']) == 1 && wrkflowstatus && wrkflowstatus.workflowActivityStatusID === 4)))
}

export function mappingPermission(wrkflowstatus) {
    let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
    let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
    let role = JSON.parse(sessionStorage.getItem("role"));
    let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
    let permisn = workspacePermissions();

    //AdminType Super & System admin
    //ADMIN ,Mapping Programmer & Mapping Reviewer only have permission to Annotate
    //If the workflowActivityStatusID of the Mapping is 7, then Mapping Programmer can work(RoleID = 5 &&  workflowActivityStatusID = 3)
    //If the workflowActivityStatusID of the Mapping is 8, then Mapping Reviewer can work( RoleID = 6 && workflowActivityStatusID = 4 )
    //RoleId 7 -> MappingAnalyst
    //RoleId 8 -> Mapping Reviewer
    //workflowActivityStatusID 6 ->  TransformationAssigned
    //workflowActivityStatusID 7 ->  TransformationInProgress
    //workflowActivityStatusID 8 ->	 TransformationUnderReview
    //workflowActivityStatusID 9 ->	 TransformationReviewCompleted
    //workflowActivityStatusID 15 -> StudyCompleted
    //workflowActivityStatusID 19 -> TransformationInitiated

    return (!locked &&
        (studyDetails && studyDetails.workflowActivityStatusID !== 15) && wrkflowstatus.workflowActivityStatusID !== 9 &&
        ((checkPermission(permisn, ['Mapping']) >= 4 && wrkflowstatus.workflowActivityStatusID !== 19 && wrkflowstatus.workflowActivityStatusID !== 6) ||
            (checkPermission(permisn, ['Mapping']) == 3 && (wrkflowstatus.workflowActivityStatusID === 7 || wrkflowstatus.workflowActivityStatusID === 8)) ||
            (checkPermission(permisn, ['Mapping']) == 2 && wrkflowstatus.workflowActivityStatusID === 7) ||
            (checkPermission(permisn, ['Mapping']) == 1 && wrkflowstatus.workflowActivityStatusID === 8)))
}

export function definePermission(wrkflowstatus) {
    let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
    let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
    let role = JSON.parse(sessionStorage.getItem("role"));
    let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
    let permisn = workspacePermissions();

    //AdminType Super & System admin
    //ADMIN ,DataAnalyst only have permission to work
    //RoleId 9 means Data Analyst
    //workflowActivityStatusID 10 ->  TransformationAssigned
    //workflowActivityStatusID 11 ->  TransformationInProgress
    //workflowActivityStatusID 12 ->  TransformationUnderReview
    //workflowActivityStatusID 13 ->  TransformationReviewCompleted
    //workflowActivityStatusID 15 ->  StudyCompleted
    //workflowActivityStatusID 20 ->  DefieGenInitiated
    

    return (!locked && (studyDetails && studyDetails.workflowActivityStatusID !== 15) &&
        wrkflowstatus.workflowActivityStatusID !== 13 &&
        wrkflowstatus.workflowActivityStatusID !== 10 &&
        ((checkPermission(permisn, ['Define']) >= 4 && wrkflowstatus.workflowActivityStatusID !== 20) ||       
            (checkPermission(permisn, ['Define']) == 3 && wrkflowstatus.workflowActivityStatusID !== 10) ||
            (checkPermission(permisn, ['Define']) == 2 && wrkflowstatus.workflowActivityStatusID === 11)
        ));
}

export function DefinePermissionCompleted(wrkflowstatus) {
    let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
    let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
    let role = JSON.parse(sessionStorage.getItem("role"));
    let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
    let permisn = workspacePermissions();

    //AdminType Super & System admin
    //ADMIN ,DataAnalyst only have permission to work
    //RoleId 9 means Data Analyst
    //workflowActivityStatusID 10 ->  TransformationAssigned
    //workflowActivityStatusID 11 ->  TransformationInProgress
    //workflowActivityStatusID 12 ->  TransformationUnderReview
    //workflowActivityStatusID 13 ->  TransformationReviewCompleted
    //workflowActivityStatusID 15 ->  StudyCompleted
    //workflowActivityStatusID 20 ->  DefieGenInitiated


    return (!locked &&
        wrkflowstatus.workflowActivityStatusID !== 10 &&
        ((checkPermission(permisn, ['Define']) >= 4 && wrkflowstatus.workflowActivityStatusID !== 20) ||
            (checkPermission(permisn, ['Define']) == 3 && wrkflowstatus.workflowActivityStatusID !== 10) ||
            (checkPermission(permisn, ['Define']) == 2 && wrkflowstatus.workflowActivityStatusID === 11)
        )) || wrkflowstatus.workflowActivityStatusID === 13 || (studyDetails && studyDetails.workflowActivityStatusID === 15);
}

export function XPTSuccessModal(data) {
    Modal.confirm({
        title: <span name='AlertTitle'>{data.title}</span>,
        icon: data.icon,
        content: <span name='AlertMessage'>{data.msg}</span>,
        cancelButtonProps: {
            type: "danger",
        },
        className: "dynamicModal",
        okType: 'sc-ifAKCX fcfmNQ saveBtn rightBtnPop ',
        okText: "View Dataset",
        onOk: function () {
            data.onOk();
        },
        okButtonProps: {
            'name': 'AlertOK'
        },


    });
}

export function getUserID() {
    try {
        let User = JSON.parse(sessionStorage.getItem("userProfile"));
        return User.userID;
    }
    catch (e) {
        return -1;
    }

}
export function getWebsocketInstance_State() {
    try {
        let readyState = JSON.parse(sessionStorage.getItem("web_socket_instance_state"));
        return readyState;
    }
    catch (e) {
        return 3;
    }

}

export function getStudyID() {
    try {
        let Study = JSON.parse(sessionStorage.getItem("studyDetails"));
        return Study.studyID;
    }
    catch (e) {
        return -1;
    }

}

export function getProjectID() {
    try {
        let Study = JSON.parse(sessionStorage.getItem("studyDetails"));
        return Study.projectID;
    }
    catch (e) {
        return -1;
    }

}
export const TreeSelectOptionLoop = (data, folderOnly, parent = -1) =>
    data.map(item => {
        if (item.children) {
            return (
                <Tree.TreeNode selectable={folderOnly && item.folder}
                    key={item.key}
                    value={item.key}
                    title={item.title}
                    parent={item.key}
                >
                    {TreeSelectOptionLoop(item.children, folderOnly, item.key)}
                </Tree.TreeNode>
            );
        }
        else {
            var selectable = true;
            if (folderOnly && !item.folder) {
                selectable = false;
            }
            if (item.key) {
                return <Tree.TreeNode
                    parent={parent}
                    selectable={selectable}
                    key={item.key}
                    value={item.key}
                    title={item.title}
                />;
            }
        }
    });

export function isNotNull(strnval) {
    return strnval && strnval !== null && typeof strnval === "string" && strnval.trim() !== "";
}

export function isArray(obj) {
    return obj && obj !== "" && typeof obj === "object" && obj.length > 0;
}
export function isObject(obj) {
    return obj && typeof obj === "object";
}
export function isObjectCheck(obj)
{
    return obj && typeof obj === "object" && Object.keys(obj).length > 0;
}

export function isNullishObject(obj) {
    var allempty = true;
    obj && Object.values(obj).every(value => {
        if (value &&  String(value) != "") {
            allempty = false;
        }
    });
    return allempty;
}

//checkin Mapping
//when call from datasettree.js ,resolve parameter have function
//when call from app.js resolve parameter will not be given .so ,default value is given
export function checkinMapping(resolve = () => { }) {
    //CheckIn Mapping Operation if it is CheckedOut
    let getAddMappingPending = getSesssionValue("MappingDeleteIsCheckOut");
    if (getAddMappingPending !== null) {

        //add
        if (getAddMappingPending.constructString === null && getAddMappingPending.isCheckedOut === 1) {
            showProgress();
            CallServerPost("MappingOperations/Delete", getAddMappingPending).then((response) => {
                if (response.status === 1) {
                    setSessionValue("MappingDeleteIsCheckOut", null);

                    //console.log("success");
                } else {
                    //console.log("error");
                }

                //when call from datasettree.js ,resolve parameter have function
                //when call from app.js resolve parameter will not be given .so ,default value is given
                resolve && resolve();
                hideProgress();
            });
        }
        else {
            resolve && resolve();
        }
    }


    let getUpdateMappingPending = getSesssionValue("MappingUpdateIsCheckOut");
    if (getUpdateMappingPending !== null) {
        if (getUpdateMappingPending.constructString !== null && getUpdateMappingPending.isCheckedOut === 1) {
            let mappingOperations = getUpdateMappingPending;
            mappingOperations.unsavedOrder = mappingOperations.unsavedOrder ? 1 : 0;
            mappingOperations.isCheckedOut = 0;
            let data1 = mappingOperations;
            showProgress();
            CallServerPost("MappingOperations/UpdateCheckInCheckOut", data1).then((response) => {
                if (response.status === 1) {
                    setSessionValue("MappingUpdateIsCheckOut", null);
                    //console.log("success");
                } else {
                    //console.log("Error");
                }

                // hideProgress();
                //when call from datasettree.js ,resolve parameter have function
                //when call from app.js resolve parameter will not be given .so ,default value is given
                resolve && resolve();
                hideProgress();
            });
        }
        else {
            resolve && resolve();
        }
    }

    //when call from datasettree.js ,resolve parameter have function
    //when call from app.js resolve parameter will not be given .so ,default value is given
    if (!getUpdateMappingPending && !getAddMappingPending) {
        resolve && resolve();

    }
}

//string lowercase
export function strLowerCase(str)
{
    return str && typeof str === "string" && str != "" && str.toLowerCase();
}

///string lowercase and trim
export function strLowerCaseTrim(str) {
    return str && typeof str === "string" && str != "" && str.toLowerCase().trim();
}


export function FormErrorIfArray(header, errObj,footer) {
    try {

        let errOb = [];
        errObj.map((er, i) => {
            if (errObj.indexOf(er) === i) {
                errOb.push(er)
            }
        });

        let err = [<div className="errorpop_map marginTopBottomFive">{header} </div>,
        <ol className="errOrderLi">{(errOb || []).map((er, i) => {
            return <li key={er}>
                {er}
            </li>
        })}

            </ol>, <div className="errorpop_map marginTopBottomFive">{footer} </div>];
        return err;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}