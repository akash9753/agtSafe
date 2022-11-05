import React, { Component } from 'react';
import { Comment, Avatar, Form, Button, List, Input, Row, Col, Spin, Icon, message, Card } from 'antd';
import moment from 'moment-timezone';
import { getAddButtonText, CallServerPost, errorModal, getProjectRole, getTimeZone, infoModal, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { NewListWrapper } from './newListComponent.style';

const { TextArea } = Input;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const getUserDetails = JSON.parse(sessionStorage.getItem("userProfile"));
var thisObj = [];
const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);
const Editor = ({ onChange, onSubmit, value, permissions }) => (
    <div>
        <Form.Item>
            <Avatar style={{ color: '#fff', backgroundColor: '#87d068', marginRight: "10px", marginTop: "-70px", marginLeft:"-10px" }}>{(getUserDetails.userName.toUpperCase()).match(/\b(\w)/g)}</Avatar>
            <TextArea
                placeholder="Enter your comment"
                autoFocus={true}
                style={{
                    width: "90%",
                    marginTop: "30px",
                    resize: "none"
                     }}
                rows={4}
                maxLength={1024}
                onChange={onChange}
                value={value}
                name="Comment" />
        </Form.Item>
        <Form.Item>
            <Button style={{ float: "right", marginTop: "-53px" }} name="Add" disabled={JSON.parse(thisObj.props.isProjectInActive) ? true : JSON.parse(thisObj.props.isProjectInActive)} onClick={onSubmit} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn'>
                {getAddButtonText()}
            </Button>
        </Form.Item>
        <p style={{ float: "right", marginTop: "-18px", marginRight:"70px" }}>{value.length} / 1024</p>
    </div>
);

