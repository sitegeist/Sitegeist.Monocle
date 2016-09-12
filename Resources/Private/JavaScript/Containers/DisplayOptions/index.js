import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';
import IconButton from '@neos-project/react-ui-components/lib/IconButton';

@connect(state => {
	return {
        showRenderedElements: state.displayOptions.renderedElements,
        showSourceCode: state.displayOptions.sourceCode,
        showDescription : state.displayOptions.description
	};
}, {
    toggleRenderedElements: redux.DisplayOptions.actions.toggleRenderedElements,
    toggleSourceCode: redux.DisplayOptions.actions.toggleSourceCode,
    toggleDescription: redux.DisplayOptions.actions.toggleDescription
})
export default class DisplayOptions extends Component {
	static propTypes = {
        showRenderedElements: PropTypes.bool.isRequired,
        showSourceCode: PropTypes.bool.isRequired,
        showDescription: PropTypes.bool.isRequired,
        showFullScreen: PropTypes.bool.isRequired,

        toggleRenderedElements: PropTypes.func.isRequired,
        toggleSourceCode: PropTypes.func.isRequired,
        toggleDescription: PropTypes.func.isRequired
	};

	render() {
		const {
		    showRenderedElements,
            showSourceCode,
            showDescription,
            showFullScreen,
            toggleRenderedElements,
            toggleSourceCode,
            toggleDescription
		} = this.props;

		return (
            <span>
                <IconButton icon="eye" onClick={toggleRenderedElements} className={showRenderedElements ? 'neos-active':''} isActive={showRenderedElements} />
                <IconButton icon="code" onClick={toggleSourceCode} className={showSourceCode ? 'neos-active':''} isActive={showSourceCode} />
                <IconButton icon="file-text" onClick={toggleDescription} className={showDescription ? 'neos-active':''} isActive={showDescription} />
            </span>
        );
	}
}
