import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {redux} from 'Redux/index';

import styles from './style.css';


@connect(state => {
	return {
        showFullScreen: state.displayOptions.fullscreen
	};
})
export default class App extends Component {
	static propTypes = {
        children: PropTypes.node.isRequired,
        showFullScreen: PropTypes.bool.isRequired,
	};

    render() {
        const {children, showFullScreen} = this.props;

        const classNames = mergeClassNames({
            [styles.app]: true,
            [styles.isFullscreen]: showFullScreen
        });

        return <div className={classNames}>
            {children}
        </div>;
    }
}
