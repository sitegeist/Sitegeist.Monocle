import React, {PureComponent} from "react";
import {connect} from "react-redux";

import { visibility, outside, attached } from "../../../../../../components";
import { selectors, actions, State } from "../../../../../../state";

import { Breakpoint } from "./breakpoint";

import style from "./style.module.css";

interface BreakpointListProps {
    breakpoints: {
        [key: string]: {
            label: string
            width: number
            height: number
        }
    }
    selectBreakpoint: (breakpointName: string) => void
    onSelectBreakpoint: (breakpointName: string) => void
}
class BreakpointListC extends PureComponent<BreakpointListProps> {
    handleSelectBreakpoint = (breakpointName: string) => {
        this.props.selectBreakpoint(breakpointName);
        this.props.onSelectBreakpoint(breakpointName);
    }

    render() {
        const { breakpoints } = this.props;
        const relevantBreakpoints = Object.keys(breakpoints).filter(name => breakpoints[name])
            .map(name => ({ name, ...breakpoints[name] }));

        return (
            <div className={style.list}>
                <div className={style.breakpoints}>
                    {relevantBreakpoints.map(
                        breakpoint => (
                            <Breakpoint
                                key={breakpoint.name}
                                onClick={this.handleSelectBreakpoint}
                                dimensions={`${breakpoint.width}x${breakpoint.height}`}
                                {...breakpoint}
                                />
                        )
                    )}
                    <hr className={style.separator}/>
                    <Breakpoint
                        onClick={this.handleSelectBreakpoint}
                        name=""
                        label="Fullscreen"
                        />
                </div>
            </div>
        );
    }
}

export const BreakpointList = visibility(outside(attached('right')(
    connect((state: State) => {
        return {
            breakpoints: selectors.breakpoints.all(state)
        };
    }, {
        selectBreakpoint: actions.breakpoints.select
    })(BreakpointListC)
)));
