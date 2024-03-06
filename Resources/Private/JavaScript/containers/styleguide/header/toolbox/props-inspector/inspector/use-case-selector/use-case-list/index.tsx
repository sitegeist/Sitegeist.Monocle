import * as React from "react";
import { PureComponent } from "react";

import {visibility, outside} from "../../../../../../../../components";

import { UseCase } from "./use-case";

import style from "./style.module.css";

interface UseCaseListProps {
    useCases: {
        name: string
        title: string
        overrides: Record<string, any>
    }[]
    onSelectUseCase: (useCaseName: string) => void
}

class UseCaseListC extends PureComponent<UseCaseListProps> {
    handleSelectUseCase = (useCaseName: string) => {
        this.props.onSelectUseCase(useCaseName);
    }

    render() {
        const { useCases } = this.props;

        return (
            <div className={style.list}>
                <div className={style.useCases}>
                    <UseCase
                        key="__default"
                        name="__default"
                        title={'Default'}
                        onClick={this.handleSelectUseCase}
                        />
                    {useCases.map(
                        useCase => (
                            <UseCase
                                key={useCase.name}
                                name={useCase.name}
                                title={useCase.title}
                                onClick={this.handleSelectUseCase}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}

export const UseCaseList = visibility(outside(UseCaseListC));
