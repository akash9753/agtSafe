import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from 'antd';
import { Card } from 'antd';

const paddingsides = {
    paddingLeft: 5
}

const box = {
    borderRadius: "unset",
    borderTop: "unset",
    borderLeft: "unset",
    borderRight: "unset",
    borderBottom: "1px solid #e8e8e8",
    marginBottom: 5
}
const customicon = {
    borderLeft: "5px solid #e5777d",
    paddingLeft: 7,
    marginBottom: 10
}

const iconleft = {
    top: "25px",
    color: "#e5777d",
    position: "absolute",
    right: "30px",
    fontSize: "20px"
}


export default class GettingStarted extends Component {
    render() {
        return (
            <div className="GettingStarted" style={paddingsides}>
                <Card style={box}>

                    <div style={{ display: "inline-flex" }}>
                        <h2 style={customicon}>Getting started</h2>
                        <i style={iconleft} className="fas fa-ellipsis-h"></i>
                    </div>

                    <div className="scrollboxGettingstarted scrollbox_delayed">
                        <div className="scrollbox-content">
                            <p className="boxshadow">
                        <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                            <p className="boxshadow">
                      <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                            <p className="boxshadow">
                       <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                            <p className="boxshadow">
                      <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                            <p className="boxshadow">
                      <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                            <p className="boxshadow">
                        <Badge status="error" /> <a href="javascript:void(0);">Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count</a>
                    </p>

                    </div>
                    </div>

                    </Card>
                   
            </div>
        );
    }
}