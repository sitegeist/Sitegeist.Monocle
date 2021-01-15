import * as React from "react";
import { PureComponent } from "react";

import {visibility, outside} from "../../../../../../../../components";

import { PropSet } from "./prop-set";

import style from "./style.css";

interface PropSetListProps {
    propSets: {
        name: string
        overrides: Record<'string', any>
    }[]
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
                    {propSets.map(
                        propSet => (
                            <PropSet
                                key={propSet.name}
                                name={propSet.name}
                                label={propSet.name}
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
