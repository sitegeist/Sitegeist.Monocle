import * as React from "react";
import { PureComponent } from "react";

import {visibility, outside} from "../../../../../../../../components";

import { PropSet } from "./prop-set";

import style from "./style.css";

interface PropSetListProps {
    propSets: {
        [key: string]: any
    }
    onSelectPropSet: (propSetName: string) => void
}

class PropSetListC extends PureComponent<PropSetListProps> {
    handleSelectPropSet = (propSetName: string) => {
        this.props.onSelectPropSet(propSetName);
    }

    render() {
        const { propSets } = this.props;

        return (
            <div className={style.list}>
                <div className={style.propSets}>
                    <PropSet
                        key="__default"
                        name="__default"
                        label={'Default'}
                        onClick={this.handleSelectPropSet}
                        />
                    {Object.keys(propSets).map(
                        propSetName => (
                            <PropSet
                                key={propSetName}
                                name={propSetName}
                                label={propSetName}
                                onClick={this.handleSelectPropSet}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}

export const PropSetList = visibility(outside(PropSetListC));
