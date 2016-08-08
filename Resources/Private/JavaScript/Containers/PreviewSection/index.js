import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';

@connect(state => {
	return {
        activeBreakpoint: state.breakpoints.active,
        availableBreakpoints: state.breakpoints.available
	};
})
export default class PreviewSection extends Component {
	static propTypes = {
        children: PropTypes.node,
        activeBreakpoint: PropTypes.string,
        availableBreakpoints: PropTypes.object
	};

    render() {
        const {children, activeBreakpoint, availableBreakpoints} = this.props;

        const width = (availableBreakpoints[activeBreakpoint]) ? availableBreakpoints[activeBreakpoint]['width'] : '';
        const label = (availableBreakpoints[activeBreakpoint]) ? availableBreakpoints[activeBreakpoint]['label'] : '';

        return <div>
            <h1>Preview: {activeBreakpoint} {label} {width}</h1>
            {children}
        </div>;
    }
}
