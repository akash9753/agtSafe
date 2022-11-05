import React, { Component } from "react";
import { Input } from "antd";
import {XLSX} from "xlsx";
import { errorModal } from "./sharedUtility";

let fileName = "";
var thisObj = [];
export default class Uploads extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            filename:""
        };
        thisObj = this;
    }

    changeFile = (e, name,column) =>
    {
        let input = e.target;
        if (input.files && input.files[0]) {
            fileName = input.files[0].name;

                var file = e.target.files[0];
                if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    thisObj.setState({ filename: fileName });

                    //Newly added while messagelist updated by client(DVSE054)
                    errorModal("Upload only xlsx file");/*"File Upload issue"*/ 
                } else {
                    var FR = new FileReader();
                    FR.onload = function (e) {
                        var data = new Uint8Array(e.target.result);
                        var workbook = XLSX.read(data, { type: "array" });
                        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        // header: 1 instructs xlsx to create an 'array of arrays'
                        var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                        result = result.filter((x) => x.length);
                        var orgDatas = result[0];
                        var datas = result.splice(1);
                        var datasourceArr = datas.map((userValues,i) => {
                            let col = {};
                            col["key"] = (i + 1);
                            column.map((name, i) => {
                                col[name] = userValues[i];
                            });
                            return col;
                        });
                        thisObj.props.getExcelData(datasourceArr, orgDatas, fileName);
                        thisObj.setState({ filename: fileName });

                    };
                    FR.readAsArrayBuffer(file);
                }
            
        } else {
            errorModal("File Upload issue");/*"File Upload issue"*/ 
                /*"File Upload issue"*/
        }
    };

    click = (e) => {
        const { props } = this;
        const { id } = props;
        const { resetFields } = props.form;
        let reset = {};
        reset[props.id] = "";
        e.target.value = "";
        resetFields(id);
        thisObj.setState({ filename: "" });
        props.Clear();
        
    };

    render() {
        const { props } = this;
        const {  filename } = this.state;
        const { getFieldDecorator, form, id ,column} = props;
        let browsevalue = form.getFieldValue(props.id)

        //console.log(form);
        return (
            <div >
                <div className="input-group">
                    <div
                        className="input-group-prepend"
                        onClick={(e) => document.getElementById(props.id).click()}
                    >
                        <span
                            className="input-group-text custom-inputChooseFile"
                            id="inputGroupFileAddon01"
                        >
                            Choose File
                    </span>
                    </div>
                    <div className="custom-file">
                        {getFieldDecorator(id, {
                            rules: [
                                {
                                    required:true,
                                    message:"CodeList File is Mandatory",
                                },
                            ],
                            initialValue: "",
                        })(
                            <Input
                                type="file"
                                className="CustomFileInput"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                style={{ border: "unset" }}
                                onClick={(e) => this.click(e)}
                                onChange={(e) =>
                                    this.changeFile(e, id, column)
                                }
                            />
                        )}
                        <Input
                            className="CustomFileText"
                            value={browsevalue === "" ? browsevalue :filename}
                            disabled
                            onClick={(e) => document.getElementById(id).click()}
                            type="text"
                            placeholder="No File"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
