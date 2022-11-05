import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Redirect } from 'react-router-dom';
import DoughnutChart from './doughnut_chart';
import Bar from './bar_chart';


export default class AdminDashBoard extends Component
{
   
    render() {
        let permission = sessionStorage.getItem("permissions");

        return <Row className="dash_main_div_full">
            <Col className={"dash_main_div"} span={12}>
                <DoughnutChart permission={permission}/>
            </Col>
            <Col className={"dash_main_div"} span={12}>
                <Bar permission={permission}/>
            </Col>
        </Row>;

    }

}