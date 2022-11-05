import React, { useState} from "react";
import { Modal, Button ,Row,Col,Select,Form} from "antd";

export function UpdateImpactModal(props)
{
    let { HideSourceVariableModal, Show, getFieldDecorator, SourceObj, SrcVariable } = props;
    let [ variableBySelDomain, setFilterVariable ] = useState([]);

    if (!Show)
    {
        props.form.resetFields("SourceDomain");
        props.form.resetFields("SourceVariable");
    }

    //
    let FilterVariable = (sel_src) =>
    {
        let { Variable } = SourceObj;
        props.form.resetFields("SourceVariable");

        //filterVarBasedOnSelSrcDomain
        setFilterVariable(Variable.filter(v => v.TABLE_NAME === sel_src));
    }
   return <Modal
       title="Select source variable"
        centered
        maskClosable={false}
        cancelType='danger'
        visible={Show}
        onCancel={() => props.HideSourceVariableModal()}
        footer={[
            <Button key="Cancel"
                name="Cancel"
                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                style={{ float: 'left' }}
                onClick={() => HideSourceVariableModal()}
            >
                Cancel
          </Button>,
            <Button
                name="Save"
                key="ComplexSave"
                className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }}
                onClick={() =>
                {
                    props.form.validateFields(["SourceDomain", "SourceVariable"], (err, values) => {
                        if (!err) {
                            props.UpdateImpact(values.SourceDomain, values.SourceVariable);
                        }
                    });
                }}>
                Confirm
                    </Button>

        ]}
    >
        <Row gutter={2}>
            <Col span={12}>
                <Form.Item label={"Source Domain"} >
                    {getFieldDecorator("SourceDomain", {
                        rules: [
                            {
                                required: true,
                                message: "Source Domain should be selected"
                            }
                        ],
                    })(
                        <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select Domain"
                            key={"SourceDomain"}
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={FilterVariable}
                        >
                            {SourceObj.Domain.map(dmn => {
                                return <Select.Option value={dmn.TABLE_NAME}>
                                            {dmn.TABLE_NAME}
                                        </Select.Option>
                            })}
                        </Select>
                    )}
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    key={"variableSelect"}
                    label={"Source Variable"}
                    style={{ marginLeft: 10 }}
                >
                   {getFieldDecorator("SourceVariable", {
                       rules: [
                           {
                               required: true,
                               message: "Source Variable should be selected"
                           }
                       ],
                   })(
                       <Select
                           style={{ width: "100%" }}
                           showSearch
                           placeholder="Select Target Variable"
                           key={"SourceVariable"}
                           filterOption={(input, option) =>
                               option.props.children
                                   .toLowerCase()
                                   .indexOf(input.toLowerCase()) >= 0
                           }
                       >
                           {(variableBySelDomain || []).map(va => {
                               return <Select.Option value={va.COLUMN_NAME}>
                                   {va.COLUMN_NAME}
                               </Select.Option>
                           })}
                       </Select>)}
                </Form.Item>
            </Col>
        </Row>

    </Modal>
}