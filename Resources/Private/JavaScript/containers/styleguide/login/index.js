import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withState, withHandlers} from 'recompose';

import Dialog from '@neos-project/react-ui-components/lib-esm/Dialog';
import TextInput from '@neos-project/react-ui-components/lib-esm/TextInput';
import Button from '@neos-project/react-ui-components/lib-esm/Button';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@withState('username', 'setUsername', '')
@withState('password', 'setPassword', '')
@connect(state => {
    return {
        isVisible: selectors.business.needsAuthentication(state)
    };
}, {
    authorize: actions.business.authorize
})
@withHandlers({
    performAuthorization: ({username, password, authorize}) => () => authorize(username, password)
})
@visibility
export default class Login extends PureComponent {
    static propTypes = {
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        setUsername: PropTypes.func.isRequired,
        setPassword: PropTypes.func.isRequired,
        performAuthorization: PropTypes.func.isRequired
    };

    render() {
        const {username, password, setUsername, setPassword} = this.props;

        return (
            <Dialog isOpen title="Login" onRequestClose={() => {}} actions={this.renderActions()}>
                <div className={style.form}>
                    It seems, your session has expired. You need to login to continue:
                    <br/>
                    <br/>
                    <TextInput placeholder="Username" onChange={setUsername} value={username}/>
                    <TextInput placeholder="Password" type="password" onChange={setPassword} value={password}/>
                </div>
            </Dialog>
        );
    }

    renderActions() {
        const {performAuthorization} = this.props;

        return [
            <Button style="brand" onClick={performAuthorization}>Login</Button>
        ];
    }
}
