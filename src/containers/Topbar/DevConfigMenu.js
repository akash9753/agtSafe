import React, { Component } from 'react';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IntlMessages from '../../components/utility/intlMessages';
import TopbarDropdownWrapper from './topbarDropdown.style';
import Menu from '../../components/uielements/menu';
import { checkPermission } from "../Utility/sharedUtility"

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const iconStyle = {
    marginLeft: 10
};
const stripTrailingSlash = str => {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
};
class DevConfigMenu extends Component {
    constructor(props) {
        super(props);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
            visible: false,
            current: '',
        };
    }
    hide() {
        this.setState({ visible: false, current: '' });
    }
    handleVisibleChange() {
        this.setState({ visible: !this.state.visible });
    }

    render() {
        const { permissions } = this.props;
        const url = stripTrailingSlash(this.props.url);
        const content = (
            <TopbarDropdownWrapper style={{ width: '100%', padding: 0, margin: 0, boxShadow: 'unset' }} className="isoUserDropdown">
                <Menu selectedKeys={[this.state.current]} mode="inline" style={{ borderRight: 'unset' }} onClick={this.hide}>
                    {checkPermission(permissions, ['DatasetValidationRule']) >= 1 ? < Menu.Item >
                        <Link to={`${url}/DataSetValidationRule`}>
                            <span>
                                <i className="fas fa-server" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"DataSet Validation Rule"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['DefineFormConfiguration']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/DefineFormConfiguration`}>
                            <span>
                                <i className="fas fa-code-branch" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Define Form Configuration"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['Form']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/form`}>
                            <span>
                                <i className="fas fa-file-code" style={{ width: 20, fontSize: 14 }} />
                                <span style={iconStyle}>
                                    {"Form"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['MacroTemplate']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/MacroTemplate`}>
                            <span>
                                <i className="fas fa-microchip" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Macro Template"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['MacroTemplate']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/PyTemplate`}>
                            <span>
                                <i className="fas fa-microchip" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Python Template"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {<Menu.Item>
                        <Link to={`${url}/MappingBlock`}>
                            <span>
                                <i className="fas fa-cubes" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Mapping Block"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item>
                    }
                    {checkPermission(permissions, ['ProductControlledTerm']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/ProductControlledTerm`}>
                            <span>
                                <i className="fas fa-wrench" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Product Controlled Term"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['RegularExpression']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/RegularExpression`}>
                            <span>
                                <i className="fas fa-code" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Regular Expression"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['StandardConfiguration']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/StandardConfiguration`}>
                            <span>
                                <i className="fas fa-dice-d20" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Standard Configuration"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['UIElements']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/UIElements`}>
                            <span>
                                <i className="fas fa-cubes" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"UI Element"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission("undefined", ['XsltConfigurationFiles']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/XsltConfigurationFiles`}>
                            <span>
                                <i className="fas fa-file-excel" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Xslt Configuration Files"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                </Menu>
            </TopbarDropdownWrapper>
        );
        return (
            <Popover
                content={content}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                placement="bottomRight"
            >
                <div className="isoIconWrapper">
                    <i className="fas fa-cog" style={{ fontSize: "18px", color: "#ffffff" }}></i>
                </div>
            </Popover>
        );
    }
}

export default connect(state => ({
    ...state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().topbarTheme
}))(DevConfigMenu);
