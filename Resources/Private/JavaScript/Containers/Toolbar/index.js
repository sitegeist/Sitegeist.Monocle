import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';
import {IconButton} from 'Components/index';

@connect(state => {
	return {
		aIsActive: state.displayOptions.fullscreen
	};
}, {
	toggleFullscreen: redux.DisplayOptions.actions.toggleFullscreen
})
export default class Toolbar extends Component {
	static propTypes = {
		aIsActive: PropTypes.bool.isRequired,

		toggleFullscreen: PropTypes.func.isRequired
	};

	render() {
		const {aIsActive, toggleFullscreen} = this.props;

		return (<ul>
			<li>
				<IconButton type="eye-open" />
			</li>
			<li>
				<IconButton type="code" />
			</li>
			<li>
				<IconButton type="file-text" />
			</li>
		</ul>);
	}
}
