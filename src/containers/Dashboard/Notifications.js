import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Badge, Icon } from 'antd';
import { Card } from 'antd';
import { Avatar } from 'antd';


const paddingsides = {
    paddingRight: 5
}

const box = {
    borderRadius: "unset",
    border: "unset"
}

const customicon = {
    borderLeft: "5px solid #52c41a",
    paddingLeft: 7,
    marginBottom: 10
}

const iconleft = {
    top: "25px",
    color: "#52c41a",
    position: "absolute",
    right: "30px",
    fontSize: "20px"
}


export default class Notifications extends Component {
    render() {
        const { studyList } = this.props;

        return (
            <div className="Notifications" style={paddingsides}>

                <Card style={box}>
                    <div style={{ display: "inline-flex" }}>
                        <h2 style={customicon}>Notifications</h2>
                        <i className="fas fa-bell" style={iconleft}></i>
                    </div>

                    <div className="scrollboxNotifications scrollbox_delayed">
                        <div className="scrollbox-content">
                            {
                                studyList.map(function (key, index)
                                {
                                    return (  <div className="boxshadow" style={{ display: "inline-flex" }}>
                                        <div style={{ marginTop: "5px", marginRight: "5px" }}>
                                            <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
                                        </div>

                                        <div style={paddingsides}>
                                            <a href="javascript:void(0);">{key.studyName + " has been moved to " + key.workflowActivityStatusText}</a>
                                            <br />
                                        </div>
                                    </div>)
                                })
                        }

                        </div>
                    </div>

                </Card>

            </div>
        );
    }
}