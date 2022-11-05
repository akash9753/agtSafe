/**
 * @license
 * 
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from 'react';
import './BlocklyComponent.css';

import Blockly from 'blockly/core';
import locale from 'blockly/msg/en';
import 'blockly/blocks';
import { element } from 'prop-types';

Blockly.setLocale(locale);
var thisObj = "";

class BlocklyComponent extends React.Component {

    componentDidMount() {

        const { initialXml, fnTargetVariable, children, SourceFieldClick, TargetFieldClick, ...rest } = this.props;
        thisObj = this;

        this.primaryWorkspace = Blockly.inject(
            this.blocklyDiv,
            {
                toolbox: this.toolbox,
                ...rest,
                zoom:
                {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                },
                trashcan: true,
            });
      
        //Blockly.ContextMenu.populate_ = function (a, b) {
        //    var c = new Blockly.Menu;
        //    c.setRightToLeft(b);
        //    for (var d = 0, e; e = a[d]; d++) {
        //        var f = new Blockly.MenuItem(e.text);
        //        f.setRightToLeft(b);
        //        c.addChild(f, !0);
        //        f.setEnabled(e.enabled);
        //        if (e.enabled)
        //            f.onAction(function () {
        //                this.callback(Blockly.ContextMenu.currentBlock)
        //                Blockly.ContextMenu.hide();
        //            }, e)
        //    }
        //    return c
        //}

        //When Click we remove the default action and do custom work
        Blockly.Gesture.prototype.doBlockClick_ = function () {
            if (this.flyout_ && this.flyout_.autoClose) {
                return this.targetBlock_.isEnabled() && (Blockly.Events.getGroup() || Blockly.Events.setGroup(!0), thisObj.FlyoutBlockClick(this.targetBlock_))
            } else {
                Blockly.Events.fire(new Blockly.Events.Ui(this.startBlock_, "click", void 0, void 0));
            }
            this.bringBlockToFront_();
            Blockly.Events.setGroup(!1)
        };

        //Custom change is adding extra parameter @opt
        Blockly.Flyout.prototype.createBlock = function (a) {
            var b = null;
            Blockly.Events.disable();
            var c = this.targetWorkspace.getAllVariables();
            this.targetWorkspace.setResizesEnabled(!1);

            try {
                //Custom change is adding extra parameter @opt
                b = this.placeNewBlock_(a);
            } finally {
                Blockly.Events.enable();
            }

            a = Blockly.Variables.getAddedVariables(this.targetWorkspace, c);
            if (Blockly.Events.isEnabled()) for (Blockly.Events.setGroup(!0), Blockly.Events.fire(new Blockly.Events.Create(b)), c = 0; c < a.length; c++) {
                Blockly.Events.fire(new Blockly.Events.VarCreate(a[c]));
            }
            return b;
        };
        
        //End
        //Override comment icon
        Blockly.Comment.prototype.drawIcon_ = function (a) {
            //Override
            Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.CIRCLE, {
                "class": "blocklyIconShape",
                r: "8",
                cx: "8",
                cy: "8"
            }, a);
            Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.PATH, {
                "class": "blocklyIconSymbol",
                d: "M4 5 L12 5 L12 10 L9 10 L7 12 L7 10 L4 10 Z"
            }, a);

            //Actual Library code
            //Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.CIRCLE, {
            //    "class": "blocklyIconShape",
            //    r: "8",
            //    cx: "8",
            //    cy: "8"
            //}, a);
            //Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.PATH, {
            //    "class": "blocklyIconSymbol",
            //    d: "m6.8,10h2c0.003,-0.617 0.271,-0.962 0.633,-1.266 2.875,-2.4050.607,-5.534 -3.765,-3.874v1.7c3.12,-1.657 3.698,0.118 2.336,1.25-1.201,0.998 -1.201,1.528 -1.204,2.19z"
            //}, a);
            //Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.RECT, {
            //    "class": "blocklyIconSymbol",
            //    x: "6.8",
            //    y: "10.78",
            //    height: "2",
            //    width: "2"
            //}, a)

        };
        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }


        // Custom Code 
        this.primaryWorkspace.addChangeListener(this.onEvent);
        //console.log(this.primaryWorkspace)
        this.primaryWorkspace.registerToolboxCategoryCallback(
            "fnTargetVariable",
            fnTargetVariable
        );
    }

    componentDidUpdate() {
        window.dispatchEvent(new Event('resize'));
        this.workspace.resize();
        let tools = this.toolbox;
        //console.log(this)
        this.workspace.updateToolbox(this.toolbox);

    }

    //When Click we remove the default action and do custom work
    FlyoutBlockClick = (block) => {
        if (typeof block.data === "string" && block.data) {
            let obj = JSON.parse(block.data);
            if (obj.blockType === "Target") {
                thisObj.props.targetVariableBlocks(obj);
            }
        }
    }
    //End

    onEvent = (event) => {
        try {

            //if (event.group && event.type === Blockly.Events.MOVE) {
            //    Blockly.getMainWorkspace().getAllBlocks().map(Obj => {

            //        if (Obj) {
            //            let data = JSON.parse(Obj.data);

            //            Obj.setEnabled(Obj.highPriority || Obj.getRootBlock().highPriority);
            //        }
            //    });
            //}
            if (event.group && event.type == Blockly.Events.CREATE) {
                //enable && disable validation
                if (event.xml.getElementsByTagName('data').length > 0)
                {
                    if (event.xml.lastElementChild.localName == "data") {
                        let obj = JSON.parse(event.xml.lastElementChild.textContent);
                        if (obj.blockType === "Target")
                        {
                            thisObj.props.targetVariableBlocks(obj);
                            
                        }
                    }
                }

                let ids = event.ids || [];
                ids.map((bid) =>
                {
                    var Obj = this.workspace.getBlockById(bid);
                    if (Obj.type === "exec_by_variables") {
                        let statement = Obj.getInput("by_var_statement")
                        if (statement)
                        {
                            //get parent 
                            let parent = Obj.getParent();
                            if (parent && typeof parent === "object" && parent.type === "variable_type_target_multi")
                            {
                                let parentBlockName = parent.getFieldValue("var_name");
                                statement.connection.setCheck([parentBlockName]);
                            }
                            else
                            {
                                statement.connection.setCheck(["NONE"]);

                            }
                        }
                    }
                });

            }
            if (event.type == Blockly.Events.DELETE)
            {
                if (event.blockId === "order_of_execution")
                {
                    Blockly.getMainWorkspace().trashcan.contents_ = [];
                }
                if (event.oldXml.getElementsByTagName('data').length > 0)
                {
                    if (event.oldXml.lastElementChild.localName == "data")
                    {
                        let obj = JSON.parse(event.oldXml.lastElementChild.textContent);
                        thisObj.props.RemoveVariables(obj);
                    }
                }
            }
           
            if (event.type == "drag")
            {

                //let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
                var Obj = this.workspace.getBlockById(event.blockId);
                //var list = xml.querySelector('[blockId="' + event.blockId+'"]')
                if (Obj) {
                    if (event.isStart === false) {
                        //Demo_update
                        //TransBot1.0.1
                        //Allow BY_Var for First variable
                        //First variable should not have byvariable
                        //scenario 1
                        //let op_connection = Obj.outputConnection;
                        //let op_connection_blk = op_connection ? op_connection.targetBlock() : false;

                        //if (op_connection_blk &&
                        //    op_connection_blk.getPreviousBlock() &&
                        //    op_connection_blk.getPreviousBlock().type === "exec_order_of_execution") {
                        //    Obj.outputConnection.disconnect();
                        //    return;
                        //}

                        //scenario 2
                        // when we drag block with Byvar block,disconnect Byvar block
                        let prev_connection = Obj.getPreviousBlock();
                        let value_connection = Obj.getInput("value_input") ? Obj.getInput("value_input").connection : false;
                        if (value_connection && value_connection.targetBlock()) {
                            //Obj.getInput("value_input").connection.targetConnection.disconnect();
                            return;
                        }
                        else if (Obj.type === "exec_by_variables")
                        {
                            let statement = Obj.getInput("by_var_statement")
                            if (statement) {
                                //get parent 
                                let parent = Obj.getParent();
                                if (parent && typeof parent === "object" && parent.type === "variable_type_target_multi") {
                                    let parentBlockName = parent.getFieldValue("var_name");
                                    statement.connection.setCheck([parentBlockName]);
                                } else {
                                    statement.connection.setCheck(["NONE"]);

                                }
                            }
                        }
                    }
                }
            }

            if (event.type == Blockly.Events.UI) {

                //let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
                var Obj = this.workspace.getBlockById(event.blockId)
                //var list = xml.querySelector('[blockId="' + event.blockId+'"]')
                if (Obj) {
                    if (event.element === "dragStop") {

                        //First variable should not have byvariable
                        //scenario 1
                        let op_connection = Obj.outputConnection;
                        let op_connection_blk = op_connection ? op_connection.targetBlock() : false;

                        if (op_connection_blk &&
                            op_connection_blk.getPreviousBlock() &&
                            op_connection_blk.getPreviousBlock().type === "exec_order_of_execution") {
                            Obj.outputConnection.disconnect();
                            return;
                        }
                        //scenario 2

                        let prev_connection = Obj.getPreviousBlock();
                        let value_connection = Obj.getInput("value_input") ? Obj.getInput("value_input").connection : false;
                        if (value_connection && value_connection.targetBlock()) {
                            Obj.getInput("value_input").connection.targetConnection.disconnect();
                            return;
                        }
                        //End also first variable should not have byvariable
                        else if (Obj.type === "exec_by_variables") {
                            let statement = Obj.getInput("by_var_statement")
                            if (statement) {
                                //get parent 
                                let parent = Obj.getParent();
                                if (parent && typeof parent === "object" && parent.type === "variable_type_target_multi") {
                                    let parentBlockName = parent.getFieldValue("var_name");
                                    statement.connection.setCheck([parentBlockName]);
                                } else {
                                    statement.connection.setCheck(["NONE"]);

                                }
                            }
                        }
                    }
                    else if (event.element === "click") {
                        if ('data' in Obj && Obj.data !== null) {
                            let data = JSON.parse(Obj.data);
                            if (data.blockType === "TargetVar") {
                                thisObj.props.getAllTheUsedBlockFromMappingXML(Obj, data);

                            }
                        }
                    }

                }
            }
        }
        catch (e) {
            console.log(e);
        }
     }

    get workspace() {
        return this.primaryWorkspace;
    }

    get tools() {
        return this.toolbox;
    }

    setXml(xml) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.primaryWorkspace);
    }

    render() {
        const { children } = this.props;

        return <React.Fragment>
            <div ref={e => this.blocklyDiv = e} id="blocklyDiv" />
            <xml xmlns="https://developers.google.com/blockly/xml" is="blockly" style={{ display: 'none' }} ref={(toolbox) => { this.toolbox = toolbox; }}>
                {children}
            </xml>
        </React.Fragment>;
    }
}

export default BlocklyComponent;
