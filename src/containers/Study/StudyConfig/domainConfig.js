import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import { Tree, Breadcrumb, Input, Row, Col, Button, message, Modal } from 'antd';
import {
    showProgress,
    hideProgress,
    CallServerPost,
    errorModal,
    successModalCallback,
    PostCallWithZone
} from '../../Utility/sharedUtility';
import StdDomainList from '../../Standards/cDISCDataStdDomainList.js';
import CustomVariableList from './customVariableList';
import DomainClassList from './customDomainClassList';
import CustomDomainList from './customDomainList';
const { TreeNode } = Tree;
const { Search } = Input;

const tabStyle = { width: "100%" };
const rowStyle = { height: "calc(100vh - 138px)", paddingBottom: "10px" };

export default class DomainConfig extends Component {
    state = {
        expandedKeys: ["AllKey"],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        domainTreeData: [],
        searchValue: '',
        dataList: [],
        originalKeys: [],
        variableList: [],
        currentTreeNodeObject: null,
        selectedNode: ""
    };

    componentDidMount() {
        this.getList();
    }

    getList = (props) => {
        Modal.destroyAll()
        showProgress();
        const thisObj = this;
        CallServerPost('DomainConfig/GetByStudy',
            {
                StudyID: this.props.study.studyID
            })
            .then(function (response) {
                if (response.status == 1) {
                    const resObj = response.value;
                    let checkedKeysArr = [];
                    const dataListArr = [];
                    const tObj = resObj["stdspec"].domainClassList.map(inObj => {
                        dataListArr.push({ title: inObj.domainClassName, key: inObj.cdiscDataStdDomainClassID.toString() });
                        return {
                            title: inObj.domainClassName,
                            key: inObj.cdiscDataStdDomainClassID.toString() + "class",
                            type: "class",
                            children: resObj["stdspec"].domainList.filter(fObj => fObj.cdiscDataStdDomainClassID == inObj.cdiscDataStdDomainClassID).map(domaininObj => {
                                dataListArr.push({ title: domaininObj.domain + " - " + domaininObj.domainDescription, key: domaininObj.cdiscDataStdDomainMetadataID.toString() });
                                return {
                                    title: domaininObj.domain + " - " + domaininObj.domainDescription,
                                    key: domaininObj.cdiscDataStdDomainMetadataID.toString() + "domain",
                                    type: "domain",
                                    children: resObj["stdspec"].variableList.filter(fObj => fObj.cdiscDataStdDomainMetadataID == domaininObj.cdiscDataStdDomainMetadataID).map(varinObj => {
                                        dataListArr.push({
                                            title: varinObj.variableName + " - " + varinObj.variableLabel,
                                            key: varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString()
                                        });
                                        return {
                                            title: varinObj.variableName + " - " + varinObj.variableLabel,
                                            key: inObj.cdiscDataStdDomainClassID.toString() + "_" + varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString(),
                                            type: "variable"
                                        }
                                    })
                                }
                            })
                        }

                    })

                    resObj["domainconfig"].map(df => {
                        checkedKeysArr.push(df.cdiscDataStdDomainClassID.toString() + "_" + df.cdiscDataStdDomainMetadataID.toString() + "_" +
                            df.cdiscDataStdVariableMetadataID.toString());
                    });

                    thisObj.setState({
                        domainTreeData: tObj,
                        checkedKeys: checkedKeysArr,
                        dataList: dataListArr,
                        originalKeys: checkedKeysArr,
                        variableList: resObj["domainconfig"]
                    });
                } else {
                
}
                hideProgress();
            }).catch(error => {
                hideProgress();
            });
    }

    onSearchChange = e => {
        const { value } = e.target;
        const { domainTreeData, dataList, expandedKeys } = this.state;
        if (value.length < 2) {
            this.setState({
                expandedKeys,
                searchValue: "",
                autoExpandParent: false,
            });
        } else {
            const expandedKeys = dataList
                .map(item => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, domainTreeData);
                    }
                    return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            this.setState({
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        }

    };

    checkAvailability = () => {
        const studyObj = JSON.parse(sessionStorage.getItem("studyDetails"));
        return (JSON.parse(sessionStorage.getItem("project")).projectStatus === 5
            && studyObj.workflowActivityStatusID !== 15
            && studyObj.locked == false);
    }

    onCheck = (checkedKeys, affectedKey) => {
        if (affectedKey && typeof affectedKey === "object") {
            let { node, checked } = affectedKey;
            let { props } = node ? node : {};
            let { eventKey } = props;
            if (!checked) {
                const thisObj = this;
                const values = {
                    "affectedKey": eventKey,
                    "StudyID": this.props.study.studyID,
                    "ProjectID": this.props.study.projectID,
                    "ChangeReason": "Domain Treedata unchecked"
                };
                showProgress();
                PostCallWithZone("DomainConfig/CheckforMappingOperations", values).then(responseData => {
                    hideProgress();
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                        thisObj.setState(st => {
                            return ({ checkedKeys: st.checkedKeys });
                        });
                    }
                    else {
                        this.setState({ checkedKeys });
                    }
                });
            }
            else {
                this.setState({ checkedKeys });
            }
        }
    };

    render() {

        const { searchValue, domainTreeData, expandedKeys, selectedNode } = this.state;
        const renderTreeNodes = data =>
            data.map(item => {
                if (item !== undefined) {
                    const index = item.title.indexOf(searchValue);
                    const beforeStr = item.title.substr(0, index);
                    const afterStr = item.title.substr(index + searchValue.length);
                    const isSearch = searchValue.length >= 2;
                    if (!isSearch || expandedKeys.indexOf(item.key) > -1 || (!item.children && index > -1)) {
                        const title =
                            index > -1 ? (
                                <span>
                                    {beforeStr}
                                    <span style={{ color: '#f50' }}>{searchValue}</span>
                                    {afterStr}
                                </span>
                            ) : (
                                <span>{item.title}</span>
                            );
                        if (item.children) {
                            return (
                                <TreeNode type={item.key.indexOf("domain") >= 0 ? "domain" : "class"} key={item.key} title={title} dataRef={{ key: item.key, title: item.title }}>
                                    {renderTreeNodes(item.children)}
                                </TreeNode>
                            );
                        }
                        return <TreeNode type={"variable"} key={item.key} title={title} dataRef={{ key: item.key, title: item.title }} />;
                    }
                }
            });
        return (
            <LayoutContentWrapper className="NoPaddingBottom">
                <div style={tabStyle}>
                    <Row style={rowStyle}>
                        <Col style={{ height: "100%", padding: "5px", border: "1px solid", borderColor:"#e5e5e5" }} span={6}> {/* Domain Config TreeView */}
                            <Search style={{
                                marginBottom: 8,
                                width: "100%"
                            }}
                                placeholder="Search"
                                onChange={this.onSearchChange}
                            />
                            <Tree
                                style={{ height: "100%", overflow: "auto" }}
                                checkable={this.checkAvailability()}
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onTreeNodeSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                <TreeNode
                                    key={"AllKey"}
                                    title={this.props.study.standardText + " " + this.props.study.standardVersionText}
                                    type={"root"}
                                >
                                    {renderTreeNodes(domainTreeData)}
                                </TreeNode>

                            </Tree>
                        </Col>
                        <Col span={18} style={{ height: "100%", padding: "5px", border: "1px solid", borderColor: "#e5e5e5" }}>{/* Custom Domain Variables */}

                        </Col>
                    </Row>
                </div>
            </LayoutContentWrapper>
            )
    }
}
