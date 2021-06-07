import * as React from "react";
import { PureComponent } from "react";

import {connect} from "react-redux";
import cx from "classnames";

import {actions, selectors, State} from "../../../../../../state";

import { UseCaseSelector } from "./use-case-selector";
import { PropSetSelector } from "./prop-set-selector";
import { PropsItem } from "./props-item";

import style from "./style.css";

interface InspectorProps {
    prototypeDetails: null | {
        props: {
            name: string
            value: any
            editor: {
                identifier: string
                options: any
            }
        }[]
        propSets: {
            name: string
            overrides: Record<string, any>
        }[]
        useCases: {
            name: string
            title: string
            overrides: Record<string, any>
        }[]
    }
    overriddenProps: {
        [key: string]: any
    }
    selectedPropSet: {
        name: string
        overrides: Record<string, any>
    }
    selectedUseCase: {
        name: string
        title: string
        overrides: Record<string, any>
    }
    isVisible: boolean
    selectPropSet: (propSetName: string) => void
    selectUseCase: (useCaseName: string) => void
    overrideProp: (name: string, value: any) => void
}

class InspectorC extends PureComponent<InspectorProps> {
    handleSelectPropSet = (propSetName: string) => {
        const { selectPropSet } = this.props;

        selectPropSet(propSetName);
    };

    handleSelectUseCase = (useCaseName: string) => {
        const { selectUseCase } = this.props;

        selectUseCase(useCaseName);
    };

    handleChange = (name: string, value: any) => {
        const { overrideProp } = this.props;

        overrideProp(name, value);
    };

    render() {
        const {prototypeDetails, selectedPropSet, selectedUseCase, isVisible} = this.props;
        if (!prototypeDetails) {
            return null;
        }

        return (
            <div
                className={cx({
                    [style.inspector]: true,
                    [style.isVisible]: isVisible
                })}
                >
                {Boolean(prototypeDetails.useCases.length) && (
                    <div className={style.container}>
                        <UseCaseSelector
                            enable={Boolean(prototypeDetails.useCases.length)}
                            label={
                                selectedUseCase.name === '__default'
                                    ? 'Default'
                                    : selectedUseCase.title
                            }
                            useCases={prototypeDetails.useCases}
                            onSelectUseCase={this.handleSelectUseCase}
                            />
                    </div>
                )}
                {Boolean(prototypeDetails.propSets.length) && (
                    <div className={style.container}>
                        <PropSetSelector
                            enable={Boolean(prototypeDetails.propSets.length)}
                            label={
                                selectedPropSet.name === '__default'
                                    ? 'Default'
                                    : selectedPropSet.name
                            }
                            propSets={prototypeDetails.propSets}
                            onSelectPropSet={this.handleSelectPropSet}
                            />
                    </div>
                )}
                {prototypeDetails.props && (
                    <div className={style.container}>
                        {prototypeDetails.props.map(prop => (
                            <PropsItem
                                key={prop.name}
                                prop={prop}
                                onChange={this.handleChange}
                                />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export const Inspector = connect((state: State) => {
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);

    return {
        prototypeDetails: currentlyRenderedPrototype,
        overriddenProps: selectors.prototypes.overriddenProps(state),
        selectedPropSet: selectors.prototypes.selectedPropSet(state),
        selectedUseCase: selectors.prototypes.selectedUseCase(state)
    };
}, {
    overrideProp: actions.prototypes.overrideProp,
    selectPropSet: actions.prototypes.selectPropSet,
    selectUseCase: actions.prototypes.selectUseCase
})(InspectorC)
