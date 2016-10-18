import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';
import Bar from '@neos-project/react-ui-components/lib/Bar';

import {Navigation, ViewportOptions} from 'Containers/index';
import styles from './style.css';

@connect(state => {
	return {
        fullscreenUri: state.styleguide.fullscreenUri,
	};
})
export default class Toolbar extends Component {
    static propTypes = {
        fullscreenUri: PropTypes.string.isRequired
	};

	render() {
        const {fullscreenUri} = this.props;

		return (
            <Bar position="top" className={styles.bar}>
                <div className={styles.navigation}>
                    <Navigation />
                </div>

                <div className={styles.viewports}>
                    <ViewportOptions/>
                </div>
            </Bar>
        );
	}
}
