import React, {PureComponent} from 'react';
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
    render() {
        const {breakpoints, handleSelectBreakpoint} = this.props;

        return (
            <div className={style.list}>
                <div className={style.breakpoints}>
                    {Object.keys(breakpoints).map(name => ({name, ...breakpoints[name]})).map(
                        breakpoint => (
                            <Breakpoint
                                key={breakpoint.name}
                                onClick={handleSelectBreakpoint}
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
