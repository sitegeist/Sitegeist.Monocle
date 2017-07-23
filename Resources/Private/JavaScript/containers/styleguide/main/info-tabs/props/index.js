import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {actions, selectors} from 'state';

import PropsItem from './props-item';

@connect(state => {
    return {
        overriddenProps: selectors.prototypes.overriddenProps(state)
    }
}, {
    overrideProp: actions.prototypes.overrideProp
})
export default class Props extends PureComponent {
    handleChange = (name, value) => {
        const {overrideProp} = this.props;

        overrideProp(name, value);
    };

    render() {
        const {fusionAst, overriddenProps} = this.props;
        const {props} = fusionAst.__meta.styleguide;

        return (
            <div>
                {props && Object.keys(props).filter(name => typeof props[name] === 'string').map(name => (
                    <PropsItem
                        key={name}
                        name={name}
                        value={name in overriddenProps ? overriddenProps[name] : props[name]}
                        isLarge={props[name].length > 80}
                        onChange={this.handleChange}
                        />
                ))}
            </div>
        );
    }
}
