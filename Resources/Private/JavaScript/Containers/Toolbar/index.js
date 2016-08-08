import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';
import {IconButton} from 'Components/index';

@connect(state => {
	return {
        showRenderedElements: state.displayOptions.renderedElements,
        showSourceCode: state.displayOptions.sourceCode,
        showDescription : state.displayOptions.description,
        showFullScreen: state.displayOptions.fullscreen
	};
}, {
    toggleRenderedElements: redux.DisplayOptions.actions.toggleRenderedElements,
    toggleSourceCode: redux.DisplayOptions.actions.toggleSourceCode,
    toggleDescription: redux.DisplayOptions.actions.toggleDescription,
    toggleFullscreen: redux.DisplayOptions.actions.toggleFullscreen
})
export default class Toolbar extends Component {
	static propTypes = {
        showRenderedElements: PropTypes.bool.isRequired,
        showSourceCode: PropTypes.bool.isRequired,
        showDescription: PropTypes.bool.isRequired,
        showFullScreen: PropTypes.bool.isRequired,

        toggleRenderedElements: PropTypes.func.isRequired,
        toggleSourceCode: PropTypes.func.isRequired,
        toggleDescription: PropTypes.func.isRequired,
		toggleFullscreen: PropTypes.func.isRequired
	};

	render() {
		const {
		    showRenderedElements,
            showSourceCode,
            showDescription,
            showFullScreen,
            toggleRenderedElements,
            toggleSourceCode,
            toggleDescription,
            toggleFullscreen
		} = this.props;

		return (
		    <div className="neos-header" >
		        <div className="neos-pull-right" >
                    <div className="neos-button-group">
                        <IconButton type="eye-open" onClick={toggleRenderedElements} active={showRenderedElements} />
                        <IconButton type="code" onClick={toggleSourceCode} active={showSourceCode} />
                        <IconButton type="file-text" onClick={toggleDescription} active={showDescription} />
                        <IconButton type="expand" onClick={toggleFullscreen} active={showFullScreen} />
                    </div>
                </div>
			</div>
        );
	}
}
