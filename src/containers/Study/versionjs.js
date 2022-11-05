import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { Icon, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, checkPermission} from '../Utility/sharedUtility';

//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

var thisObj;
class Version extends Component {

    constructor(props) {
        super(props);
        //const { permissions } = this.props;

        this.state = {
            dataSource:[]
        };

        thisObj = this;
        thisObj.getList(this.props);

    }
    getList = (props) => {
        CallServerPost('StudyVersion/GetAllStudyVersion', { ID: props.StudyID })
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const versionList = response.value;
                    //console.log(response);
                    for (var i = 0; i < versionList.length; i++) {
                        const studyVersionID = versionList[i].studyVersionID;
                        const editCell = <div>
                            <ButtonWithToolTip
                                tooltip="Download"
                                classname="fas fa-download"
                                size="small"
                                shape="circle"
                                onClick={() => thisObj.download(studyVersionID)}
                             />
                        </div>;
                        datas.push({
                            key: versionList[i].studyVersionID,
                            version: versionList[i].updatedDateTime,
                            actions: editCell
                        });
                    }
                    thisObj.setState({ dataSource: datas, loading: false });
                }

            })
            .catch(error => error);
    }
    componentWillReceiveProps(nextProps) {
        thisObj.getList(nextProps);

    }
    download = (versionID) => {
        PostCallWithZone('StudyVersion/DownloadStudyVersion', { ID: versionID})
            .then(
            function (response) {
                //console.log(response);

                if (response.messageType == 1) {
                    successModalCallback(response.returnMessage,"");
                } else {
                    errorModal(response.returnMessage);
                }
            }).catch(error => error);
    }
    redirectToStudyList = () => {
        thisObj.props.handleCancel();
    }
    render() {
        const columns = [
            {
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
                width: 200
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 200
            }
        ];

        const { getFieldDecorator } = this.props.form;

        return (

            <LayoutContentWrapper>
         
                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}               
                        scroll={{ y: "calc(100vh - 393px)" }}
                    />
                    <div style={{ paddingTop: "10px" }} >
                        <Button key="submit" style={{ float: 'right' }} name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' onClick={this.redirectToStudyList}>
                        Cancel
                        </Button>
                    </div>
                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(Version);
export default WrappedApp;