export default class CommentModal extends Component {
    chatContainer = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            value: '',
            selectedID: 1,
            showEditor: false,
            loading: false,
            workflowTabList: [],
            disableBtn: false
        };
        thisObj = this;
        CallServerPost("StudyReviewComment/GetAllWorkflowActivity", {}).then(
            function (response) {
                if (response.status === 1) {
                    thisObj.setState({ workflowTabList: response.value});
                } else {
                    thisObj.setState({ workflowTabList: [] });
                }

            }).catch(error => error);
            this.getCommentList();
    }

    scrollToMyRef = () => {
        const scroll =
            this.chatContainer.current.scrollHeight -
            this.chatContainer.current.clientHeight;
        this.chatContainer.current.scrollTo(0, scroll);
    };

    handleSubmit = () => {
        if (this.state.value !== "") {
            var values = {};
            const projectRole = getProjectRole();
            values["CommentText"] = this.state.value;
            values["WorkflowActivityID"] = this.state.selectedID;
            values["StudyID"] = this.props.studyID;
            values["ProjectID"] = this.props.projectID;
            values["TimeZone"] = getTimeZone();
            values["UpdatedBy"] = projectRole.userProfile.userID;
            values["ChangeReason"] = "Created";
            const thisObj = this;
           // thisObj.props.fnToSetDisableCancel(true);
            thisObj.setState({ loading: true, disableBtn: true });
            CallServerPost("StudyReviewComment/Create", values).then(
                function (response) {
                    if (response.status === 1) {
                        var getComments = thisObj.state.comments;
                        getComments.push({
                            author: <b>{getUserDetails.userName.toUpperCase()}</b>,
                            avatar: <Avatar style={{ color: '#fff', backgroundColor: '#87d068' }}>{(getUserDetails.userName.toUpperCase()).match(/\b(\w)/g)}</Avatar>,
                            content: <p>{thisObj.state.value}</p>,
                            datetime: thisObj.getTimeFormat(new Date())
                        });
                        thisObj.setState({ loading: false, disableBtn: false, comments: getComments, value: '' }, () => thisObj.scrollToMyRef());
                        this.scrollToMyRef();
                    }
                    else {
                        thisObj.setState({ loading: false, value: '', disableBtn: false });
                        errorModal("Error on submitting comment.");
                    }
                    thisObj.props.fnToSetDisableCancel(false);
                }).catch(error => error);
        } else {
            errorModal('Please enter the comment');
        }     
    };

    //componentDidUpdate(prevProps, prevState) {
    //    setTimeout(
    //        function () {
    //            this.setState({ loading: false });
    //        }
    //            .bind(this),
    //        500
    //    );
    //}
   

    handleChange = e =>
    {
       
        this.setState({
            value: e.target.value.replace(/\s\s+/g,' '),
        });
    };

    getTabList = (tab) => {
        const { selectedID } = this.state;
        const colors = ["#7ED321", "#de1b1b", "#511E78", "#ff9009", "#42a5f5"];
        const activeClass = selectedID === tab.workflowActivityID ? 'active' : '';
        const onClick = () => this.onTabClicked(tab.workflowActivityID);
        return (
            <div className={`isoList ${activeClass}`} key={tab.workflowActivityID}>
                <div
                    className="isoNoteBGColor"
                    style={{ width: '5px', background: colors[0] }}
                />
                <div className="isoNoteText" onClick={onClick}>
                    <h3 name={tab.name + "_List"}>{tab.description}</h3>
                </div>
            </div>
        );
    }

    getTimeFormat = (fullDate) => {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var day = fullDate.getDate();
        var monthIndex = fullDate.getMonth();
        var year = fullDate.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    getCommentList = (id) => {
        const thisObj = this;
        var values = {};
        values["WorkflowActivityID"] = thisObj.state.selectedID;
        values["StudyID"] = thisObj.props.studyID;
        values["ProjectID"] = thisObj.props.projectID;
        showProgress();
        CallServerPost("StudyReviewComment/GetStudyReviewCommentByWorkflowActivityID", values).then(
            function (response) {
                hideProgress();
                if (response.status === 1) {
                    var getComments = [];
                    for (var i = 0; i < response.value.length; i++) {
                        getComments.push({
                            author: <b>{response.value[i].updatedUser.toUpperCase()}</b>,
                            avatar: <Avatar style={{ color: '#fff', backgroundColor: '#87d068' }}>{(response.value[i].updatedUser.toUpperCase()).match(/\b(\w)/g)}</Avatar>,
                            content: <p>{response.value[i].commentText}</p>,
                            datetime: thisObj.getTimeFormat(new Date(response.value[i].updatedDateTime.substring(0, 10)))
                        });
                    }
                    thisObj.setState({ loading: false, comments: getComments, value: '' }, () => thisObj.scrollToMyRef());
                }
                else {
                    thisObj.setState({ loading: false, comments: [], value: '' });
                }
            }).catch(error => error);
    }

    onTabClicked = (id) => {
        this.setState({ selectedID: id, showEditor: true, loading: true});
        this.getCommentList(id);
     }
    render() {
        const { comments, value, showEditor } = this.state;
        const tabList = this.state.workflowTabList;
        const permissions = this.props.permissions;
        return (
            <div>
                <NewListWrapper style={{ height: 'calc(100vh - 120px)' }}>
                    <Spin indicator={antIcon} spinning={this.state.loading}>
                    <Row>
                        {/*<Col span={6} style={{ paddingRight: "5px", borderRight: "1px solid #e9e9e9" }}>*/}
                        {/*    <div className="isoNoteList" style={{ height: 'calc(100vh - 125px)' }}>*/}
                        {/*        {tabList && tabList.length > 0 ? (*/}
                        {/*            tabList.map(tab => this.getTabList(tab))*/}
                        {/*        ) : (*/}
                        {/*                <span className="isoNotlistNotice">No work flow activity found</span>*/}
                        {/*            )}*/}
                        {/*    </div>*/}
                        {/*</Col>*/}
                            <Col span={18} style={{ paddingLeft: "5px" }}>
                                <div style={{ height: 'calc(100vh - 125px)', width:"132%" }}>
                                    <div ref={this.chatContainer} style={{ height: 'calc(100vh - 280px)', overflow: "auto"  }}>
                                        {comments.length > 0 ? <CommentList comments={comments} /> :
                                            <p style={{ fontSize: "15px", fontWeight: 600, textAlign: "center", paddingTop: '100px' }}>
                                                <Icon type="info-circle" style={{ fontSize: '25px', color: '#2b90ff', marginLeft: '-30px', marginTop: '-2px', position: 'absolute' }} />
                                                No comments found
                                                </p>
                                        }
                                    </div>
                                    
                                    <Comment
                                       
                                        content={<Editor
                                                onChange={this.handleChange}
                                                onSubmit={this.handleSubmit}
                                                value={value}
                                            permissions={permissions}

                                            />
                                        }
                                    />
                                </div>
                            </Col>
                        
                        </Row>
                        </Spin>
                </NewListWrapper>
            </div>
        );
    }
}