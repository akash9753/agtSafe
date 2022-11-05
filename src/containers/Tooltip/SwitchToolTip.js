import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { Switch, Icon } from 'antd';

export default class SwitchToolTip extends Component {


    render() {

        return (
            <Tooltip title={this.props.disabled? "" : this.props.switchtooltip}>
                <Switch
                    size={this.props.size}
                    onChange={this.props.onChange}
                    userid={this.props.userID}
                    thisobj={this.props.thisObj}
                    checkedChildren={this.props.checkedChildren}
                    unCheckedChildren={this.props.unCheckedChildren}
                    checked={this.props.checked}
                    disabled={this.props.disabled}
                    className={this.props.classname}
                    style={this.props.style}
                    name={this.props.name}
                    action={this.props.action}
                />
            </Tooltip>
        );
    }
}