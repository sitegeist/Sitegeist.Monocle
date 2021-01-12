import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { actions } from "../../../../../state";

import { AnatomyItem } from "./anatomy-item";

export interface AnatomyType {
    prototypeName: string
    children: AnatomyType[]
}

function reduceAnatomicalTreeToComponents(
    anatomy: AnatomyType | AnatomyType[],
    prototypeNames: string[]
): AnatomyType[] {
    if (Array.isArray(anatomy)) {
        return anatomy.reduce((acc, a) => {
            return acc.concat(reduceAnatomicalTreeToComponents(a, prototypeNames));
        }, [] as AnatomyType[]);
    }

    if (anatomy.prototypeName && prototypeNames.includes(anatomy.prototypeName)) {
        return [{
            prototypeName: anatomy.prototypeName,
            children: reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames)
        }];
    } else if (anatomy.children) {
        return reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames);
    }

    return [];
};

interface AnatomyProps {
    anatomy: AnatomyType | AnatomyType[]
    prototypes: object
    prototypeName: string
    select: (prototypeName: string) => void
}

class AnatomyC extends PureComponent<AnatomyProps> {
    handleSelectPrototype = (prototypeName: string) => {
        const { select } = this.props;

        select(prototypeName);
    };

    render() {
        const { anatomy, prototypes, prototypeName } = this.props;
        const processedAnatomy = reduceAnatomicalTreeToComponents(anatomy, Object.keys(prototypes));

        return (
            <div>
                <AnatomyItem
                    name={prototypeName}
                    children={processedAnatomy}
                    onSelect={this.handleSelectPrototype}
                    />
            </div>
        );
    }
}

export const Anatomy = connect(() => ({}), {
    select: actions.prototypes.select
})(AnatomyC);
