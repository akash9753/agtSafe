import React from 'react';
import { Icon, Badge, Tooltip, Modal } from 'antd';
//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { checkPermission } from '../Utility/sharedUtility';
import Button from '../../components/uielements/button';
//SwitchToolTip Importing
import SwitchToolTip from '../Tooltip/SwitchToolTip';

const margin = {
    margin: '0 10px 0 0'
};
var getAdminType = JSON.parse(sessionStorage.getItem("userProfile")).adminType;
var currentuserID = JSON.parse(sessionStorage.getItem("userProfile")).userID;
export function ActionColumn(property) {
    //console.log(property)
    let datas = JSON.parse(property.value);
    let { usersList, perLevel, user, permissions } = datas;
    let { props } = property;

    const userid = usersList.userID;
    const userName = usersList.userName;
    const userstatusid = usersList.userStatusID;
    const updatedDateTimeText = usersList.updatedDateTimeText;
    const showDeleteConfirm = (userid) => {
        Modal.confirm({
            title: 'Are you sure to logout this user?',
            content: 'Make sure the user closed all active tabs.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                props.fnForceUserTologout(userid);
            },
            onCancel() {
                
            },
        });
    }
    return <div style={{ display: "flex", justifyContent:"center"  }}>
    <div style={{ width: "fit-content" }}>
        {perLevel >= 1 && usersList.userStatusID != 3 ? <ButtonWithToolTip
            name={usersList.userName + "_Edit"}
            tooltip={perLevel >= 2 ? "Edit" : "View"}
            shape="circle"
            classname="fas fa-pen"
            size="small"
            style={margin}
            action={() => props.editUser(userid, permissions)}
        /> : null}

        {checkPermission(permissions, ["ResetPassword"]) >= 2 && usersList.userID != currentuserID && usersList.userStatusID != 3 ? <ButtonWithToolTip
            name={usersList.userName + "_ResetPassword"}
            tooltip="Reset Password"
            shape="circle"
            size="small"
            style={margin}
            classname="fas fa-unlock-alt"
            action={() => props.confirmReset(userid, userName)}
        /> : null}

        {perLevel >= 2 && usersList.userID != currentuserID ? <SwitchToolTip name={usersList.userName + "_Switch"} style={margin} switchtooltip={usersList.userStatusID == 2 ? "Active" : "Inactive"} size="small"
            onChange={(e) => { props.showUserStatusModal(userid, userstatusid, updatedDateTimeText) }}
            userID={userid} user={props} checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="cross" />}
            action={(e) => { props.showUserStatusModal(userid, userstatusid, updatedDateTimeText) }}
            checked={usersList.userStatusID == 2 ? true : false}
        /> : null}

        {checkPermission(permissions, ["LogInAndLogoutNotification"]) == 4 && usersList.userID != currentuserID ?

            
                <Button
                    style={margin}
                    action={() => showDeleteConfirm(userid)}
                    shape="circle"
                    size="small"
                    disabled={usersList.loginActivity === "1" ? false : true}>

                    <Badge status={usersList.loginActivity === "1" ? 'success' : 'error'}>
                        <Icon type="user" />
                    </Badge>
                </Button>  : null}

        </div>
    </div>;

}