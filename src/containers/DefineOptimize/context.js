import React, { createContext ,Component} from 'react';

export const DefineContext = createContext();

export default class DefineContextProvider extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            node:'',
            expandNode: ["Study"],
            highLightNode: "",

        }
    }

    //
    storeTreeData = (data) =>
    {
        this.setState({
            treeJSON: data
        })
    }

    //Below fn used by List page edit buttons
    //When you click the edit button on the list page, highlight the corresponding node in the tree
    setNodeWhenEditBtnClick = (selNode) =>
    {
        //The node variable represents the selected parent node
        let { node, expandNode } = this.state;
        let parent = JSON.stringify(node);

        let child_node = this.FnToFindChild(node, selNode);

        let { Title, Source, Children, Key, prev, next, immediatParent,siblings} = child_node;

        this.setState({
            node:
            {  
                type: Source,
                nodeKey: Key,
                title: Title,
                prev: prev,
                next:next,
                parents: [...node.parents, node.nodeKey],
                siblings: siblings,
                //json Obj
                children: Children,
                parentKey: node.nodeKey,
                parentType:node.type,
            },
            back: true,
            parent: parent,
            highLightNode: selNode,
            expandNode: [...new Set([...expandNode, ...node.parents, node.nodeKey, immediatParent])]
         });

        this.setState({
            parent: parent,
            highLightNode: Key,
        });
    }

     //find selected child in parent object to get the node information 
    FnToFindChild = (obj,sel_Node) =>
    {
        let child_node = {};

          function findChild(data)
          {
            let child = data.children || data.Children;
              return child.some((ch, index) =>
              {
                if (ch.Key === sel_Node)
                {
                    let chil = JSON.stringify(ch);
                    child_node = JSON.parse(chil);
                    child_node.siblings = child;
                    child_node.prev = index != 0;
                    child_node.next = index < (child.length - 1);
                    child_node.immediatParent = data.Key || data.nodeKey;

                    return true;
                }

                var chi = ch.children || ch.Children;

                  if (chi && chi.length > 0)
                  {
                    if (findChild(ch))
                    {
                        return true;
                    };
                }
            });
        }

        findChild(obj);
        return child_node;
    }



    //set parent node
    setNode = (selNode) =>
    {
        //The node variable represents the selected parent node
        let { node, expandNode } = this.state;

        this.setState({
            highLightNode: selNode,
            parentID: node.nodeKey,
            expandNode: [...new Set([...expandNode, ...node.parents, node.nodeKey])]
        });
    }

    //Set Node HighLight and Expand the corresponding nodes
    setExpandNode = (nodes) =>
    {
       this.setState({  expandNode:nodes });
    }

    reset = () => {
        this.setState({ expandNode: ["Study"], highLightNode: -1, node: {} });
    }

    //Store node 
    storeNode = (node) =>
    {
        this.setState({
            node: node,
            highLightNode: node.nodeKey,
            byNavigation: false,
            parent: {},
            back:false
        });
    }

    //when click prev next button
    navigateByPrevNext = (navigation, ID) =>
    {
        let { node, expandNode,back } = this.state;
        let { siblings } = node;
        let indexOfSibling = (siblings || []).findIndex(obj => obj.Key === ID);
        let findIndex = navigation === "prev" ? (indexOfSibling - 1) : (indexOfSibling + 1);
        let navi_node = siblings[findIndex] || {};

        this.setState({
            node: {
                type: navi_node.Source,
                nodeKey: navi_node.Key,
                title: navi_node.title,
                siblings: siblings,
                prev: findIndex != 0 ? siblings[findIndex - 1] : false,
                next: findIndex < (siblings.length - 1) ? siblings[findIndex + 1] : false,
                parents: [...node.parents, node.nodeKey],
                parentKey: node.nodeKey
            },
            back:back,
            byNavigation: true,
            highLightNode: navi_node.Key,
            parentID: node.nodeKey,
            expandNode: [...new Set([...expandNode, ...node.parents, node.nodeKey])]
        });
    }

    //If you are in the edit page, go back to the parent
    backToParent = (ID, data) =>
    {
        let { node, expandNode } = this.state;

        let findParent = this.FnToFindChild(data[0], ID);

        let { Title, Source, Children, Key, prev, next, immediatParent } = findParent;

        this.setState({
            node:
            {
                type: Source ? Source : Key,
                nodeKey: Key,
                title: Title,
                prev: prev,
                next: next,
                parents: [...node.parents, node.nodeKey],
                siblings: node.children,
                //json Obj
                children: Children,
                parentKey: node.nodeKey,
                parentType: node.type,
            },
            back: true,
            highLightNode: ID,
            expandNode: [...new Set([...expandNode, ...node.parents, node.nodeKey, immediatParent])]
        });

      
    }

    render()
    {
        let { node,highLightNode, expandNode ,back,parent} = this.state;
        let { setHighLightAndExpandNode,reset, backToParent,setNode, storeNode, setExpandNode, navigateByPrevNext, setNodeWhenEditBtnClick} = this;
        
        return <DefineContext.Provider
                 value={{
                        node,   
                        back,
                        reset,
                        parent,
                        storeNode,
                        setNode,
                        expandNode,
                        highLightNode,
                        backToParent,
                        setExpandNode,
                        navigateByPrevNext,
                        setNodeWhenEditBtnClick,
                        setHighLightAndExpandNode,
                        ...this.props
                    }}
                >
                  {this.props.children}
                </DefineContext.Provider>
    }

}