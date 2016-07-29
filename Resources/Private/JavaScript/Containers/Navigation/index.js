import React, {Component, PropTypes} from 'react';

import {DropDown} from 'Components/index';

export default class Navigation extends Component {
	render() {
		return (<div>
			<DropDown label="Atoms" items={[
				{key: 'something', label: 'Yeah'},
				{key: 'else', label: 'Noe'}
			]} />
		</div>);
	}
}
