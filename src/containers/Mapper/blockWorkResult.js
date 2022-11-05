import React from "react";
import { Tabs, Row, Button } from 'antd';
import MonacoEditor from '@uiw/react-monacoeditor';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './logStyle.css'

const { TabPane } = Tabs;
const fullSize = { height: "100%", width: "100%" };
let change = false;

export default function BlockWorkResult(props) {
    const operations = <Button type="primary" disabled={sasmacro === ""} onClick={props.executeMacro}>Run</Button>;
    const [activeKey, setActiveKey] = React.useState("work_result_macro");
    const [sasmacro, setSasmacroValue] = React.useState(props.sasmacro);
    React.useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [activeKey]);

    React.useEffect(() => {
        if (!change) {
            setSasmacroValue(props.sasmacro)
        } else {
            change = false;
        }
    });


    const onSasmacroChange = (va, e) => {
        change = true;
        setSasmacroValue(va);
    }


    return (
        
        <Tabs
            tabBarExtraContent={
                props.actions ? null :
                    activeKey == "work_result_macro" && props.sasmacro != "" ? operations : null}
            onChange={(key) =>
            {
                if (props.actions)
                {
                    props.showFooter(key);
                } 
                setActiveKey(key);
            }}
            type="card"
            defaultActiveKey="work_result_macro"
            key="work_result_key"
            style={{ ...fullSize }}
            className="op_tabs"

        >
            <TabPane className="op_tabpane"
                tab="Program"
                key="work_result_macro" >
              
               
                <CodeMirror
                    value={sasmacro}
                    editable={false}
                    readOnly={true}
                    options={{
                        lineNumbers: true,
                        mode: "sas",
                        theme: "rubyblue"
                    }}
                    
                    className="parentFulHeight"
                />
            </TabPane>
            <TabPane className="op_tabpane"
                tab="Log" key="work_result_log" >
                <MonacoEditor
                    height="100%"
                    width="100%"
                    language="sas"
                    className="monaco-editot-custom"
                    value={props.log}
                    options={{
                        theme: 'vs-dark',
                        readonly: true,
                        automaticLayout: true
                    }}
                />
                
            </TabPane>
            {
                props.programType == 2 &&
                <TabPane className="op_tabpane"
                    tab="Output" key="work_result_lst">
                    <div style={{ height: "100%", overflow: "auto" }} >
                        <div dangerouslySetInnerHTML={{ __html: props.lstHTML }} />
                    </div>
                </TabPane>
            }
        </Tabs>

    )
}