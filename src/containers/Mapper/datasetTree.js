import React, { Component } from "react";
import DataContext from "../TreeView/DataContext";
import { InputSearch } from "../../components/uielements/input";
import { MappingData, MappingDatas } from "../TreeView/getMappingDatas";
import {
    Button,
    Tabs,
    Menu, Empty,
    Dropdown
} from "antd";
import Tree, { TreeNode } from '../../components/uielements/tree';
import { showProgress, hideProgress, CallServerPost, checkinMapping, validJSON } from '../Utility/sharedUtility';

const { TabPane } = Tabs;
const SOURCE = "Source";
const TARGET = "Target";
const WORK = "Work";

let SourceTreeHTML = [];
let TargetTreeHTML = [];
let WorkTreeHTML = [];
let thisObj = {};
var istargetloading = false;
export default class DatasetTree extends Component {
    static contextType = DataContext;

    constructor(props) {
        super(props);
        this.state = {
            activeKey: "1",
            sourceConfig: {
                autoExpandParent: true,
                expandedKeys: ["ALL"],
                sourceSearch: "",
                selectedKeys: ["ALL"]
            },
            targetConfig: {
                autoExpandParent: true,
                expandedKeys: ["ALL"],
                targetSearch: "",
                selectedKeys: ["ALL"]
            },

            workConfig: {
                expandedKeys: [],
                autoExpandParent: true,
                workSearch: "",
                selectedKeys: []
            },
            mappingBlocks: [],
            sourceTables: [],
            sourceTree: [],
            targetTree: [],
            workTree: [],
        };
        thisObj = this;
    }

    static getDerivedStateFromProps(newProps, currState)
    {
        if (newProps.refreshToChooseAllNodeTree) {
            thisObj.setState((sta) => ({
                sourceConfig: { ...sta.sourceConfig, selectedKeys: ["ALL"], targetSearch: "" },
                targetConfig: { ...sta.targetConfig, selectedKeys: ["ALL"],targetSearch: "" },
                workConfig: { ...sta.workConfig, workSearch: "" }
            }));
        }
    }

    tabChanged = value => {
        let { sourceConfig, targetConfig, workConfig } = this.state;
        this.setState({
            activeKey: value,
            sourceConfig: { ...sourceConfig, targetSearch: "" },
            targetConfig: { ...targetConfig, targetSearch: "" },
            workConfig: { ...workConfig, workSearch: "" }
        });
    };

    //Blocks Initialization


    TabSearch = (type) => {
        const thisob = this;
        let { sourceConfig, targetConfig, workConfig } = this.state;

        return (
            <InputSearch
                id={type + "DsSearch"}
                key={type + "srcDsSearch"}
                placeholder={"Search " + type + " Datasets"}
                onChange={event => {
                    event.preventDefault();
                    let value = event.target.value.toLowerCase();
                    if (type === SOURCE) {
                        let out = this.getSourceTree(thisob.context, value, true);

                        thisob.setState({
                            sourceTree: event.target.value ? out.tree : [],
                            sourceConfig: {
                                ...sourceConfig,
                                expandedKeys: out.expanded,
                                sourceSearch: value
                            }
                        });
                    } else if (type === TARGET) {
                        let out = this.getTargetTree(thisob.context, value, true);
                        thisob.setState({
                            targetTree: event.target.value ? out.tree : [],
                            targetConfig: {
                                ...targetConfig,
                                expandedKeys: out.expanded,
                                targetSearch: value
                            },

                        });
                    } else if (type === WORK) {
                        const { work_datasets } = this.props;

                        let out = this.getWorkTree(work_datasets, value, true);
                        thisob.setState({
                            workTree: event.target.value ? out.tree : [],
                            workConfig: {
                                ...workConfig,
                                expandedKeys: out.expanded,
                                workSearch: value
                            }


                        });
                    }
                }}
                allowClear
            />
        );
    }

