import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions} from 'state';

import AnatomyItem from './anatomy-item';

const reduceAnatomicalTreeToComponents = (anatomy, prototypeNames) => {
    if (anatomy.prototypeName && prototypeNames.includes(anatomy.prototypeName)) {
        return [{
            prototypeName: anatomy.prototypeName,
            children: reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames)
        }];
    } else if (anatomy.children) {
        return reduceAnatomicalTreeToComponents(anatomy.children, prototypeNames);
    }

    return anatomy.flatMap(a => reduceAnatomicalTreeToComponents(a, prototypeNames));
};

@connect(() => ({}), {
    select: actions.prototypes.select
})
export default class Anatomy extends PureComponent {
    static propTypes = {
        select: PropTypes.func.isRequired,
        anatomy: PropTypes.array.isRequired,
        prototypes: PropTypes.object.isRequired,
        prototypeName: PropTypes.string.isRequired
    };

    handleSelectPrototype = prototypeName => {
        const {select} = this.props;

        select(prototypeName);
    };

    render() {
        const {anatomy, prototypes, prototypeName} = this.props;
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
