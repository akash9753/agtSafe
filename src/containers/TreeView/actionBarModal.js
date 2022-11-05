import React, { Component } from 'react';
import { Modal } from 'antd';
import Input from '../../components/uielements/input';
import ViewStudy from '../Study/StudyConfig/ViewStudyConfiguration/ViewStudy';
import AnnotatedCRFModalContent from './AnnotatedCRFModalContent';
import ProtocolDocumentModalContent from './ProtocolDocumentModalContent';
import StdSpecModalContent from './StdSpecModalContent';
import SourceDataSetModalContent from './SourceDataSetModalContent';
import MozillaPdfViewer from './mozillaPdfViewer';
import CommentModal from './comments';
import { CallServerPost, errorModal, successModal, getStudyDetails, getProjectID } from '../Utility/sharedUtility';


var datas = [];
var allDataSource = [];
var dataSource = [];

export default class ActionBarModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            disableBtn: false
        }
    }

    setModalCancel = (enable) => {
        this.setState({ disableBtn: enable });
    }

    render() {
        const { loading } = this.state;


        const content = (modalVal) => {
            const thisObj = this;
            if (modalVal == "View Study") {
                return (
                    <ViewStudy tabName={"Study Details"} activeKey={"Study Details"} projectID={getProjectID()} study={getStudyDetails()} />
                );
            } else if (modalVal == "Annotated CRF") {
                if (thisObj.props.fileName != "") {
                    return (
                        <MozillaPdfViewer fileName={thisObj.props.fileName} />
                    );
                }
            }
            else if (modalVal == "Protocol Document") {
                if (thisObj.props.fileName != "") {
                    return (
                        <MozillaPdfViewer fileName={thisObj.props.fileName} />
                    );
                }
            }
            else if (modalVal == "Std Spec") {
                return (
                    <StdSpecModalContent sourceData={this.props.sourceData} valueData={this.props.valueData} />
                );
            }
            else if (modalVal == "Source Dataset") {
                return (
                    <SourceDataSetModalContent sourceData={this.props.sourceData} valueData={this.props.valueData} />
                );
            }
            else if (modalVal === "Comment") {
                return (
                    <CommentModal isProjectInActive={sessionStorage.projectStudyLockStatus} projectID={JSON.parse(sessionStorage.studyDetails).projectID.toString()} studyID={JSON.parse(sessionStorage.studyDetails).studyID.toString()} fnToSetDisableCancel={this.setModalCancel}/>
                );
            }
        };

        return (
            <div>
                {
                    (this.props.visible) ? (<Modal
                        visible={this.props.visible}
                        maskClosable={false}
                        style={{ top: 1, height: 'calc(100vh - 120px)' }}
                        title={JSON.parse(sessionStorage.getItem("studyDetails")).studyName + " - " + this.props.title}
                        width={'85%'}
                        onCancel={this.state.disableBtn ? null : this.props.handleCancel}
                        footer={null}
                        ref="modal"
                    >
                        {content(this.props.modal)}
                    </Modal>) : null
                }
                
            </div>
        );
    }
}