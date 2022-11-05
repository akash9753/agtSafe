
import React, { Component } from 'react';
import { getProjectRole, validJSON, checkPermission, fnLogout } from '../Utility/sharedUtility';
import DashBoardBeta from './index';
import AdminDashBoard from './adminDashBoard';
import axios from 'axios';
const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
var userProfile = JSON.parse(sessionStorage.getItem("userProfile"));

export default class DashMain extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        if (sessionStorage.getItem("sessionID") === null) {
            const url = urlBase + 'Login/LoginCreate';
            return axios.post(url, userProfile)
                .then(function (response) {
                    if (response.data.status === 1) {
                        sessionStorage.setItem("sessionID", response.data.value);
                    } else {
                        fnLogout();
                    }
                })
                .catch(error => error);
        }
    }

    isAdminOrManager = () =>
    {

        let allPermissions = sessionStorage.getItem("permissions");
        let parsePermission = validJSON(allPermissions);
        //Check if admin dashboard permissions are available
        return checkPermission(parsePermission, ['AdminDashboard']) >= 4 || checkPermission(parsePermission, ['ManagerDashboard']) >= 4;
    }

    render() {
        const projectRole = getProjectRole();


        if (this.isAdminOrManager()) {
            return <AdminDashBoard  />;
        } else {
            return <DashBoardBeta permissions={this.props.permissions} history={this.props.history} />;
        }

    }

}