import * as React from "react";
import { PureComponent } from "react";

import {connect} from "react-redux";
import cx from "classnames";

import {actions, selectors, State} from "../../../../../../state";

import { PropSetSelector } from "./prop-set-selector";
import { PropsItem } from "./props-item";

import style from "./style.css";

interface InspectorProps {
    fusionAst: {
        __meta: {
            styleguide: {
                props: {
                    [key: string]: any
                }
                propSets: {
                    [key: string]: any
                }
            }
        }
    }
    overriddenProps: {
        [key: string]: any
    }
    selectedPropSet: string
    isVisible: boolean
    selectPropSet: (propSetName: string) => void
    overrideProp: (name: string, value: any) => void
}

class InspectorC extends PureComponent<InspectorProps> {
    handleSelectPropSet = (propSetName: string) => {
        const { selectPropSet } = this.props;

        selectPropSet(propSetName);
    };

    handleChange = (name: string, value: any) => {
        const { overrideProp } = this.props;

        overrideProp(name, value);
    };

    render() {
        const {fusionAst, overriddenProps, selectedPropSet, isVisible} = this.props;
        if (!fusionAst) {
            return null;
        }

        const {props, propSets} = fusionAst.__meta.styleguide;
        const currentProps = (propSets && selectedPropSet in propSets) ? Object.assign({}, props, propSets[selectedPropSet]) : props;

        return (
            <div
                className={cx({
                    [style.inspector]: true,
                    [style.isVisible]: isVisible
                })}
                >
                {propSets && (
                    <PropSetSelector
                        enable={Boolean(propSets)}
                        label={selectedPropSet in propSets ? selectedPropSet : 'Default'}
                        propSets={propSets}
                        onSelectPropSet={this.handleSelectPropSet}
                        />
                )}
                {currentProps && Object.keys(currentProps).map(name => (
                    <PropsItem
                        key={name}
                        name={name}
                        type={typeof currentProps[name]}
                        value={name in overriddenProps ? overriddenProps[name] : currentProps[name]}
                        onChange={this.handleChange}
                        />
                ))}
            </div>
        );
    }
}

export const Inspector = connect((state: State) => {
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);

    return {
        ...currentlyRenderedPrototype,
        overriddenProps: selectors.prototypes.overriddenProps(state),
        selectedPropSet: selectors.prototypes.selectedPropSet(state)
    };
}, {
    overrideProp: actions.prototypes.overrideProp,
    selectPropSet: actions.prototypes.selectPropSet
})(InspectorC)
