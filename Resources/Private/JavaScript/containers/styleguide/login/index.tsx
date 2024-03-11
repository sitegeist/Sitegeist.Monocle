import * as React from "react";
import { PureComponent } from "react";
import {connect} from "react-redux";

import { Dialog, TextInput, Button } from "@neos-project/react-ui-components";

import { selectors, actions, State } from "../../../state";
import { visibility } from "../../../components";

import style from "./style.module.css";

interface LoginProps {
    authorize: (username: string, password: string) => void
}

interface LoginState {
    username: string
    password: string
}

class LoginC extends PureComponent<LoginProps, LoginState> {
    performAuthorization = () => this.props.authorize(
        this.state.username,
        this.state.password
    );

    setUsername = (username: string) => this.setState({ username });

    setPassword = (password: string) => this.setState({ password });

    render() {
        const { username, password } = this.state;

        return (
            <Dialog isOpen title="Login" actions={this.renderActions()}>
                <div className={style.form}>
                    It seems, your session has expired. You need to login to continue:
                    <br/>
                    <br/>
                    <TextInput placeholder="Username" onChange={this.setUsername} value={username}/>
                    <TextInput placeholder="Password" type="password" onChange={this.setPassword} value={password}/>
                </div>
            </Dialog>
        );
    }

    renderActions() {
        return [
            <Button style="brand" onClick={this.performAuthorization}>Login</Button>
        ];
    }
}

export const Login = connect((state: State) => {
    return {
        isVisible: selectors.business.needsAuthentication(state)
    };
}, {
    authorize: actions.business.authorize
})(visibility(LoginC));
