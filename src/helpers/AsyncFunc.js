import React, { Component } from 'react';
//import Nprogress from 'nprogress';
import ReactPlaceholder from 'react-placeholder';
//import 'nprogress/nprogress.css';
import 'react-placeholder/lib/reactPlaceholder.css';

//Changed the Default spin into antd spin
import {Icon, Spin } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

export default function asyncComponent(importComponent, permissions) {
  class AsyncFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
        loading: true
      };
    }
    componentWillMount() {
      //Nprogress.start();
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    async componentDidMount() {
      this.mounted = true;
      const { default: Component } = await importComponent();
      //Nprogress.done();
      if (this.mounted) {
        this.setState({
            component: <Component {...this.props} permissions={permissions} />, loading: false        });
      }
    }
    debugger;
    render() {
      const Component = this.state.component || <div />;
      debugger;
        return (
            //<Spin style={{ position: 'absolute', zIndex: 9999, backgroundColor: "rgb(255,255,255,0.7)", width: "100vw", height: "100vh", pointerEvents: "none" }} indicator={antIcon} spinning={this.state.loading}>
            <ReactPlaceholder type="text" rows={7} ready={Component !== null}>
                {Component}
                </ReactPlaceholder>
            //</Spin>
      );
    }
  }
  return AsyncFunc;
}
