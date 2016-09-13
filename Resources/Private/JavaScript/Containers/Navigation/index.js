import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import SelectBox from '@neos-project/react-ui-components/lib/SelectBox';

import styles from './style.css';
import selectBoxTheme from './selectBoxTheme.css';

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
        prototypes: PropTypes.array,
        setPath: PropTypes.func.isRequired
    };

	render() {
        const {path, prototypes, setPath} = this.props;

        // build the levels of the styeguide navigation
        // @todo refactor this in a fuctional manner
        const pathSegments = path.split('.');

        const levels = [];

/**
        const levels2 = pathSegments.map((segment, index) => {

            const levelKey = segment;
            const levelPath = pathSegments.slice(0,index + 1).join('.');
            const levelItems = [{
                key: '',
                value:  levelPath,
                label: '--'
            }];

            // const levelItems = prototypes.filter((prototype,prototypeKey)=>{return 'foo'});

            return {
                key: levelKey,
                value: levelPath,
                items: levelItems
            };
        });
*/

        for (let index = 0; index <= pathSegments.length; index ++) {
            const subpath = pathSegments.slice(0,index).join('.');
            const currentLevel = pathSegments[index];
            const items = [];
            const assignedKeys = [];
            for (let key in prototypes) {
                const prototype = prototypes[key];

                // const prototype = prototypes[key];
                if (prototype['path'].startsWith(subpath)) {
                    const prototypePathSegments = prototype['path'].split('.')
                    const nextLevel =  prototypePathSegments[index];
                    if (nextLevel && assignedKeys.indexOf(nextLevel) == -1){
                        items.push({
                            key: prototype.prototypeName,
                            value:  prototypePathSegments.slice(0,index + 1).join('.'),
                            label: nextLevel
                        });
                        assignedKeys.push(nextLevel);
                    }
                }

            }
            if (items.length > 0) {
                items.unshift({
                    key: '',
                    value:  subpath,
                    label: '--'
                });
                levels.push({
                    key: 'level_' + index,
                    value: currentLevel,
                    items: items
                })
            };
        }

        return <div className={styles.navigation}>
            {levels.map(level => (
                <div key={level.key} className={styles.item}>
                    <SelectBox
                        theme={selectBoxTheme}
                        options={level.items}
                        placeholder={level.value}
                        placeholderIcon=""
                        onSelect={setPath}
                    />
                </div>
            ))}
		</div>;
	}
}
