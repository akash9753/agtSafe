import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Badge, Icon, Button, Tooltip } from 'antd';
import { Card } from 'antd';
import Dashboard from "../Dashboard/dashboard.js";
import ButtonWithToolTip from "../Tooltip/ButtonWithToolTip.js";
import { setHeader } from '../Topbar/Topbar';



const paddingsides = {
    paddingLeft: 5,
    paddingRight:5
}

const box = {
    borderRadius: "unset",
    borderTop: "unset",
    borderLeft: "1px solid #e8e8e8",
    borderRight: "1px solid #e8e8e8",
    borderBottom: "unset",
    marginBottom: 0
}

const customicon = {
    borderLeft: "5px solid #faad14",
    paddingLeft: 7,
    marginBottom: 10
}

const iconleft = {
    color:"#faad14",
    position: "absolute",
    right: "0px",
    fontSize: "20px"
}


export default class StudyList extends Component {
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return (
            <div className="StudyList" style={paddingsides} >
                <Card style={box}>
                    <div style={{display:"inline-flex"}}>
                        <h2 style={customicon}>Work to be done </h2>
                        <ButtonWithToolTip tooltip={this.props.tooltipName} style={iconleft} classname={this.props.iconClassName} btnclassName="fullViewBtn" onClick={this.props.sideToggle} />
                    </div>

                    <div className="scrollboxStudylist scrollbox_delayed">
                        <div className="scrollbox-content dashboard-removepadding">

                            <Dashboard permissions={this.props.permissions} history={this.props.history} />
                    </div>
                    </div>
                     </Card>
             </div> 
                    );
    }
}