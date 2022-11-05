import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Card, Row, Col, Select, Breadcrumb, Form } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { CallServerPost, checkPermission, errorModal, successModal, showProgress, hideProgress, validJSON } from '../Utility/sharedUtility';

const paddingsides = {
    paddingRight: 5
}
var thisObj;
export default class BarChartComponent extends Component {

    constructor(props) {
        super(props);

        let userprojectdetails = this.getUserProjectDetails();
        this.state = {
            allflowkeys: [],
            allflowvalues: [],
            allflowColors: [],
            allProject: [],
            role: userprojectdetails.role,
            user: userprojectdetails.user,
            userRole: userprojectdetails.userRole,
            project: userprojectdetails.project
        }
        thisObj = this;
        thisObj.getAllStudyFlow();
        thisObj.getAllProject();
    }

    //Admin Type
    getUserProjectDetails = () =>
    {
        try {
            let { permission } = this.props;
            let permissions = validJSON(permission);

            let user = JSON.parse(sessionStorage.getItem("userProfile"));
            let role = JSON.parse(sessionStorage.getItem("role"));
            let project = JSON.parse(sessionStorage.getItem("project"));
            return ({
                userRole: checkPermission(permissions, ['AdminDashboard']) >= 4  ? "admin" : "manager",
                user: user,
                role: role,
                project: project
            })
        }
        catch (e) {
            return {};
        }
    }

    random_rgba = () => {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    }

    getAllProject = () => {



        //Getting all study Workflow 
        CallServerPost('Project/GetAllProject', {})
            .then(
                function (response) {

                    if (response.value != null) {
                        thisObj.setState({ allProject: response.value })
                    }

                });
    }

    getAllStudyFlow = () =>
    {

        let { userRole, project, role, user } = this.state;

        let url = (userRole === "admin") ? 'StudyWorkflow/GetAllForDash' : 'StudyWorkflow/GetAllByRoleUser';
        let data = (userRole === "admin") ? {} : { userID: user.userID, roleID: role.RoleID, projectID: project.ProjectID };

        //Getting all study Workflow 
        try {
            showProgress();
            CallServerPost(url, data)
                .then(
                    function (response) {
                        hideProgress();
                        if (response.value != null) {
                            var datas = [];

                            const flowList = response.value;

                            var allColors = [];
                            for (var i = 0; i < Object.keys(flowList).length; i++) {
                                var r = () => Math.random() * 256 >> 0;
                                allColors.push(`rgb(${r()}, ${r()}, ${r()})`);
                            }
                            //console.log(allColors)
                            //Setting values to state for re-rendering
                            thisObj.setState({ allflowkeys: Object.keys(flowList), allflowvalues: Object.values(flowList), allflowColors: allColors });
                        }

                    });
        }
        catch (e) {
            hideProgress();
        }
    }

    /*getBy Project */
    getByProject = (value) => {
        CallServerPost('StudyWorkflow/GetbyProject', { projectID: value })
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];

                        const flowList = response.value;

                        var allColors = [];
                        for (var i = 0; i < Object.keys(flowList).length; i++) {
                            var r = () => Math.random() * 256 >> 0;
                            allColors.push(`rgb(${r()}, ${r()}, ${r()})`);
                        }
                        //console.log(allColors)
                        //Setting values to state for re-rendering
                        thisObj.setState({ allflowkeys: Object.keys(flowList), allflowvalues: Object.values(flowList), allflowColors: allColors });
                    }

                });
    }
    render() {
        const { allProject, userRole } = this.state;
        const data = {
            labels: thisObj.state.allflowkeys,
            datasets: [
                {
                    label: 'All Studies',
                    data: thisObj.state.allflowvalues,
                    backgroundColor: [
                        "rgb(248, 12, 224)",
                        "rgb(33, 210, 227)",
                        "rgb(29, 170, 116)",
                        "rgb(40, 210, 185)",
                        "rgb(171, 159, 197)",
                        "rgb(176, 244, 44)",
                        "rgb(252, 89, 163)",
                        "rgb(42, 111, 61)",
                        "rgb(10, 56, 236)",
                        "rgb(218, 38, 59)",
                        "rgb(16, 54, 79)",
                        "rgb(130, 127, 36)",
                        "rgb(155, 155, 177)",
                        "rgb(140, 101, 216)",
                        "rgb(119, 123, 75)",
                        "rgb(182, 172, 197)",
                        "rgb(130, 237, 36)"
                    ]
                },
            ],
        };

        return (
            <div className="dash_main_div_full">
                <Card className="dash_main_div_full_flex dash_main_card">
                    <Row>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <i className="fas fa-tachometer-alt"></i>
                                <span> Dashboard</span>
                            </Breadcrumb.Item>

                        </Breadcrumb>
                    </Row>
                    <Row className="dash_main_div_full">
                        <div className="chart-container dash_main_div_full"
                            style={{
                                "position": "relative",
                                height: "calc(100% - 4px)",
                                width: "100%"
                            }}>

                            <Doughnut
                                data={data}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    legend: {
                                        display: false,

                                        //labels: {
                                        //    boxWidth: 10,
                                        //    padding:5
                                        //},
                                        //position: "left",
                                    }
                                }}
                            />
                        </div>
                    </Row>

                    {userRole === "admin" && < Row className="dash_main_div_flex" >
                        <Col span={6} className="dash_main_div_flex" >
                            <Form.Item label="Project">

                                <Select
                                    className={"dash_main_select"}
                                    placeholder={"--Select--"}
                                    defaultValue="all"
                                    onChange={(va) => {
                                        if (va === "all") {
                                            this.getAllStudyFlow();
                                        } else {
                                            this.getByProject(va)
                                        }
                                    }}
                                >
                                    <Select.Option key={1} value={"all"}>All</Select.Option>
                                    {allProject.map(pro => (
                                        <Select.Option value={pro.projectID}>{pro.projectName}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>}
                </Card>
            </div>
        );
    }
}