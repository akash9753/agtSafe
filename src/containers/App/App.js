import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";
import { Debounce } from "react-throttle";
import WindowResizeListener from "react-window-size-listener";
import { ThemeProvider } from "styled-components";
import authAction from "../../redux/auth/actions";
import appActions from "../../redux/app/actions";
import Topbar from "../Topbar/Topbar";
import ThemeSwitcher from "../../containers/ThemeSwitcher";
import AppRouter from "./AppRouter";
import { siteConfig } from "../../config.js";
import { AppLocale } from "../../dashApp";
import themes from "../../settings/themes";
import AppHolder from "./commonStyle";
import IdleTimer from "react-idle-timer";
import { fnLogout, checkinMapping, getSesssionValue, CallServerPost, setSessionValue, errorModalCallback } from "../Utility/sharedUtility";

//Importing Footer
import Footer from "../Footer/index.js";

import "./global.css";

const { Content } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;
export class App extends Component {
    constructor(props) {
        super(props);
        this.idleTimer = null;
        this.onAction = this._onAction.bind(this);
        this.onActive = this._onActive.bind(this);
        this.onIdle = this._onIdle.bind(this);
    }
    _onAction(e) {
    }
    _onActive(e) {
    }
    _onIdle(e) {
        fnLogout();

    }


    componentDidMount() {
        //var LoginCreate = JSON.parse(sessionStorage.getItem("LoginCreate"));
        //if (LoginCreate)
        //{

        //    var userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
        //    window.userParam = userProfile;

        //    var urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
        //    var url = urlBase + "Login/LoginCreate";

        //    fetch(url, {
        //        method: 'POST', // or 'PUT'
        //        headers: {
        //            'Content-Type': 'application/json',
        //            'UserID': userProfile.userID
        //        },
        //        body: JSON.stringify(userProfile),
        //    })
        //        .then(response => {
        //            response.json()

        //        })
        //        .then(data =>
        //        {

        //            sessionStorage.setItem("LoginCreate", false);

        //            console.log('Success:', data);
        //        })
        //        .catch((error) => {
        //            console.error('Error:', error);
        //        });

        //}
        console.log("");
    }

    componentWillUnmount() {

        console.log("kk");
    }

    render() {
        const { url } = this.props.match;
        const empty = {};
        const { locale, selectedTheme } = this.props;
        const currentAppLocale = AppLocale[locale];
        const permissions =
            sessionStorage.getItem("permissions") !== null
                ? JSON.parse(sessionStorage.getItem("permissions"))
                : empty;
        let timeOut = sessionStorage.getItem("timeout");
        return (
            <div>
                <IdleTimer
                    ref={ref => {
                        this.idleTimer = ref;
                    }}
                    element={document}
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    onAction={this.onAction}
                    debounce={250}
                    timeout={1000 * 60 * parseInt(timeOut)}
                />

                <LocaleProvider locale={currentAppLocale.antd}>
                    <IntlProvider
                        locale={currentAppLocale.locale}
                        messages={currentAppLocale.messages}
                    >

                        <ThemeProvider theme={themes[selectedTheme]}>
                            <AppHolder>
                                <Layout style={{ height: "100vh" }}>
                                    <Debounce time="1000" handler="onResize">
                                        <WindowResizeListener
                                            onResize={windowSize =>
                                                this.props.toggleAll(
                                                    windowSize.windowWidth,
                                                    windowSize.windowHeight
                                                )
                                            }
                                        />
                                    </Debounce>
                                    <Topbar
                                        url={url}
                                        history={this.props.history}
                                        permissions={
                                            typeof permissions !== "undefined" ? permissions : empty
                                        }
                                    />
                                    <Layout
                                        style={{ flexDirection: "row", overflowX: "hidden" }}
                                    >
                                        <Layout
                                            className="isoContentMainLayout"
                                            style={{
                                                height: "auto"
                                            }}
                                        >
                                            <Content
                                                className="isomorphicContent"
                                                style={{
                                                    padding: "45px 0 0",
                                                    flexShrink: "0",
                                                    background: "#f1f3f6"
                                                }}
                                            >
                                                <AppRouter url={url} permissions={permissions} />
                                            </Content>
                                        </Layout>
                                    </Layout>
                                    <Footer />
                                </Layout>
                            </AppHolder>
                        </ThemeProvider>
                    </IntlProvider>
                </LocaleProvider>
            </div>
        );
    }

}

export default connect(
    state => ({
        auth: state.Auth,
        locale: state.LanguageSwitcher.toJS().language.locale,
        selectedTheme: state.ThemeSwitcher.toJS().changeThemes.themeName
    }),
    { logout, toggleAll }
)(App);
