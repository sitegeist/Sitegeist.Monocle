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

    getPathItems(path) {
        const {prototypes} = this.props;
        const level = path ? path.split('.').length : 0;
        const items = prototypes
            .filter(prototype => (path ? prototype.path.startsWith( path + '.') : true))
            .map(prototype => prototype.path.split('.').slice(0, level + 1).join('.'))
            .filter((path, index, pathes) => (pathes.indexOf(path) == index))
            .map(path => {
                const segment = path.split('.').pop();
                return {
                    value: path,
                    label: segment.charAt(0).toUpperCase() + segment.slice(1)
                }
            });
        return items;
    }

	render() {
        const {path, setPath} = this.props;
        const pathSegments = path.split('.');
        const rootline = pathSegments.map((segment, level, segments) => {
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);
            const path = segments.slice(0, level).join('.');
            return {
                key: level,
                title: segment.charAt(0).toUpperCase() + segment.slice(1),
                items: this.getPathItems(path)
            };
        });

        const children = this.getPathItems(path);

        return <div className={styles.navigation}>
            {rootline.map(level => (
                <div key={level.key} className={styles.item}>
                    <SelectBox
                        theme={selectBoxTheme}
                        options={level.items}
                        placeholder={level.title}
                        placeholderIcon=""
                        onSelect={setPath}
                    />
                </div>
            ))}

            <div key={path} className={styles.item}>
                 <SelectBox theme={selectBoxTheme} options={children} onSelect={setPath} />
            </div>

		</div>;
	}
}
