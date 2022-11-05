import React, { Component } from 'react';
import { Tree, List, Icon } from 'antd';
import {
    validJSON,
    showProgress,
    hideProgress,
    CallServerPost,
    errorModal,
    errorModalCallback,
    successModalCallback,
    successModal,
    PostCallWithZone,
    DownloadFileWithPostData,
    checkPermission,
    getProjectRole
} from '../Utility/sharedUtility';
import { string } from 'prop-types';
import { ContactsWrapper } from '../../styles/JsStyles/projects.style';
import { ContactListWrapper } from '../../styles/JsStyles/projectList.style';
import './datasetConfig.css';
const { TreeNode } = Tree;


const tabStyle = { height: "calc(100vh - 160px)", overflowY: "scroll" };
export default class DatasetConfig extends Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        domainListData: [],
        active: false,
        cdiscDataStdDomainMetadataID: -1
    };
    componentDidMount() {
        this.getList();
    }
    getList = (props) => {
        showProgress();
        const thisObj = this;
        CallServerPost('CDISCDataStdVariableMetadata/GetStdVarMetaForProject',
            {
                ProjectID: this.props.project.projectID
            })
            .then(function (response) {
                //console.log(response)
                if (response.status == 1) {
                    const resObj = response.value;
                    const datasetArr = Array.from(new Set(resObj.map(a => a.domain)))
                        .map(domain => {
                            return resObj.find(a => a.domain === domain)
                        })
                    //const tObj = datasetArr.map(inObj => {
                    //    return {
                    //        title: inObj.domain,
                    //        key: inObj.cdiscDataStdDomainMetadataID,
                    //    }
                    //})

                    thisObj.setState({
                        domainListData: datasetArr
                    });
                }
                hideProgress();
            }).catch(error => {
                hideProgress();
            });
    }


    listAllDomains = (domain) => {

        const activeClass = (this.state.active && domain.cdiscDataStdDomainMetadataID == this.state.cdiscDataStdDomainMetadataID ? ('active') : (''));

        return (

            <div className={`isoSingleContact ${activeClass}`} key={domain.cdiscDataStdDomainMetadataID}>
                <div className="isoNoteBGColor" style={{}}>
                </div>
                <div className="isoNoteText"
                    key={domain.cdiscDataStdDomainMetadataID}
                    onClick={() => { }}
                >
                    <h3 name={domain.domain + "_List"}>{domain.domain}</h3>

                    <span className="isoNoteCreatedDate">
                        {domain.domain}
                    </span>
                </div>
            </div>

        );
    }


    render() {
        const { domainListData } = this.state;
        return (
            <div style={tabStyle}>
                <ContactsWrapper
                    className="domainList isomorphicContacts"
                    style={{ padding: 0 }}
                >
                    <div className="isoContactListBar" style={{ width: "100%", background: "#fff" }}>
                        <ContactListWrapper className="isoContactListWrapper" style={{}}>
                            <div className="isoContactList">
                                {domainListData.map(domainR => this.listAllDomains(domainR))}
                            </div>
                        </ContactListWrapper>
                    </div>
                </ContactsWrapper>
            </div>
        );
    }
}