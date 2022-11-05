import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'antd';
import { Layout } from 'antd';
import { getProjectRole } from '../Utility/sharedUtility';
import GettingStarted from './GettingStarted';
import Recent from './Recent';
import StudyList from './dashboard';
import Notifications from './Notifications';


import './DashBoardBeta.css'

const Content = Layout;
const projectRole = getProjectRole();

export default class DashBoardBeta extends Component {
    
constructor(props) {
        super(props);
        this.state = {

        };
       }



    render() {
        
        return (

            
    (
            <Layout>

                        <Content>
                            <Row >                 

                                <Col span={24}>
                                <div style={{ padding: '10px' }}>   

                                    <Col span={24}><StudyList permissions={this.props.permissions} history={this.props.history} /></Col>

                                    </div>
                                </Col>

                            </Row>
                        </Content>
         
            </Layout> )
        );
    }
}  