import React, { Component } from "react";
import axios from 'axios';
import {
    Row,
    Modal,

    Form,
    Button,
    Tabs
} from "antd";

import MonacoEditor from '@uiw/react-monacoeditor';
let thisObj = "";
export default class SASViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sasmacro: props.sasmacro,
            minSize: "100%",
            loading: false
        };
        thisObj = this;
    }
    
    

    executeSAS = () => {
        const thisObj = this;
       
        const execmacro = this.state.sasmacro;
        const payload = {
            'program': execmacro,
            'dataset': 'dm',
            'key_values': 'DM_KEY = SUBJID',
            'raw_location': '\\\\172.16.2.36\\TransBot_Workspace\\SharedFiles\\Source',
            'out_location': '\\\\172.16.2.36\\TransBot_Workspace\\SharedFiles\\Out'
        };
        //console.log(JSON.stringify(payload));
        const url = 'http://172.16.2.241:9001/execsas/';
        this.props.setProgress(true);
        return axios.post(url, payload)
            .then(function (response) {
                const res = response.data;
                //console.log(res);
                thisObj.props.handleSASResult(res);
                Modal.success({
                    content: 'Code Executed Successfully',
                });
                thisObj.props.setProgress(false);
            })
            .catch(function (error) {
                //console.log(error);
                Modal.error({
                    title: 'Error',
                    content: 'Code Executed Failed',
                });
                thisObj.props.setProgress(false);
            });
    }

    render() {
        const { sasmacro, loading } = this.state;

        return <div style={{ height: "100%" }}>

            <Row gutter={2} style={{ height: "92%" }}>
                <MonacoEditor
                    language="sas"
                    value={sasmacro}
                    onChange={(newValue, e) => { thisObj.setState({ sasmacro: newValue }); }}
                    options={{
                        theme: 'vs-dark',
                    }}
                />
            </Row>
            <Row gutter={2} style={{ paddingTop: 10, paddingBottom: 10 }}>

                <Button
                    style={{ float: "right" }}
                    className="saveBtn"
                    onClick={this.executeSAS}
                >
                    <i className="fas fa-save" style={{ paddingRight: 2 }}> {"Run"}</i>
                </Button>
            </Row>

        </div>
    }
}
