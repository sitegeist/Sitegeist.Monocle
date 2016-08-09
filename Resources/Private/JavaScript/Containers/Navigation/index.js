import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import {DropDown} from 'Components/index';

import styles from './style.css';

@connect(state => {
    return {
        path: state.styleguide.path,
        prototypes: state.styleguide.prototypes
    };
},{
    setPath: redux.Styleguide.actions.setPath
})
export default class Navigation extends Component {
    static propTypes = {
        path: PropTypes.string,
        prototypes: PropTypes.object,
        setPath: PropTypes.func.isRequired
    };

	render() {
        const {path, prototypes, setPath} = this.props;

        // build the levels of the styeguide navigation
        // @todo refactor this in a fuctional manner
        const pathSegments = path.split('.');

        const levels = [];
        for (let index = 0; index <= pathSegments.length; index ++) {
            const subpath = pathSegments.slice(0,index).join('.');
            const currentLevel = pathSegments[index];
            const items = [];
            const assignedKeys = [];
            for (var key in prototypes) {
                if (prototypes.hasOwnProperty(key)) {
                    const prototype = prototypes[key];
                    if (prototype['path'].startsWith(subpath)) {
                        const prototypePathSegments = prototype['path'].split('.')
                        const nextLevel =  prototypePathSegments[index];
                        if (nextLevel && assignedKeys.indexOf(nextLevel) == -1){
                            items.push({
                                key:  prototypePathSegments.slice(0,index + 1).join('.'),
                                label: nextLevel
                            });
                            assignedKeys.push(nextLevel);
                        }
                    }
                }
            }
            if (items.length > 0) {
                items.unshift({
                    key:  subpath,
                    label: '--'
                });
                levels.push({
                    key: currentLevel,
                    items: items
                })
            };
        }

        return <div className={styles.navigation}>
            {levels.map(level => (
                <div className={styles.item}>
                    <DropDown label={level['key']} items={level['items']} onSelectItem={setPath} />
                </div>
            ))}
		</div>;
	}
}
