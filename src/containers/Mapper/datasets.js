import React, { Component } from "react";
import { Tabs,Spin,Icon } from "antd";
import { InputSearch } from "../../components/uielements/input";
import DataContext from "../TreeView/DataContext";
import { NewListWrapper } from "../TreeView/newListComponent.style";
import MappingVariables from "./mappingVariables";
import { findInString, SOURCE, TARGET, MAPPINGOPT } from "../Utility/commonUtils";
import {
    SOURCE_DATASET,
    TARGET_DATASET
} from "../Utility/commonUtils";
import { MappingDatas } from "../TreeView/getMappingDatas";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TabPane } = Tabs;
const listHeight = { height: "calc(100vh - 244px)", marginTop: "5px" };
const SRC_KEY = "srctab";
const TGT_KEY = "tgttab";
var thisObj = {};
class Datasets extends Component {
    static contextType = DataContext;

    constructor(props) {
        super(props);
        this.state = {
            sourceSearch: "",
            targetSearch: "",
            currentSelection: {},
            activeKey: props.for == MAPPINGOPT ? props.tab : SRC_KEY,
            ProgramForm: {},
            loading:false,
        };
        thisObj = this;
    }

  

    onSourceSearchChange = value => {
        this.setState({ sourceSearch: value });
    };

    datasetChanged = (datasetObj, type) =>
    {

            const currSelObj = { type: type, dataset: datasetObj };
            this.setState({ currentSelection: currSelObj.dataset });
            this.context.renderCallback(
                <MappingVariables selectedDS={currSelObj} allValues={this.context} dataSetRefresh={this.DataSetRefresh} />
            );
        

    };

    DataSetRefresh = () => {
        let currentSelection = thisObj.state.currentSelection;
        thisObj.setState({ currentSelection });

    }
    onTargetSearchChange = value => {
        this.setState({ targetSearch: value });
    };

    getSourceValues = allValues => {
        const thisobj = this;
        const { sourceSearch, currentSelection, activeKey } = thisobj.state;
        const props = thisobj.props;
        let sourceSearchstr = sourceSearch;
        let srcDatsets = [];


        let index = 1;
        //console.log(allValues)
        allValues.SourceDataset.Domain.map(function (dataset) {
            let activeClass =
                activeKey === SRC_KEY ? ( dataset.TABLE_NAME === currentSelection.TABLE_NAME
                    ? "isoList active" : "isoList")
                    : "isoList";
            if (
                sourceSearch === "" ||
                findInString(dataset.TABLE_NAME, sourceSearchstr)
            ) {
                const datasetObj = dataset;
                let dragObjValues = {
                    value: dataset,
                    type: SOURCE_DATASET
                };
                srcDatsets.push(
                    <div key={"srcmaindiv" + index} className={activeClass}>
                        <div
                            key={"srcbgdiv" + index}
                            className="isoNoteBGColor"
                            style={{ width: "5px", background: "#7ED321" }}
                        />

                        <div
                            key={"noteTExtdiv" + index}
                            className="isoNoteText"
                            onClick={() => thisobj.datasetChanged(datasetObj, SOURCE)}                           
                        >
                            <h3
                                draggable={props.for === MAPPINGOPT ? true : false}
                                onDragStart={(e) => props.for === MAPPINGOPT ? props.onDrag(e, JSON.stringify(dragObjValues)) : e.preventDefault()}
                            >{dataset.TABLE_NAME}</h3>

                            <span key={"srcspan" + index} className="isoNoteCreatedDate">
                                {dataset.DESCRIPTION}
                            </span>
                        </div>
                    </div>
                );
            }
            index += 1;
        });

        ////console.log(allValues);
        return srcDatsets;
    };

