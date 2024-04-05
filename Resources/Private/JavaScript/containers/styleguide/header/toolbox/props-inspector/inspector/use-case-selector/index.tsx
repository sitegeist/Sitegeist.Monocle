import * as React from "react";
import { PureComponent } from "react";

import { Button, Icon } from "@neos-project/react-ui-components";

import { UseCaseList } from "./use-case-list";

import style from "./style.module.css";

interface UseCaseSelectorProps {
    label: string
    enable: boolean
    useCases: {
        name: string
        title: string
        overrides: Record<string, any>
    }[]
    onSelectUseCase: (useCaseName: string) => void
}

interface UseCaseSelectorState {
    isOpen: boolean
}

export class UseCaseSelector extends PureComponent<UseCaseSelectorProps, UseCaseSelectorState> {
    state: UseCaseSelectorState = {
        isOpen: false
    };

    toggleIsOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };


    handleSelectUseCase = (useCaseName: string) => {
        const { onSelectUseCase } = this.props;

        onSelectUseCase(useCaseName);
        this.toggleIsOpen();
    };

    render() {
        const { label, useCases } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={style.container}>
                <label htmlFor="usecases">Choose Use case</label>
                <Button className={style.selector} id="usecases" style="clean" onClick={this.toggleIsOpen}>
                    {label}
                    <Icon icon={isOpen ? 'chevron-up' : 'chevron-down'} className={style.icon}/>
                </Button>
                <UseCaseList
                    isVisible={isOpen}
                    onClickOutside={this.toggleIsOpen}
                    onSelectUseCase={this.handleSelectUseCase}
                    useCases={useCases}
                    />
            </div>
        );
    }
}
