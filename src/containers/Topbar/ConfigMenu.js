import React, { Component } from 'react';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IntlMessages from '../../components/utility/intlMessages';
import TopbarDropdownWrapper from './topbarDropdown.style';
import Menu from '../../components/uielements/menu';
import { checkPermission } from "../Utility/sharedUtility";

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
class ConfigMenu extends Component {
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
        this.setState({ visible: false, current:'' });
    }
    handleVisibleChange() {
        this.setState({ visible: !this.state.visible });
    }

    render() {
        const { customizedTheme, permissions } = this.props;
        const url = stripTrailingSlash(this.props.url);
        const content = (
            <TopbarDropdownWrapper style={{ width: '100%', padding: 0, margin: 0, boxShadow: 'unset' }} className="isoUserDropdown">
                <Menu selectedKeys={[this.state.current]} mode="inline" style={{ borderRight: 'unset' }} onClick={this.hide}>
                    {checkPermission(permissions, ['AppConfiguration']) >= 1 ? < Menu.Item >
                        <Link to={`${url}/AppConfiguration`} name="App Configuration">
                            <span>
                                <i className="fas fa-sliders-h" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"App Configuration"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                     {checkPermission(permissions, ['AppConfiguration']) >= 1 ? < Menu.Item >
                        <Link to={`${url}/EmailTemplate`} name="Email Template">
                            <span>
                                <i className="fas fa-envelope" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Email Template"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['PasswordSecurityQuestion']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/PasswordSecurityQuestion`} name="Password Security Question">
                            <span>
                                <i className="fas fa-question-circle" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Password Security Question"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['RolesAndPermissions']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/roles`} name="Roles">
                            <span>
                                <i className="fas fa-user-friends" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    <IntlMessages id="sidebar.roles" />
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['StandardValueLevelConfiguration']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/StandardValueLevelConfiguration`} name="Std Value Level Configuration">
                            <span>
                                <i className="fas fa-cogs" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Standard Value Level Configuration"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }
                    {checkPermission(permissions, ['Users']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/users`} name="Users">
                            <span>
                                <i className="fas fa-user" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    <IntlMessages id="sidebar.users" />
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
                placement="bottomLeft"
            >
                <div className="isoIconWrapper">
                    <i className="fas fa-user-cog" name="ConfigMenu" style={{ fontSize: "18px",color: "#ffffff" }}></i>
                </div>
            </Popover>
        );
    }
}

export default connect(state => ({
    ...state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().topbarTheme
}))(ConfigMenu);
