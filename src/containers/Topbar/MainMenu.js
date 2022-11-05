import React, { Component } from 'react';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import TopbarDropdownWrapper from './topbarDropdown.style';
import { Link } from 'react-router-dom';
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
class MainMenu extends Component {
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
        const { customizedTheme, permissions } = this.props;
        const url = stripTrailingSlash(this.props.url);
        const content = (
            <TopbarDropdownWrapper className="isoUserDropdown" style={{ width: '100%', padding: 0, margin: 0, boxShadow: 'unset' }}>
                <Menu selectedKeys={[this.state.current]} mode="inline" style={{ borderRight: 'unset' }} onClick={this.hide}>

                    {checkPermission(permissions, ['Project']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/project`} name="Project">
                            <span>
                                <i className="fas fa-tasks" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    {"Project"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }

                    {checkPermission(permissions, ['Standards']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/standards`} name="Standards">
                            <span>
                                <i className="fas fa-list-ul" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    {"Standards"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }

                    {checkPermission(permissions, ['MappingLibrary']) >= 1 ? <Menu.Item >
                        <Link to={`${url}/mappingLibrary`} name="MappingLibrary">
                            <span>
                                <i className="fas fa-book" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    {"MappingLibrary"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }

                    {checkPermission(permissions, ['BulkMappingConfig']) >= 1 ? <Menu.Item>
                        <Link to={`${url}/BulkMappingConfig`} name="Bulk Mapping Configuration">
                            <span>
                                <i className="fas fa-cubes" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Bulk Mapping Configuration"}
                                </span>
                            </span>
                        </Link>
                    </Menu.Item> : null
                    }


                    {checkPermission(permissions, ['UnitConfiguration']) >= 1 ? < Menu.Item >
                        <Link to={`${url}/UnitConfiguration`} name="Unit Configuration">
                            <span>
                                <i className="fas fa-wrench" style={{ width: 20, fontSize: 12 }} />
                                <span style={iconStyle}>
                                    {"Unit Configuration"}
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
                    <i className="fas fa-th" name="MainMenu" style={{ color: customizedTheme.buttonColor, fontSize: 18 }} ></i>
                </div>
            </Popover>
        );
    }
}

export default connect(state => ({
    ...state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().topbarTheme
}))(MainMenu);