    getSourceDataSet = (domain) => {
        const thisob = this;
        let isExists = false;

        thisob.props.sourceTables.map((tables) =>
        {
            if (tables.name === domain) {
                isExists = true;
            }
        })
        if (isExists) {
            thisob.props.updateSourceTables({}, domain);
            return;
        }
        showProgress();

        CallServerPost('Py/GetSourceDataset', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, TableName: domain })
            .then(
                function (response) {
                    if (response.value != null) {
                        //console.log(response);
                        const dsvalue = {
                            name: domain,
                            values: response.value
                        };

                        const newtables = [...thisob.props.sourceTables, dsvalue];
                        thisob.props.updateSourceTables({ sourceTables: newtables }, domain);
                        hideProgress();
                    }
                });
    }


    getTargetDataSet = (domain) => {
        const thisob = this;
        let isExists = false;

        istargetloading = true;
        showProgress();
        let study = JSON.parse(sessionStorage.getItem("studyDetails"));
        CallServerPost('MappingOperations/GetTargetDataset', { StudyID: study.studyID, StudyName: study.studyName, TableName: domain })
            .then(
                function (response) {
                    hideProgress();
                    if (response.value != null) {
                        //console.log(response);
                        const dsvalue = {
                            name: domain,
                            values: response.value
                        };

                        const newtables = [...thisob.props.sourceTables, dsvalue];
                        thisob.props.updateSourceTables({ sourceTables: newtables }, domain);
                       
                    }
                });
    }

    getSourceTree = (allValues, searchText = "", search = false) => {
        const thisobj = this;

        let expanded = ["ALL"];

        const srcNodeMenu = (domain) => {
            return (
                <Menu>
                    <Menu.Item onClick={() => { this.getSourceDataSet(domain) }} key="view_src_ds">View Dataset</Menu.Item>
                </Menu>
            );
        }

        const getTitle = (name, check = false) => {
            return (searchText && name.toLowerCase().indexOf(searchText) != -1) || check ? <div>
                <Dropdown overlay={srcNodeMenu(name)} trigger={['contextMenu']}>
                    <div style={{ color: (searchText && name.toLowerCase().indexOf(searchText) != -1) ? "red" : "black" }}>
                        {name}
                    </div>
                </Dropdown>
            </div> : false;
        }

        let srcTree = allValues.SourceDataset.Domain.map((domain) => {

            let variablesList = allValues.SourceDataset.Variable.filter(
                variable => variable.TABLE_NAME === domain.TABLE_NAME
            );
            // <Dropdown overlay={srcNodeMenu} trigger={['contextMenu']}></Dropdown>



            let parentMatch = getTitle(domain.TABLE_NAME)
            //children 
            let child = variablesList.map((variable) => {
                let title = variable.COLUMN_NAME;
                title = !searchText ? title : title.toLowerCase().indexOf(searchText) != -1 ?
                    <span style={{ color: "red" }}>{title}</span>
                    : parentMatch ? title : "NoMatch"

                return title != "NoMatch" ? (<TreeNode selectable
                    key={domain.TABLE_NAME + "_" + variable.COLUMN_NAME}
                    isVariable
                    title={title}
                    name={variable.COLUMN_NAME}
                    dataSet={domain.TABLE_NAME} />) : false
            })

            //For Search purpose
            let isHavingChild = child.some(c => c);

            if (!searchText || isHavingChild || getTitle(domain.TABLE_NAME, isHavingChild)) {
                expanded = [...expanded, domain.TABLE_NAME];
                return (
                    <TreeNode
                        key={domain.TABLE_NAME}
                        title={getTitle(domain.TABLE_NAME, true)}
                        isDataSet
                        name={domain.TABLE_NAME}
                    >
                    {
                        child
                    }
                    </TreeNode>
                );
            } else {
                return false;
            }

        });

        if (search != false) {
            return ({ tree: srcTree, expanded: !searchText ? [] : [...new Set(expanded)] })
        } else {
            // why because we are using props by context provider
            SourceTreeHTML = srcTree;
        }
    }

    getTargetTree = (allValues, searchText = "", search = false) => {

        const thisobj = this;
        let expanded = ["ALL"];

        const srcNodeMenu = (domain) => {
            return (
                <Menu>
                    <Menu.Item onClick={() => { this.getTargetDataSet(domain) }} key="view_tgt_ds">View Dataset</Menu.Item>
                </Menu>
            );
        }

        const getTitle = (name, check = false) => {
            return (searchText && name.toLowerCase().indexOf(searchText) != -1) || check ? <div>
                <Dropdown overlay={srcNodeMenu(name)} trigger={['contextMenu']}>
                    <div style={{ color: (searchText && name.toLowerCase().indexOf(searchText) != -1) ? "red" : "black" }}>
                        {name}
                    </div>
                </Dropdown>
            </div> : false;
        }

        const targetDomains = [...new Set(allValues.MappingList.map(x => x.cdiscDataStdDomainMetadataID))];

        //Loop
        let targetTree = targetDomains.map((domainID) => {

            let variablesList = allValues.MappingList.filter(
                variable => variable.cdiscDataStdDomainMetadataID === domainID
            );
            let domainMeta = allValues.Standards.Domain.find(x => x.cdiscDataStdDomainMetadataID == domainID);


            if (domainMeta) {
                //fr search
                //let parentMatch = searchText ? domainMeta.domain.toLowerCase().indexOf(searchText) != -1 : true;
                let parentMatch = getTitle(domainMeta.domain);
                //child loop
                let child = variablesList.map((variable) => {
                    const varMetadata = allValues.Standards.Variable.find(x => x.cdiscDataStdDomainMetadataID == domainID && x.cdiscDataStdVariableMetadataID == variable.cdiscDataStdVariableMetadataID);
                    if (varMetadata) {
                        let title = varMetadata.variableName;
                        title = !searchText ? title : title.toLowerCase().indexOf(searchText) != -1 ?
                            <span style={{ color: "red" }}>{title}</span>
                            : parentMatch ? title : "NoMatch"

                        return (title != "NoMatch" ? <TreeNode selectable
                            key={"target_" + domainMeta.domain + "_" + varMetadata.variableName}
                            isVariable
                            name={varMetadata.variableName}
                            title={title}
                            dataSet={domainMeta.domain} /> : false)
                    } else {
                        return false;
                    }

                })

                //search purpose
                let isHavingChild = child.some(c => c);

                if (!searchText || isHavingChild || getTitle(domainMeta.domain, isHavingChild)) {

                    expanded = [...expanded, "target_" + domainMeta.domain];
                    return <TreeNode
                        key={"target_" + domainMeta.domain}
                        title={getTitle(domainMeta.domain, true)}
                        name={domainMeta.domain}
                        isDataSet
                    >
                        {
                            child
                        }
                    </TreeNode>
                }
                else {
                    return false;
                }
            }
        });

        if (search != false) {
            return ({ tree: targetTree, expanded: !searchText ? [] : [...new Set(expanded)] })
        } else {
            // why because we are using props by context provider
            TargetTreeHTML = targetTree;
        }
    }

    getWokDataSet = (domain) => {
        const thisob = this;
        showProgress();

        CallServerPost('Py/GetWorkData', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, dataset: domain, username: JSON.parse(sessionStorage.userProfile).userName })
            .then(
                function (response) {
                    if (response.value != null && 'dataset' in response.value) {
                        //console.log(response);
                        thisob.props.addWorkTable(validJSON(response.value.dataset), domain);

                    }
                    hideProgress();
                });
    }

    getWorkTree = (work_datasets, searchText = "", search = false) => {
        const thisobj = this;
        let expanded = [];
        const wrkNodeMenu = (domain) => {
            return (
                <Menu>
                    <Menu.Item onClick={() => { this.getWokDataSet(domain) }} key="view_wrk_ds">View Dataset</Menu.Item>
                    <Menu.Item key="delete_wrk_ds">Delete</Menu.Item>
                </Menu>
            )
        };
        const getTitle = (name, check = false) => {
            return (searchText && name.toLowerCase().indexOf(searchText) != -1) || check ? <div>
                <Dropdown overlay={wrkNodeMenu(name)} trigger={['contextMenu']}>
                    <div style={{ color: (searchText && name.toLowerCase().indexOf(searchText)) != -1 ? "red" : "black" }}>
                        {name}
                    </div>
                </Dropdown>
            </div> : false;
        }

        const workDomains = [...new Set(work_datasets.map(x => x.memname))];
        let workTree = workDomains.map((workDs) => {
            let parentMatch = getTitle(workDs);


            const vars = work_datasets.filter(v => v.memname === workDs);

            //Child Element
            let child = vars.map((variable) => {
                let title = variable.name;
                title = !searchText ? title : title.toLowerCase().indexOf(searchText) != -1 ?
                    <span style={{ color: "red" }}>{title}</span>
                    : parentMatch ? title : "NoMatch"

                return (title != "NoMatch" ? <TreeNode selectable
                    key={"workn_" + workDs + "_" + variable.name}
                    isVariable
                    title={title}
                    name={variable.name}
                    dataSet={workDs} /> : false
                )
            })


            //search purpose
            let isHavingChild = child.some(c => c);

            if (!searchText || isHavingChild || parentMatch) {

                expanded = [...expanded, "work_main" + workDs];
                return (
                    <TreeNode
                        key={"work_main" + workDs}
                        title={getTitle(workDs, true)}
                        name={workDs}
                        isDataSet
                    >
                        {
                            child
                        }

                    </TreeNode>
                );
            } else {
                return false;
            }
        });

        if (search != false) {
            return ({ tree: workTree, expanded: !searchText ? [] : [...new Set(expanded)] })
        } else {
            // why because we are using props by context provider
            WorkTreeHTML = workTree;
        }
    }




    onSourceTreeNodeSelect = (selectedKeys, e) => {
        
        if (e.node.props.isVariable)
        {
            if (e.node.props.eventKey === "ALL")
            {
                new Promise((resolve, rej) => {
                    checkinMapping(resolve);
                }).then(() => {
                    let MappinDatas = new MappingData();
                    showProgress();
                    MappinDatas.CallBack = (selectedValue, mappingList) => {
                        hideProgress();
                        this.props.updateState({
                            mappingDataList: mappingList,
                            type: e.node.props.eventKey,
                            sourceObj: {},
                            showMapTab: true
                        });
                    }
                    MappinDatas.RefreshMapping({});

                    this.selectUpdate(e.node.props.eventKey, "source");
                });
            } else {
                showProgress();
        
                new Promise((resolve, rej) => {
                    checkinMapping(resolve);
                }).then(() => {
                    let MappinDatas = new MappingData();
                    const allValues = this.context;

                    let srcObject = allValues.SourceDataset.Variable.filter(
                        variable => variable.TABLE_NAME === e.node.props.dataSet && variable.COLUMN_NAME === e.node.props.name
                    )[0];
                    MappinDatas.CallBack = (selectedValue, mappingList) => {
                        hideProgress();
                        this.props.updateState({
                            mappingDataList: mappingList,
                            sourceObj: srcObject,
                            type: SOURCE.toLowerCase(),
                            showMapTab: true
                        });
                    };
                    MappinDatas.RefreshMapping(srcObject);
                    this.selectUpdate(e.node.props.eventKey, "source");

                });
            }
        }
    };

    onTargetTreeNodeSelect = (selectedKeys, e) =>
    {
        
        let tObj = {};
        if (e.node.props.eventKey === "ALL")
        {
            checkinMapping();

            this.props.updateState({
                mappingDataList: MappingDatas.MappingList,
                type: e.node.props.eventKey,
                showMapTab: true
            });
            this.selectUpdate(e.node.props.eventKey, "target");

            return;
        }
        else if (e.node.props.isDataSet)
        {
            checkinMapping();

            tObj =
            {
                dataset: e.node.props.name,
                variable: null
            }
        }
        else if (e.node.props.isVariable)
        {
            tObj = {
                dataset: e.node.props.dataSet,
                variable: e.node.props.name
            }
        }
        //console.log(MappingDatas)
        let MappinDatas = new MappingData();
        showProgress();

        MappinDatas.CallBack = (selectedValue, mappingList) => {

            hideProgress();
            this.props.updateState({
                mappingDataList: mappingList,
                type: TARGET.toLowerCase(),
                targetObj: tObj,
                showMapTab: !istargetloading
            });
        };
        istargetloading = false;
        MappinDatas.RefreshMapping({});
        this.selectUpdate(e.node.props.eventKey, "target");

    };

    onWorkTreeNodeSelect = (selectedKeys, e) => {
        //showProgress();
        let tObj = {};
        if (e.node.props.isDataSet) {
            tObj = {
                dataset: e.node.props.name,
                variable: null
            }
        } else if (e.node.props.isVariable) {
            tObj = {
                dataset: e.node.props.dataSet,
                variable: e.node.props.name
            }
        }

        let MappinDatas = new MappingData();

        MappinDatas.CallBack = (selectedValue, mappingList) => {

            hideProgress();
            //this.props.updateState({ mappingDataList: mappingList, type: TARGET.toLowerCase(), targetObj: tObj });
        };

        //MappinDatas.RefreshMapping({});
        this.selectUpdate(e.node.props.eventKey, "work");

    };

    onSourceExpand = expandedKeys => {
        let { sourceConfig } = this.state;
        this.setState({
            sourceConfig: {
                ...sourceConfig,
                expandedKeys: expandedKeys,
                autoExpandParent: false
            }
        });
    };
    onTargetExpand = expandedKeys => {
        let { targetConfig } = this.state;

        this.setState({
            targetConfig: {
                ...targetConfig,
                expandedKeys: expandedKeys,
                autoExpandParent: false
            }
        });
    };
    onWorkExpand = expandedKeys => {

        let { workConfig } = this.state;

        this.setState({
            workConfig: {
                ...workConfig,
                expandedKeys: expandedKeys,
                autoExpandParent: false
            }
        });
    };

    selectUpdate = (key, treeName) => {
        let { sourceConfig, targetConfig, workConfig } = this.state;
        this.setState({
            sourceConfig: {
                ...sourceConfig,
                selectedKeys: treeName === "source" ? [key] : ""
            },
            targetConfig: {
                ...targetConfig,
                selectedKeys: treeName === "target" ? [key] : ""
            },
            workConfig: {
                ...workConfig,
                selectedKeys: treeName === "work" ? [key] : ""
            },
        })
    }


    render() {
        const { activeKey,
            sourceTree,
            targetTree,
            workTree,
            sourceConfig, targetConfig, workConfig
        } = this.state;
        const { work_datasets ,from} = this.props;
        const thisob = this;
        const backBtn = (
            <div>
                <Button className="sideToggleBtn"
                    onClick={(e) =>
                    {
                        showProgress();
                        if (from === "Dashboard") {
                            thisob.props.history.push("/trans", { openSelectedStudy: true });
                        } else {
                            thisob.props.history.push("/trans/project", { openSelectedStudy: true });
                        }
                    e.stopPropagation();
                }}>
            <i className="fas fa-arrow-left" />
        </Button>
            <span style={{ marginLeft: 10 }}>{SOURCE}</span>
        </div>);

        //
        return (
            <div>
                <DataContext.Consumer key="mapping_tree_key">
                    {contextValue => (
                        <div key="mapping_tree_key_div" id="mapTree">
                            <Tabs
                                onChange={this.tabChanged}
                                defaultActiveKey={activeKey}
                                size={"small"}
                                key="mapping_tree__tabs_key"
                                id="3"
                            >
                                <TabPane tab={backBtn} key={"1"} >
                                    {
                                        activeKey === "1" &&
                                        <React.Fragment>
                                            {this.TabSearch(SOURCE)}
                                            <div style={{ maxHeight: 'calc(100vh - 186px)', overflow: 'auto' }} key="source_tree_map__src_key">
                                                {this.getSourceTree(contextValue)}
                                                {((sourceConfig.sourceSearch ? sourceTree.some(v => v) : true) && SourceTreeHTML.length > 0) ?
                                                    <Tree
                                                        key="source_tree_map_key"
                                                        onExpand={this.onSourceExpand}
                                                        onSelect={this.onSourceTreeNodeSelect}
                                                        {...sourceConfig}

                                                    >
                                                        <TreeNode
                                                            key={"ALL"}
                                                            title={"Source Dataset"}
                                                            name={"ALL Source Dataset"}
                                                            selectable={true}
                                                            isVariable
                                                        >
                                                            {sourceConfig.sourceSearch ?
                                                                sourceTree :
                                                                SourceTreeHTML}
                                                        </TreeNode>
}
                                                    </Tree> :
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                            </div>
                                        </React.Fragment>
                                    }
                                </TabPane>
                                <TabPane tab={TARGET} key={"2"}>
                                    {
                                        activeKey === "2" &&
                                        <React.Fragment>
                                            {this.TabSearch(TARGET)}
                                            < div style={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }} key="target_tree_map__src_key">
                                                {this.getTargetTree(contextValue)}
                                                {((targetConfig.targetSearch ? targetTree.some(v => v) : true) && TargetTreeHTML.length > 0) ?
                                                    <Tree
                                                        key="target_tree_map_key"
                                                        onExpand={this.onTargetExpand}
                                                        onSelect={this.onTargetTreeNodeSelect}
                                                        {...targetConfig}

                                                    >
                                                        <TreeNode
                                                            key={"ALL"}
                                                            title={"Target Dataset"}
                                                            name={"ALL Target Dataset"}
                                                            selectable={true}
                                                            isVariable
                                                        >
                                                            {targetConfig.targetSearch ?
                                                                targetTree :
                                                                TargetTreeHTML}
                                                        </TreeNode>
                                                       
                                                    </Tree> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                            </div>
                                        </React.Fragment>
                                    }

                                </TabPane>
                                <TabPane tab={WORK} key={"3"}>
                                    {this.TabSearch(WORK)}
                                    <div style={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }} key="target_tree_map__src_key">
                                        {this.getWorkTree(work_datasets)}
                                        {((workConfig.workSearch ? workTree.some(v => v) : true) && WorkTreeHTML.length > 0) ?
                                            <Tree
                                                key="work_tree_map_key"
                                                onExpand={this.onWorkExpand}
                                                onSelect={this.onWorkTreeNodeSelect}
                                                {...workConfig}

                                            >
                                                {workConfig.workSearch ?
                                                    workTree : WorkTreeHTML
                                                }
                                            </Tree>
                                            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </DataContext.Consumer>
            </div>
        );
    }
}