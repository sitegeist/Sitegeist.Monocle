import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {visibility} from 'components';
import {selectors} from 'state';

import style from './style.css';

@connect(state => {
    const url = selectors.navigation.previewUri(state);
    const isVisible = Boolean(url);

    return {url, isVisible};
})
@visibility
export default class FullscreenToggler extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired
    };

    render() {
        const {url} = this.props;

        return (
	<a href={url} target="_blank">
		<Button className={style.selector} style="clean">
			<Icon icon="external-link" className={style.icon}/>
		</Button>
	</a>
        );
    }
}
