import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {actions} from 'state';

const reduceAnatomicalTreeToComponents = (anatomy, prototypeNames) => {
    if (anatomy.prototypeName && prototypeNames.includes(anatomy.prototypeName)) {
        return {
            prototypeName: anatomy.prototypeName,
            children: reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames)
        };
    } else if (anatomy.children) {
        return reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames);
    }

    const result = anatomy.map(a => reduceAnatomicalTreeToComponents(a, prototypeNames))
        .filter(n => n && (n.prototypeName || n.length));

    if (!result.prototypeName && result.length === 1) {
        return result[0];
    }

    return result;
};

@connect(() => {}, {
    select: actions.prototypes.select
})
export default class Anatomy extends PureComponent {
    handleSelectPrototype = prototypeName => () => {
        const {select} = this.props;

        select(prototypeName);
    };

    renderAnatomyRecursively(level) {
        if (level.children) {
            return (
                <div>
                    <span onClick={this.handleSelectPrototype(level.prototypeName)}>{level.prototypeName}</span>
                    {level.children.length ? this.renderAnatomyRecursively(level.children) : null}
                </div>
            );
        }

        return (
            <ul>
                {level.map(l => <li key={l.prototypeName}>{this.renderAnatomyRecursively(l)}</li>)}
            </ul>
        );
    }

    render() {
        const {anatomy, prototypes, prototypeName} = this.props;
        const processedAnatomy = reduceAnatomicalTreeToComponents(anatomy, Object.keys(prototypes));

        return (
            <div>
                <ul>
                    <li>
                        {prototypeName}
                        {this.renderAnatomyRecursively(processedAnatomy)}
                    </li>
                </ul>
            </div>
        );
    }
}
