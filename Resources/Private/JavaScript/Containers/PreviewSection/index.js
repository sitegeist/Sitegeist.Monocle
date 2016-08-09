import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';

@connect(state => {
	return {
        activePreset: state.viewportOptions.activePreset,
        availablePresets: state.viewportOptions.availablePresets
	};
})
export default class PreviewSection extends Component {
	static propTypes = {
        children: PropTypes.node,
        activePreset: PropTypes.string,
        availablePresets: PropTypes.object
	};

    render() {
        const {children, activePreset, availablePresets} = this.props;

        const width = (availablePresets[activePreset]) ? availablePresets[activePreset]['width'] : '';
        const label = (availablePresets[activePreset]) ? availablePresets[activePreset]['label'] : '';

        return <div>
            <h1>Preview: {activePreset} {label} {width}</h1>
            {children}
        </div>;
    }
}
