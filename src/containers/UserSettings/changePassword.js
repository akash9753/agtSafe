import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Icon, Col, Row, Select, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal } from '../Utility/sharedUtility';


export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (<span>My Profile</span>);
    };

}
