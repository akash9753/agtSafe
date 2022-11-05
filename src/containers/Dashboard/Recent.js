import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from 'antd';
import { Card } from 'antd';
import { Row, Col } from 'antd';

const paddingsides = {
    paddingLeft: 5
}

const box = {
    borderRadius: "unset",
    border: "unset",
    marginBottom: 0
}

const customicon = {
    borderLeft: "5px solid #1890ff",
    paddingLeft: 7,
    marginBottom: 10
}

const borderbottom = {
    paddingLeft: 5,
    float: "left"
}


const float = {
    float: 'left'
}

const iconleft = {
    top: "25px",
    color: "#1890ff",
    position: "absolute",
    right: "30px",
    fontSize: "20px"
}

export default class Recent extends Component {
    render() {
        return (
            <div className="Recent" style={paddingsides}>
                <Card style={box}>

                    <div style={{ display: "inline-flex" }}>
                        <h2 style={customicon}>Recents</h2>
                        <i style={iconleft} className="fas fa-history"></i>
                    </div>

                    <div className="scrollboxRecent scrollbox_delayed">
                    <div className="scrollbox-content" >
                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Treeview</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop:3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Roles</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Users</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Standards</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Link 1</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Link 2</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow" style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Link 3</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow"  style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Link 4</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>

                            <div className="boxshadow"  style={{ width: "100%", display: "inline-block" }} >
                        <div>
                            <Badge style={float} status="processing" /><h3 style={borderbottom}>Link 5</h3>
                        </div>
                        <div>
                            <span style={{ marginBottom: 0, paddingTop: 3, float: "right" }}>Active 10min ago.</span>
                        </div>
                    </div>
                    </div>
                    </div>

                </Card>
            </div>
        );
    }
}

