import React, { Component } from 'react';
import { Col, Row, Form,Input } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import FileInput from 'react-fine-uploader/file-input'
import ProgressBar from 'react-fine-uploader/progress-bar'
import { successModalCallback, errorModal } from '../Utility/sharedUtility';
import { fnForBrowse } from '../Utility/validator';
const FormItem = Form.Item;

var thisObj;
var callBack = {};
const urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
var path = "";
var setPathTo = "";
let uploader = null;
let counter = 1;
let updatedfilename = "";
    
    
export function fnUploadFiles(param, callback, errorFunc) {
    //console.log(thisObj);
    callBack = { value: param, cb: callback, errorMethod: errorFunc };

    if (thisObj.props.props.props.props.form.getFieldValue(thisObj.props.id) != null) {
        if (uploader.methods._storedIds.length > 0) {
            counter = 1;
            updatedfilename = "";

            uploader.methods.uploadStoredFiles();
        }
        else {
            callBack.value.CodeListFilePath = updatedfilename;

            callBack.cb(callBack.value)
        }
    } else {
        updatedfilename = "";
        uploader.methods.clearStoredFiles();
        callBack.cb(callBack.value)

    }

}

export function fnUploadCancel(param, callback) {
    updatedfilename = "";

    uploader.methods.clearStoredFiles();
}

class FnUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imgid: -1,
            fileName: (this.props.defaultValue != "" && this.props.defaultValue != null) ? this.props.defaultValue.replace(/^.*[\\\/]/, ''):  "No file",
            src: ""
        };

        thisObj = this;
        setPathTo = thisObj.props.id;
    }


    componentWillReceiveProps(props) {

       
    }

    componentWillMount() {
        uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false,
                chunking: {
                    enabled: true,
                    mandatory: true,
                    //partSize: 10000,
                    //success: {
                    //    jsonPayload: true,
                    //    endpoint: urlBase + "Domain/FileConsume",
                    //    customHeaders: {
                    //        Authorization: sessionStorage.getItem("authorizeToken")
                    //    },
                    //}
                },
                request: {
                    endpoint: urlBase + "File/FileReceiver",
                    customHeaders: {
                        Authorization: sessionStorage.getItem("authorizeToken"),
                        UserID: JSON.parse(sessionStorage.userProfile).userID
                    },
                    params: {
                        type: "1",
                        path: "",
                        counter : 1
                    }
                },
                callbacks: {
                    onComplete: function (imgid, fileName, json, xhr) {
                        if (json.success) {
                            callBack.cb(callBack.value)
                        }
                        else {
                            //thisObj.props.props.formData.find(x => x.attributeName.replace(/ /g, "") === thisObj.props.id).defaultValue = fileName;
                            callBack.errorMethod();
                            errorModal(xhr.statusText);
                            thisObj.setState({ fileName })

                        }
                    },
                }

            }
        })
    }
    componentDidMount() {
        
        uploader.on('submitted', (imgid, fileName) => {
            let temp = {};
            let tempID = thisObj.props.id;
            temp[tempID] = fileName;
            if (thisObj.props.format != undefined) {
                if (fileName.substr(fileName.lastIndexOf('.')) == thisObj.props.format) {
                    thisObj.props.props.props.props.form.setFieldsValue(temp);
                    thisObj.setState({ imgid: imgid, fileName: fileName });
                }
                else {
                    errorModal("Not a valid file");
                    updatedfilename = "";

                    uploader.methods.clearStoredFiles();
                }                
            }
            else {
                thisObj.props.props.props.props.form.setFieldsValue(temp);

                thisObj.setState({ imgid: imgid, fileName: fileName });
            }
        
        })
        uploader.on('uploadChunkSuccess', (imgid, junkData, responseJSON, xhr) => {
            counter++;
            //thisObj.props.props.formData.find(x => x.attributeName.replace(/ /g, "") === thisObj.props.id).defaultValue = responseJSON.path;
            path = responseJSON.path;
            updatedfilename = responseJSON.path;
            callBack.value[thisObj.props.id] = responseJSON.path;
            uploader.methods.setParams({ type: thisObj.props.pageName, path: responseJSON.path, counter : counter }, imgid);
        })
      
        uploader.on('upload', (imgid, fileName) => {
            counter = 1;
            thisObj.setState({ fileName })

        })
    }

    render() {
        uploader.options.request.customHeaders.Authorization = sessionStorage.getItem("authorizeToken");        
        const { imgid, fileName } = this.state;
        const { props, id, defaultValue, field } = this.props;
        return (
            <FormItem
                label={field.displayName}
            >

            <Row >
                    <Col sm={24} xs={24} md={24} style={{ height:"32px"}}>
                    <div style={{ display: "flex", flexDirection: "column" }}>

                            <FileInput /*className="disabledFileUploader"*/ title={""} uploader={uploader} accept={this.props.format}>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <span className="input-group-text custom-inputChooseFile" id="inputGroupFileAddon01" >Choose File</span>
                                </div>
                                <div className="custom-file" >
                                        <Input type="file" style={{border: "unset"}} disabled={!this.props.disabled}/>                   
                                    {props.getFieldDecorator(id, {
                                            rules: [{ required: (field.inputRequirementText == 'Mandatory') ? true : false, message: field.requirementErrorMessage }],
                                            initialValue: defaultValue,
                                            //validateTrigger: ['onKeyup', 'onBlur'],
                                            valuePropName: 'value',
                                        })(<Input type="text" size="small" placeholder="No File" name={field.displayName} className="custom-file-label" disabled={!this.props.disabled} style={{ pointerEvents: "none", width: "100%", height: "38px" }} />)}

                                </div>
                            </div>
                        </FileInput>

                    {/*    <ProgressBar id={imgid} uploader={uploader} />*/}
                    </div>
                </Col>
            </Row>
            </FormItem>

        );
    }
}

const WrappedApp = Form.create()(FnUpload);
export default WrappedApp;