    getTargetValues = allValues => {
        const thisobj = this;
        const { targetSearch, currentSelection, activeKey } = thisobj.state;
        const { Domain } = allValues.Standards;
        const { MappingList } = MappingDatas;
        const props = thisobj.props;

        let srcDatsets = [];
        
        let index = 1;
        MappingList.map((mappingConstruct, index) => {
           
            if (MappingList.findIndex(e => e.cdiscDataStdDomainMetadataID == mappingConstruct.cdiscDataStdDomainMetadataID) === index) {
                let dataset = Domain.find(x => x.cdiscDataStdDomainMetadataID === mappingConstruct.cdiscDataStdDomainMetadataID);

                if (dataset && typeof dataset === "object" && (targetSearch === "" || findInString(dataset.domain, targetSearch))) {
                    let activeClass =
                        activeKey === TGT_KEY ? (dataset.domain === currentSelection.domain
                            ? "isoList active" : "isoList")
                            : "isoList";
                    const datasetObj = dataset;
                    let dragObjValues = {
                        value: dataset,
                        type: TARGET_DATASET
                    };
                    srcDatsets.push(
                        <div key={"tgtmaindiv" + index} className={activeClass}>
                            <div
                                key={"tgtbgdiv" + index}
                                className="isoNoteBGColor"
                                style={{ width: "5px", background: "#7ED321" }}
                            />
                            <div
                                key={"tgtnoteTExtdiv" + index}
                                className="isoNoteText"
                                onClick={() => thisobj.datasetChanged(datasetObj, TARGET)}
                            >
                                <h3
                                    draggable={props.for === MAPPINGOPT ? true : false}
                                    onDragStart={(e) => props.for === MAPPINGOPT ? props.onDrag(e, JSON.stringify(dragObjValues)) : e.preventDefault()}
                                >{dataset.domain}</h3>

                                <span key={"tgtspan" + index} className="isoNoteCreatedDate">
                                    {dataset.domainDescription}
                                </span>
                            </div>
                        </div>
                    );
                }
                index += 1;
            }
        });

        return srcDatsets;
    };

    tabChanged = value => {
        this.setState({ activeKey: value });
    };

    render() {
        const { activeKey ,loading} = this.state;

        return (
            <Spin
                indicator={antIcon}
                tip="Loading ..."
                spinning={loading}
            >
                <DataContext.Consumer>
                    {contextValue => (
                        <div>
                            <Tabs
                                onChange={this.tabChanged}
                                defaultActiveKey={activeKey}
                                size={"small"}
                            >
                                <TabPane tab="Source" key={SRC_KEY}>
                                    <div
                                        className="isoNoteListSidebar"
                                        style={{ width: "100% !important" }}
                                    >
                                        <NewListWrapper className="isoNoteListWrapper" style={{ height:"calc(100vh - 208px)"}} >
                                            <InputSearch
                                                id="srcDsSearch"
                                                key="srcDsSearch"
                                                placeholder="Search Source Datasets"
                                                className="isoSearchNotes"
                                                onChange={event => {
                                                    event.preventDefault();
                                                    this.onSourceSearchChange(event.target.value);
                                                }}
                                                allowClear
                                            />
                                            <div className="isoNoteList" style={listHeight}>
                                                {this.getSourceValues(contextValue)}
                                            </div>
                                        </NewListWrapper>
                                    </div>
                                </TabPane>
                                <TabPane tab="Target" key={TGT_KEY}>
                                    {activeKey === TGT_KEY && (
                                        <div
                                            className="isoNoteListSidebar"
                                            style={{ width: "100% !important" }}
                                        >
                                            <NewListWrapper className="isoNoteListWrapper" style={{ height: "calc(100vh - 208px)" }} >
                                                <InputSearch
                                                    id="targetDsSearch"
                                                    key="targetDsSearch"
                                                    placeholder="Search Target Datasets"
                                                    className="isoSearchNotes"
                                                    onChange={event => {
                                                        event.preventDefault();
                                                        this.onTargetSearchChange(event.target.value);
                                                    }}
                                                    allowClear
                                                />
                                                <div className="isoNoteList" style={listHeight}>
                                                    {this.getTargetValues(contextValue)}
                                                </div>
                                            </NewListWrapper>
                                        </div>
                                    )}
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </DataContext.Consumer>
            </Spin>

        );
    }
}
export default Datasets;