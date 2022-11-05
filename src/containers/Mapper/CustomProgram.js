import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Spin, Icon, Row, Tooltip } from 'antd';
import ContentTab from '../TreeView/contentTab';
import Button from '../../components/uielements/button';
import {
    CallServerPost,
    errorModal,
    showProgress,
    hideProgress,
    XPTSuccessModal,
    mappingPermission
} from '../Utility/sharedUtility';
import CodeMirror from "../AdvancedUI/codeMirror/codeMirror.style";

const empty = "\n\n\n\n\n\n\n\n\n";
let thisObj = {};
class CustomProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            activeKey: '1',
            loading: false,
            valueset:false,
            datasetName: ""
        };

        thisObj = this;


    }

    static getDerivedStateFromProps(nextProps, currState) {
        if (!currState.valueset) {
            return { value: nextProps.customprogram, valueset: true };
        }
    }
    render() {

        const { value } = this.state;

        let getHeight = "calc(100vh - 202px)";
        return (

            <Modal
                title={
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <div><b>{"Custom Program - " + this.props.targetDomainVariable}</b></div>
                        <div style={{ width:"80%" }}>
                            <ContentTab showToggleIcon={false} actidetails={this.props.activityDetails} />
                        </div>
                    </div>
                }
                style={{ top: 20 }}
                maskClosable={false}
                width="98%"
                visible={this.props.customVisible}
                onOk={() => thisObj.props.saveprogram(value)}
                onCancel={this.props.cancelCustom}
            >

                
                <Row style={{
                    width: '100%', padding: "0px 5px",
                    height: getHeight
                }} >
                    <CodeMirror
                        value={this.state.value}
                        options={{
                            lineNumbers: true,
                            mode: this.props.programType == 1 ? "python" : "sas",
                            theme: "rubyblue"
                        }}
                        onBeforeChange={(editor, data, value) => {
                            thisObj.setState({ value });
                        }}
                        onChange={(editor, data, value) => {
                            editor.options.value = value;
                        }}
                        className="parentFulHeight"
                    />
                    
                </Row>

            </Modal >


        );
    }
}

export default CustomProgram;

