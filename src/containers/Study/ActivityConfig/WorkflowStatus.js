import React from 'react';
import { Form, Menu, Row, Divider, Dropdown, Icon, Col, Select } from 'antd';
import '../../Utility/browse.css';
import LayoutContent from '../../../components/utility/layoutContent';
import { ANNOTATION, METADATA_ANNOT } from '../../Utility/appConstants';
import "./WorkflowStatus.css";
import { checkPermission } from '../../Utility/sharedUtility';

const FormItem = Form.Item;
const splitClass = 24;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    },
};

export default function WorkflowStatus(props)
{
    let { study } = props;

    let {
        annotationRequired,
        mappingRequried,
        defineRequired,
        workflowActivityStatusID
    } = study;
    const { getFieldDecorator } = props.form;

    const {
        status,
        updateData,
        annotationWorkFlows,
        defineWorkFlows,
        transFormationWorkFlows,
    } = props;

    let activity =
    [
        {
            name: "Annotation Status",
            required: annotationRequired
        },
        {
            name: "Transformation Status",
            required: mappingRequried
        },
        {
            name: "Define Status",
            required: defineRequired
        }
     ];

    //Check Is Workflow Field should be disable ?
    let checkIsDisable = (activityname) =>
    {
        let activityObj = getActivityObjByName(activityname);
        let { study, isProjectInActive} = props;
        let { Define, Trans } = status;
        //console.log(checkPermission(props.permissions, ["StudyWorkSpace","Annotation"]))

        return !activityObj ||
            study.locked ||
            workflowActivityStatusID === 15 ||
            isProjectInActive ||
            activityObj.length === 0 ||
            (activityname === "Define Status" && ((Define.id === 10 || Define.id === 20) &&           //Not allow define until mapping get completed
             (study.mappingRequried && Trans.id !== 9)));

    }

    //get Activity Obj By Activity Name
    let getActivityObjByName = (activityname) => {
        switch (activityname.toLowerCase().replaceAll(/ /g, "")) {
            case "annotationstatus":
                return annotationWorkFlows;
            case "transformationstatus":
               return transFormationWorkFlows;
            case "definestatus":
                return  defineWorkFlows;
        }
    }

    let getSubmitForReview = (wStatus) =>  "Submit " + wStatus.replace("UnderReview", "") + " for Review";

    let getStatusListByActivityName = (activityname) => {
        let data = getActivityObjByName(activityname);

        return <Menu onClick={(e) => { props.beforeUpdateTheWorkFlow(parseInt(e.key), data) }}>
            {(data || []).map(wfstatus => {
                return <Menu.Item key={wfstatus.targetStatusID}>
                    {wfstatus.targetStatusText.indexOf("UnderReview") >= 0 ? getSubmitForReview(wfstatus.targetStatusText) : wfstatus.targetStatusText}
                </Menu.Item>
            })
            }
        </Menu>
    }

    let getCurrentStatus = (activityname) => {
        switch (activityname.toLowerCase().replaceAll(/ /g, "")) {
            case "annotationstatus":
                return status.Annot.text;
            case "transformationstatus":
                return status.Trans.text;
            case "definestatus":
                return status.Define.text;
                
        }
    }
    return <LayoutContent style={{ wordBreak: 'break-all' }}>
        <Form {...formItemLayout} layout="vertical">
            <Row style={{ width: "100%" }}>
                {
                activity.map((activi) =>
                {
                    return activi.required && <>
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingBottom: "10px" }}>
                            <FormItem label={activi.name}>
                                    {
                                        <Dropdown
                                            overlay={getStatusListByActivityName(activi.name)}
                                            disabled={checkIsDisable(activi.name)}
                                        >
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            {getCurrentStatus(activi.name)} <Icon type="down" />
                                            </a>
                                        </Dropdown>
                                    }
                                </FormItem>
                            </Col>
                            <Divider />
                        </>
                    
                })}
            </Row>
        </Form>

    </LayoutContent>
}