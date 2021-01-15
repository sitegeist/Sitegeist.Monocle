import * as React from "react";
import { PureComponent } from "react";

import TextInput from "@neos-project/react-ui-components/lib-esm/TextInput";

import { visibility, outside, attached } from "../../../../../components";

import { PrototypeGroup } from "./prototype-group";

import style from "./style.css";

interface PrototypeListProps {
    searchTerm: string
    prototypeGroups: {
        label: string
        prototypes: {
            title: string
            name: string
            isFocused: boolean
            structure: {
                color: string
                icon: string
            }
        }[]
    }[]
    onChangeSearchTerm: (searchTerm: string) => void
    onSelectPrototype: (name: string) => void
}

class PrototypeListC extends PureComponent<PrototypeListProps> {
    render() {
        const {searchTerm, prototypeGroups, onChangeSearchTerm, onSelectPrototype} = this.props;

        return (
            <div className={style.list}>
                <div className={style.searchField}>
                    <TextInput autoFocus placeholder="Search..." value={searchTerm} onChange={onChangeSearchTerm}/>
                </div>
                <div className={style.prototypes}>
                    {prototypeGroups.map(
                        prototypeGroup => (
                            <PrototypeGroup
                                key={prototypeGroup.label}
                                onSelectPrototype={onSelectPrototype}
                                {...prototypeGroup}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}

export const PrototypeList = visibility(outside(attached()(PrototypeListC)));
