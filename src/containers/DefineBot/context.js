import React, { createContext ,Component} from 'react';

export const DefineContext = createContext();

export default class DefineContextProvider extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            sel_node: {}
        }
    }

    updateNode = (node) =>
    {
        this.setState({ sel_node: node })
    }

    render() {
        return <DefineContext.Provider value={{ ...this.state, upd_SelNode : this.updateNode }} >
                     {this.props.children}
               </DefineContext.Provider>
    }

}