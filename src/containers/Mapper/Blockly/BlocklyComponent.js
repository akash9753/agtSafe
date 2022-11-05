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

Blockly.setLocale(locale);
var thisObj = "";

class BlocklyComponent extends React.Component {

    componentDidMount() {

        const { initialXml, children, SourceFieldClick, TargetFieldClick, ...rest } = this.props;
        thisObj = this;

        Blockly.mainWorkspace && Blockly.mainWorkspace.clear();

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

        //override warning icon
        Blockly.Warning.prototype.drawIcon_ = function (a) {
            //Override 
            Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.CIRCLE, {
                "class": "blocklyIconShape",
                r: "8",
                cx: "8",
                cy: "8"
            }, a);
            Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.PATH, {
                "class": "blocklyIconSymbol",
                d: "m6.8,10h2c0.003,-0.617 0.271,-0.962 0.633,-1.266 2.875,-2.4050.607,-5.534 -3.765,-3.874v1.7c3.12,-1.657 3.698,0.118 2.336,1.25-1.201,0.998 -1.201,1.528 -1.204,2.19z"
                //  d: "m4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41,0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3,-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9,-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11,-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 -0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187,0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z"
                //  d: "m4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41,0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3,-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9,-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11,-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 -0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187,0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z"

            }, a);
            Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.RECT, {
                "class": "blocklyIconSymbol",
                x: "6.8",
                y: "10.78",
                height: "2",
                width: "2"
            }, a)

            //Actual Library code

            //Blockly.Warning.prototype.drawIcon_ = function (a) {
            //    Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.PATH, {
            //        "class": "blocklyIconShape",
            //        d: "M2,15Q-1,15 0.5,12L6.5,1.7Q8,-1 9.5,1.7L15.5,12Q17,15 14,15z"
            //    }, a);
            //    Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.PATH, {
            //        "class": "blocklyIconSymbol",
            //        d: "m7,4.8v3.16l0.27,2.27h1.46l0.27,-2.27v-3.16z"
            //    }, a);
            //    Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.RECT, {
            //        "class": "blocklyIconSymbol",
            //        x: "7",
            //        y: "11",
            //        height: "2",
            //        width: "2"
            //    }, a)
            //};
        };
        //End
        if (initialXml) {
            try
            {
                let TextToDom = Blockly.Xml.textToDom(initialXml);
                Blockly.Xml.domToWorkspace(TextToDom, this.primaryWorkspace);
                // Custom Code 
                this.primaryWorkspace.addChangeListener(this.onEvent);
            } catch (e)
            {
                Blockly.getMainWorkspace().clear();
                let xml = `<xml xmlns="https://developers.google.com/blockly/xml">
                        <block deletable="false" type="final_step_type" startScrollX="30" startScrollY="30" x="30" y="30" /></xml>
                    `
                let TextToDom = Blockly.Xml.textToDom(xml);
                Blockly.Xml.domToWorkspace(TextToDom, this.primaryWorkspace);
                // Custom Code 
                this.primaryWorkspace.addChangeListener(this.onEvent);
                return true;
             }
            return true;
         }
           
         
        

    }

    componentDidUpdate() {
        window.dispatchEvent(new Event('resize'));
        this.workspace.resize();
        let tools = this.toolbox;
        this.workspace.updateToolbox(this.toolbox);

    }

    //When Click we remove the default action and do custom work
    FlyoutBlockClick = (block) => {
        if (typeof block.data === "string" && block.data) {
            let obj = JSON.parse(block.data);
            if (obj.blockType === "Source") {
                thisObj.props.sourceVariableBlocks(obj, block);
            } else if (obj.blockType === "Target") {
                thisObj.props.targetVariableBlocks(obj, block);
            } else if (obj.blockType === "Work") {
                thisObj.props.workVariableBlocks(obj, block);

            }
        }
    }
    //End

    onEvent = (event) => {


        if (event.group && event.type === Blockly.Events.MOVE) {
            Blockly.getMainWorkspace().getAllBlocks().map(Obj => {

                if (Obj) {
                    let data = JSON.parse(Obj.data);
                   
                    Obj.setEnabled(Obj.highPriority || Obj.getRootBlock().highPriority);
                }
            });
        }
        if (event.group && event.type == Blockly.Events.CREATE)
        {
            //enable && disable validation
            var block = this.workspace.getBlockById(event.blockId)

             if (event.xml.getElementsByTagName('data').length > 0)
             {
                 if (event.xml.lastElementChild.localName == "data")
                 {
                    let obj = JSON.parse(event.xml.lastElementChild.textContent);
                     if (obj.blockType === "Source")
                     {
                         thisObj.props.sourceVariableBlocks(obj, block);
                     } else if (obj.blockType === "Target")
                     {
                         thisObj.props.targetVariableBlocks(obj, block);

                     } else if (obj.blockType === "Work")
                     {
                         thisObj.props.workVariableBlocks(obj, block);

                    }
                }
            }
        }
        if (event.type == Blockly.Events.DELETE)
        {
            var Obj = this.workspace.getBlockById(event.blockId)
            if (event.oldXml.getAttribute("type") === "final_step_type") {
                const { initialXml } = this.props;

                Blockly.Xml.domToWorkspace(
                    Blockly.Xml.textToDom(initialXml),
                    this.primaryWorkspace
                );

                //Empty the trashcan
                Blockly.getMainWorkspace().trashcan.contents_ = [];
            }

            if (event.oldXml.getElementsByTagName('data').length > 0) {
                if (event.oldXml.lastElementChild.localName == "data") {
                    let obj = JSON.parse(event.oldXml.lastElementChild.textContent);
                    thisObj.props.RemoveVariables(obj);
                }
            }
            else if (Obj && 'type' in Obj && Obj.type === "merge_type") {
                    thisObj.props.clearMergeVar();
            }
        }
        if (event.type === Blockly.Events.UI) {
            if (event.element && event.element === "click") { 
            //console.log(Blockly)
            //let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());

            let Obj = this.workspace.getBlockById(event.blockId)
            //var list = xml.querySelector('[blockId="' + event.blockId+'"]')
            if (Obj) {
                if ('type' in Obj && Obj.type === "step_type") {
                    //thisObj.props.setCurrentStep(Obj);
                } else if ('type' in Obj && Obj.type === "merge_type") {
                    let StatementFirstBlocks = Obj.getInputTargetBlock("datasets_to_merge");

                    if (StatementFirstBlocks) {
                        thisObj.props.mergeVariables(Obj);
                    }
                }
                else if ('data' in Obj && Obj.data !== null) {
                    let data = JSON.parse(Obj.data);
                    if (data.blockType === "Source") {
                        thisObj.props.sourceVariableBlocks(data, Obj);
                    } else if (data.blockType === "Target") {
                        thisObj.props.targetVariableBlocks(data, Obj);

                    } else if (data.blockType === "Work") {
                        thisObj.props.workVariableBlocks(data, Obj);

                    }
                }
            }
        }
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
