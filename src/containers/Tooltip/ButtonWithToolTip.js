import React, { Component } from 'react';
import { Tooltip } from 'antd';
import Button from '../../components/uielements/button';

export default class ButtonWithToolTip extends Component {


    render() {

        return (
            <Tooltip title={this.props.disabled ? "" :( this.props.tooltip != null ? this.props.tooltip : "")}>
                <Button
                    onClick={this.props.onClick}
                    shape={this.props.shape}
                    icon={this.props.icon}
                    size={this.props.size}
                    style={this.props.style}
                    className={this.props.btnclassName}

                    disabled={this.props.disabled}
                    tabIndex="0"
                    id={this.props.id}
                    name={this.props.name}
                    action={this.props.action}
                >
                    {this.props.classname != null ? <i className={this.props.classname} /> : null}
                </Button>
            </Tooltip>

        );
    }
}

