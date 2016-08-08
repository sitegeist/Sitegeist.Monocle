import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import {DropDown} from 'Components/index';


@connect(state => {
    return {
        activeBreakpoint: state.breakpoints.active,
        availableBreakpoints: state.breakpoints.available
    };
}, {
    setActiveBreakpoint: redux.Breakpoints.actions.setActiveBreakpoint
})
export default class BreakpointSelector extends Component {
    static propTypes = {
        activeBreakpoint: PropTypes.string.isRequired,
        availableBreakpoints: PropTypes.object.isRequired,
        setActiveBreakpoint:  PropTypes.func.isRequired,
    };

    render() {

        const {
            activeBreakpoint,
            availableBreakpoints,
            setActiveBreakpoint
        } = this.props;

        // available items
        const items = [];
        for (var key in availableBreakpoints) {
            if (availableBreakpoints.hasOwnProperty(key)) {
                items.push({key: key, label: availableBreakpoints[key]['label']});
            }
        }

        // active label
        const label = (availableBreakpoints[activeBreakpoint]) ? availableBreakpoints[activeBreakpoint]['label'] : '--';

        console.log(items);

        return (
            <DropDown label={label} items={items} onSelectItem={setActiveBreakpoint}/>
        );
    }
}
