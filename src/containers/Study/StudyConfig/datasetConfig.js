import { Button, Col, Input, message, Modal, Row, Tree } from 'antd';
import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import {
    CallServerPost,
    errorModal, hideProgress, PostCallWithZone, showProgress, successModalCallback
} from '../../Utility/sharedUtility';
import DomainClassList from './customDomainClassList';
import CustomDomainList from './customDomainList';
import CustomVariableList from './customVariableList';
const { TreeNode } = Tree;
const { Search } = Input;

const tabStyle = { width: "100%" };
const rowStyle = { height: "calc(100vh - 138px)", paddingBottom: "10px" };
var thisObj;
export default class DatasetConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        thisObj = this;
    }

    static getDerivedStateFromProps(newProps, currentState) {
        let { activeKey } = newProps;
        if (activeKey === "Domain Config" && currentState.domainTreeData.length == 0) {
            thisObj.getList();
        } else if (activeKey !== "Domain Config") {
            return {
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
        }
    }

    //componentDidMount() {
    //    this.getList();
    //}
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
                        dataListArr.push({ title: inObj.domainClassName, key: inObj.cdiscDataStdDomainClassID.toString(), searchKey: inObj.cdiscDataStdDomainClassID.toString() });
                        return {
                            title: inObj.domainClassName,
                            key: inObj.cdiscDataStdDomainClassID.toString() + "class",
                            searchKey: inObj.cdiscDataStdDomainClassID.toString() + "class",
                            type: "class",
                            children: resObj["stdspec"].domainList.filter(fObj => fObj.cdiscDataStdDomainClassID == inObj.cdiscDataStdDomainClassID).map(domaininObj => {
                                dataListArr.push({ title: domaininObj.domain + " - " + domaininObj.domainDescription, key: domaininObj.cdiscDataStdDomainMetadataID.toString(), searchKey: inObj.cdiscDataStdDomainClassID.toString() + "_" + domaininObj.cdiscDataStdDomainMetadataID.toString() });
                                return {
                                    title: domaininObj.domain + " - " + domaininObj.domainDescription,
                                    key: domaininObj.cdiscDataStdDomainMetadataID.toString() + "domain",
                                    searchKey: domaininObj.cdiscDataStdDomainMetadataID.toString() + "domain",
                                    type: "domain",
                                    children: resObj["stdspec"].variableList.filter(fObj => fObj.cdiscDataStdDomainMetadataID == domaininObj.cdiscDataStdDomainMetadataID).map(varinObj => {
                                        dataListArr.push({
                                            title: varinObj.variableName + " - " + varinObj.variableLabel,
                                            key: inObj.cdiscDataStdDomainClassID.toString() + "_" + varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString(),
                                            searchKey: inObj.cdiscDataStdDomainClassID.toString() + "_" + varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString()
                                        });
                                        return {
                                            title: varinObj.variableName + " - " + varinObj.variableLabel,
                                            key: inObj.cdiscDataStdDomainClassID.toString() + "_" + varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString(),
                                            searchKey: inObj.cdiscDataStdDomainClassID.toString() + "_" + varinObj.cdiscDataStdDomainMetadataID.toString() + "_" + varinObj.cdiscDataStdVariableMetadataID.toString(),
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
                }
                hideProgress();
            }).catch(error => {
                hideProgress();
            });
    }
    onExpand = expandedKeys => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

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




    getParentKey = (searchVal, tree, parentKey) => {
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
                if (parentKey.length === 0 && parentKey.indexOf("AllKey") === -1) {
                    parentKey.push("AllKey");
                }
                parentKey.push(node.searchKey);
            }
            if (node.children) {//domain
                if (node.children.some(item => item.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1)) {
                    if (parentKey.length === 0 && parentKey.indexOf("AllKey") === -1) {
                        parentKey.push("AllKey");
                    }
                    parentKey.push(node.searchKey);
                    for (let j = 0; j < node.children.length; j++) {
                        const childnode = node.children[j];
                        if (childnode.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
                            parentKey.push(childnode.searchKey);//domains                           
                        }

                    }
                } //else {//variable
                    if (parentKey.length === 0 && parentKey.indexOf("AllKey") === -1) {
                        parentKey.push("AllKey");
                    }
                    for (let k = 0; k < node.children.length; k++) {
                        let domainNode = node.children[k];
                       // if (domainNode.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
                            //    parentKey.push(domainNode.searchKey);//domains
                            //    if (domainNode.children) {
                            //        if (domainNode.children.filter(items => items.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1).length > 0) {
                            //            parentKey = [...parentKey, ...domainNode.children.filter(items => items.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1).map(x => x.key)]

                            //        }
                            //    }
                            //} else {
                            if (domainNode.children) {
                                if (domainNode.children.some(items => items.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1)) {
                                    if (parentKey.indexOf(node.searchKey) === -1) {
                                        parentKey.push(node.searchKey);
                                    } if (parentKey.indexOf(domainNode.searchKey) === -1) {
                                        parentKey.push(domainNode.searchKey);
                                    }
                                    parentKey = [...parentKey, ...domainNode.children.filter(items => items.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1).map(x => x.key)]

                                }
                            }
                        //}

                    }
                //}
            }
        }
        return parentKey;
    };

    onSearchChange = e => {
        const { value } = e.target;
        const { domainTreeData, dataList } = this.state;

        let parentKey = [];
        if (value.length < 2) {
            this.setState({
                expandedKeys: ["AllKey"],
                searchValue: "",
                autoExpandParent: false,
            });
        } else {
            let expandedKeys1 = this.getParentKey(value, domainTreeData, parentKey);
            //let expandedKeys1 = dataList
            //    .map(item => {
            //        if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            //            parentKey = this.getParentKey(item.title, value, domainTreeData, parentKey);
            //            return parentKey;
            //        }
            //    }).filter(x => x !== undefined && x !== []);
            let expandedKey = expandedKeys1 !== undefined ? expandedKeys1 : ["AllKey"];
            this.setState({
                expandedKeys: expandedKey,
                searchValue: value,
                autoExpandParent: true,
            });
        }

    };

    handleUpdate = () => {
        const { checkedKeys, originalKeys, variableList } = this.state;
        if (checkedKeys.length <= 0) {
            message.error('Minimum one domain should be selected');
            return;
        }
        const thisObj = this;
        const addedkeys = checkedKeys.filter(ck => originalKeys.indexOf(ck) < 0 && ck.includes("_"));
        const removedkeys1 = originalKeys.filter(ck => checkedKeys.indexOf(ck) < 0 && ck.includes("_"));
        const removedkeys = variableList.filter(fObj => removedkeys1.indexOf(fObj.cdiscDataStdDomainClassID.toString() + "_" + fObj.cdiscDataStdDomainMetadataID.toString() + "_" + fObj.cdiscDataStdVariableMetadataID.toString()) >= 0).map(varobj => varobj.domainConfigurationID.toString())
        if (addedkeys.length <= 0 && removedkeys.length <= 0) {
            message.error('Nothing to update!');
            return;
        }

        const values = {
            "AddedKeys": addedkeys,
            "RemovedKeys": removedkeys,
            "StudyID": this.props.study.studyID,
            "ProjectID": this.props.study.projectID,
            "ChangeReason": "Domain Config Update"
        };
        showProgress();
        PostCallWithZone("DomainConfig/UpdateByStudy", values).then(responseData => {
            hideProgress();
            if (responseData.status == 0) {
                errorModal(responseData.message);
            }
            else {
                successModalCallback(responseData.message, thisObj.getList)
            }
        });



    }

    checkAvailability = () => {
        const studyObj = JSON.parse(sessionStorage.getItem("studyDetails"));
        return (JSON.parse(sessionStorage.getItem("project")).projectStatus === 5
            && studyObj.workflowActivityStatusID !== 15
            && studyObj.locked == false);
    }

    onTreeNodeSelect = (selectedKeys, e) => {
        if (e.node.props.type.trim().toLowerCase() == "domain" || e.node.props.type.trim().toLowerCase() == "class") {
            this.setState({ selectedKeys: selectedKeys, currentTreeNodeObject: e.node.props, selectedNode: e.node.props.type.trim().toLowerCase() });
        } else {
            this.setState({ selectedKeys: selectedKeys, currentTreeNodeObject: null, selectedNode: e.node.props.type.trim().toLowerCase() });
        }

    }

    render() {
        const { searchValue, domainTreeData, expandedKeys, selectedNode } = this.state;

        const renderTreeNodes = data =>
            data.map(item => {
                if (item !== undefined) {
                    const index = item.title.toLowerCase().indexOf(searchValue.toLowerCase());
                    const beforeStr = item.title.substr(0, index);
                    const afterStr = item.title.substr(index + searchValue.length);
                    const isSearch = searchValue.length >= 2;
                    if (!isSearch || expandedKeys.indexOf(item.key) > -1 || (!item.children && index > -1)) {
                        const title =
                            index > -1 ? (
                                <span>
                                    {beforeStr}
                                    <span style={{ color: '#f50' }}>{item.title.substr(index, searchValue.length)}</span>
                                    {afterStr}
                                </span>
                            ) : (
                                <span>{item.title}</span>
                            );
                        //if (item.children) {
                        //    return (
                        //        <TreeNode type={"domainclass"} key={item.key} title={title} dataRef={{ key: item.key, title: item.title }}>
                        //            {renderTreeNodes(item.children)}
                        //        </TreeNode>
                        //    );
                        //}
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
                        <Col style={{ height: "100%", paddingBottom: "35px" }} span={6}>
                            <Search style={{
                                marginBottom: 8,
                                width: "100%%"
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
                        <Col span={18}>
                            {
                                this.state.currentTreeNodeObject === null && selectedNode === "root" &&
                                <DomainClassList getList={this.getList} permissions={this.props.permissions} stdVersionID={this.props.study.standardVersionID} pageRefresh={null} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} checkAvailability={this.checkAvailability} />
                            }

                            {
                                this.state.currentTreeNodeObject !== null && selectedNode === "class" &&
                                <CustomDomainList getList={this.getList} permissions={this.props.permissions} stdVersionID={this.props.study.standardVersionID} allParents={{ "CDISCDataStdVersion": this.props.study.standardVersionID }} pageRefresh={null} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} checkAvailability={this.checkAvailability} />
                            }

                            {
                                this.state.currentTreeNodeObject !== null && selectedNode === "domain" &&
                                <CustomVariableList getList={this.getList} permissions={this.props.permissions} allParents={{ "CDISCDataStdVersion": this.props.study.standardVersionID }} pageRefresh={null} parentproperties={this} currentTreeNodeObject={this.state.currentTreeNodeObject} history={this.history} parentprops={this.props} cdiscDataStdDomainClassID={parseInt(this.state.expandedKeys[1])} checkAvailability={this.checkAvailability} />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Button
                                type="danger"
                                onClick={this.props.handleCancel}
                            >
                                {"Cancel"}
                            </Button>
                            {this.checkAvailability() &&
                                <Button
                                    onClick={this.handleUpdate}
                                    className="saveBtn"
                                    style={{ float: "right", right: "20px" }}
                                >
                                    {"Update"}
                                </Button>
                            }
                        </Col>
                    </Row>
                </div>
            </LayoutContentWrapper >
        );
    }
}