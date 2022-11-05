import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Card, Row, Col, Select, Breadcrumb, Form } from 'antd';
import { Bar } from 'react-chartjs-2';
import { CallServerPost, errorModal, checkPermission, successModal, showProgress, hideProgress, validJSON } from '../Utility/sharedUtility';

const paddingsides = {
    paddingRight: 5
}
var thisObj;
export default class BarChartComponent extends Component {

    constructor(props) {
        super(props);

        let userprojectdetails = this.getUserProjectDetails();
        this.state = {
            labels: [],
            datas: [],
            role: userprojectdetails.role,
            user: userprojectdetails.user,
            userRole: userprojectdetails.userRole,
            project: userprojectdetails.project
        }
        thisObj = this;

    }
    //Admin Type
    getUserProjectDetails = () =>
    {
        try
        {
            let { permission } = this.props;
            let permissions = validJSON(permission);

            let user = JSON.parse(sessionStorage.getItem("userProfile"));
            let role = JSON.parse(sessionStorage.getItem("role"));
            let project = JSON.parse(sessionStorage.getItem("project"));
            return ({
                userRole: (checkPermission(permissions, ['AdminDashboard']) >= 4) ? "admin" : "manager",
                user: user,
                role: role,
                project: project
            })
        }
        catch (e)
        {
            return {};
        }
    }

    componentDidMount() {
        showProgress();
        try {
            let { permission } = this.props;

            let { userRole, project, role, user } = this.state;
            let permissions = validJSON(permission);

            //GetDashBoardData --> For Admin Role
            //GetDashBoardDataByRole --> For PM and SM Role
            let url = checkPermission(permissions, ['AdminDashboard']) >= 4 ? 'DashBoard/GetDashBoardData' : 'DashBoard/GetDashBoardDataByRole';
            let data = checkPermission(permissions, ['AdminDashboard']) >= 4 ? {} : { userID: user.userID, roleID: role.RoleID, projectID: project.ProjectID };

            CallServerPost(url, data)
                .then(
                    function (response) {
                        hideProgress();
                        let value = response.value;
                        if (value != null) {

                            if (value.length > 0) {
                                let label = [];
                                let datas = [];
                                Object.keys(value[0]).map(x => {
                                    var title = x;
                                    title = thisObj.getTitle(title);
                                    label.push(title);
                                    datas.push(value[0][x])
                                })
                                thisObj.setState({ datas: datas, labels: label })

                            }
                        } else {
                            //console.log(response.message);
                        }
                    }).catch((e) => { hideProgress(); });
        } catch (e) {
            hideProgress();
        }
    }

    //filter title
    getTitle = (title) => {
        switch (title.toLowerCase()) {
            case "usercount":
                return "User";
            case "projectactivecount":
                return "Active Project";
            case "projectinactivecount":
                return "InActive Project";
            case "studycount":
                return "Study";
            default:
                return "NO Title";
        }
    }

    setColor = () =>
    {
        let { permission } = this.props;
        let permissions = validJSON(permission);


           return checkPermission(permissions, ['AdminDashboard']) >= 4  ?
                    [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    ] :
                    [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    ]
    }
    render() {

        let { datas, labels } = this.state;

        const data = {
            labels: labels,
            datasets: [
                {

                    data: datas,
                    minBarLength: 1,

                    backgroundColor:this.setColor()
                },
            ],
        };

        return (
            <div className="dash_main_div_full">
                <Card className="dash_main_div_full_flex dash_main_card">

                    <Row className="dash_main_div_full">
                        <div className="chart-container dash_main_div_full"
                            style={{
                                "position": "relative",
                                height: "calc(100% - 4px)",
                                width: "100%"
                            }}>

                            <Bar
                                height={'100%'}
                                data={data}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    legend: {
                                        display: false,
                                        position: "left"
                                    },
                                    scales: {
                                        xAxes: [{
                                            barThickness: 73
                                        }],
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
                                    }
                                }}

                            />
                        </div>
                    </Row>
                </Card>
            </div>
        );
    }
}