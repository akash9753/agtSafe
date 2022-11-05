import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import Logo from '../../components/utility/logo';
import TopbarNotification from './topbarNotification';
import UserMenu from './UserMenu';
import MainMenu from './MainMenu';
import DevConfigMenu from './DevConfigMenu';
import ConfigMenu from "./ConfigMenu";
import { getPermissions, checkPermission, validJSON } from '../Utility/sharedUtility';
const { Header } = Layout;
const { toggleCollapsed } = appActions;

let thisObj = {};
let header = "";
class Topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerName: "",
            selectedItem: "",
            showHeader: true,

        }
        this.UpdateHeader()
        thisObj = this;
    }
    reset = () => {
        this.setState({ selectedItem: '' });
    }

    CurrentHeaderName = (update = false) => {

        const pName = validJSON(sessionStorage.getItem("project")).ProjectName;
        const rName = validJSON(sessionStorage.getItem("role")).RoleName;
        const sName = validJSON(sessionStorage.getItem("studyDetails")).studyName;
        header = "";

        if (rName && pName && sName) {
            header = pName + " | " + sName + " | " + rName;
        }
        else if (rName && pName) {
            header = pName + " | " + rName;

        }
        else if (sName && pName) {
            header = pName + " | " + sName;

        }
        else if (rName) {
            header = rName;

        }


        return header;

    }

    UpdateHeader = (value) => {
        this.setState({ showHeader: value });
    }

    render() {
        const { toggleCollapsed, url, customizedTheme, locale, permissions } = this.props;
        const collapsed = true;
        const styling = {
            background: customizedTheme.backgroundColor,
            position: 'fixed',
            width: '100%',
            height: 45,
            padding: '0px 20px 0 0'
        };




        return (
            <TopbarWrapper>
                <Header
                    style={styling}
                    className={
                        collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
                    }
                >
                    <div className="logoLeft">
                        <Logo collapsed={false} />
                    </div>

                    <ul className="isoRight">
                        <h3>{this.CurrentHeaderName()}</h3>
                        {checkPermission(permissions, ['ConfigMenu']) >= 1 ? <li
                            onClick={() => this.setState({ selectedItem: 'settings' })} title="Config Menu">
                            <ConfigMenu locale={locale} url={url} permissions={permissions.ConfigMenu} />
                        </li> : null}

                        {checkPermission(permissions, ['DevConfigMenu']) >= 1 ? <li
                            onClick={() => this.setState({ selectedItem: 'settings' })} title="Dev Config Menu">
                            <DevConfigMenu locale={locale} url={url} permissions={permissions.DevConfigMenu} />
                        </li> : null}

                        {checkPermission(permissions, ['MainMenu']) >= 1 ? <li
                            onClick={() => this.setState({ selectedItem: 'menu' })} className="isoNotify" title = "Main Menu"
                        >
                            <MainMenu locale={locale} url={url} permissions={permissions.MainMenu} />
                        </li> : null}

                        <li onClick={() => this.setState({ selectedItem: 'user' })} className="isoUser">
                            <UserMenu history={this.props.history} locale={locale} reset={this.reset} />
                        </li>


                    </ul>
                </Header>
            </TopbarWrapper>
        );
    }
}

export default connect(
    state => ({
        ...state.App.toJS(),
        locale: state.LanguageSwitcher.toJS().language.locale,
        customizedTheme: state.ThemeSwitcher.toJS().topbarTheme
    }),
    { toggleCollapsed }
)(Topbar);


export function clearHeader() {
    thisObj.setState({ showHeader: "" });
}
export function setHeader(action = true, removestudy = false) {
    //for Role based user login we need to show Project and role name all time
    //but in admin rol show Project name only if we select Project otherwise no need to show
    let adminType = validJSON(sessionStorage.userProfile).adminType;

    let { permission } = sessionStorage.getItem("permissions");
    let permissions = validJSON(permission);


    if (!action && checkPermission(permissions, ['Header']) >= 4 ) {
        sessionStorage.removeItem("studyDetails")
        sessionStorage.removeItem("project")
    } else if (!action) {
        sessionStorage.removeItem("studyDetails")
    }

    if (removestudy) {
        sessionStorage.removeItem("studyDetails")
        action = true;
    }

    //checkPermission(permissions, ['Header']) is  3 ? Manager/UserRole    
    //checkPermission(permissions, ['Header']) is  4 ? Manager/Admin(Super/System)
    thisObj.UpdateHeader(action || (adminType && checkPermission(permissions, ['Header']) != 4 ));

}