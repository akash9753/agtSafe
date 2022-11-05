import React, { Component } from 'react';
import asyncComponent from '../../helpers/AsyncFunc';

let page = "dashboard";
export default class Root extends Component {
    constructor(props) {
        super(props);

        
    }

    render() {
        if (typeof this.props.location.state != 'undefined') {
            page = this.props.location.state.pageName;
        }
        let PageElement = "";
        switch (page) {
            case "dashboard":
                PageElement =  asyncComponent(() => import('../Dashboard/dashboard'));
                break;
            case "viewusers":
                PageElement = "";
                break;
            default:
                PageElement = asyncComponent(() => import('../Dashboard/dashboard'));
                break;
        }
        return (<PageElement />);

    }

}