import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

export default class Icon extends Component {
	static propTypes = {
		type: PropTypes.string,
		className: PropTypes.string
	};

	render() {
		const {type, className} = this.props;
		const classNames = mergeClassNames({
			[`icon-${type}`]: true,
			[className]: true
		});

		return (<i className={classNames}></i>);
	}
}
