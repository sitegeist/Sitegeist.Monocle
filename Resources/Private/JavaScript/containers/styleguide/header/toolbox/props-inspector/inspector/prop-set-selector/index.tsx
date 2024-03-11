import * as React from "react";
import { PureComponent } from "react";

import { Button, Icon } from "@neos-project/react-ui-components";

import { PropSetList } from "./prop-set-list";

import style from "./style.module.css";

interface PropSetSelectorProps {
    label: string
    enable: boolean
    propSets: {
        name: string
        overrides: Record<string, any>
    }[]
    onSelectPropSet: (propSetName: string) => void
}

interface PropSetSelectorState {
    isOpen: boolean
}

export class PropSetSelector extends PureComponent<PropSetSelectorProps, PropSetSelectorState> {
    state: PropSetSelectorState = {
        isOpen: false
    };

    toggleIsOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };


    handleSelectPropSet = (propSetName: string) => {
        const { onSelectPropSet } = this.props;

        onSelectPropSet(propSetName);
        this.toggleIsOpen();
    };

    render() {
        const { label, propSets } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={style.container}>
                <label htmlFor="propsets">Choose Prop set</label>
                <Button className={style.selector} id="propsets" style="clean" onClick={this.toggleIsOpen}>
                    {label}
                    <Icon icon={isOpen ? 'chevron-up' : 'chevron-down'} className={style.icon}/>
                </Button>
                <PropSetList
                    isVisible={isOpen}
                    onClickOutside={this.toggleIsOpen}
                    onSelectPropSet={this.handleSelectPropSet}
                    propSets={propSets}
                    />
            </div>
        );
    }
}
