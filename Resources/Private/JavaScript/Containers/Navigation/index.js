import React, {Component, PropTypes} from 'react';

import {DropDown} from 'Components/index';

import styles from './style.css';

export default class Navigation extends Component {
	render() {
		return (<div className={styles.navigation}>
			<DropDown label="Atoms" items={[
				{key: 'something', label: 'Yeah'},
				{key: 'else', label: 'Noe'}
			]} />
		</div>);
	}
}
