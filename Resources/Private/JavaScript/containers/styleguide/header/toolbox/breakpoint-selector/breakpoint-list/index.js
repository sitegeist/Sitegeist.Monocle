import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withHandlers} from 'recompose';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import Breakpoint from './breakpoint';

import style from './style.css';

@visibility
@outside
@attached('right')
@connect(state => {
    return {
        breakpoints: selectors.breakpoints.all(state)
    };
}, {
    selectBreakpoint: actions.breakpoints.select
})
@withHandlers({
    handleSelectBreakpoint: props => breakpointName => {
        props.selectBreakpoint(breakpointName);
        props.onSelectBreakpoint(breakpointName);
    }
})
export default class BreakpointList extends PureComponent {
    static propTypes = {
        breakpoints: PropTypes.object.isRequired,
        handleSelectBreakpoint: PropTypes.func.isRequired
    };

    render() {
        const {breakpoints, handleSelectBreakpoint} = this.props;
        const relevantBreakpoints = Object.keys(breakpoints).filter(name => breakpoints[name])
            .map(name => ({name, ...breakpoints[name]}));

        return (
            <div className={style.list}>
                <div className={style.breakpoints}>
                    {relevantBreakpoints.map(
                        breakpoint => (
                            <Breakpoint
                                key={breakpoint.name}
                                onClick={handleSelectBreakpoint}
                                dimensions={`${breakpoint.width}x${breakpoint.height}`}
                                {...breakpoint}
                                />
                        )
                    )}
                    <hr className={style.separator}/>
                    <Breakpoint
                        onClick={handleSelectBreakpoint}
                        name=""
                        label="Fullscreen"
                        />
                </div>
            </div>
        );
    }
}
