import React, {Component, PropTypes} from 'react';

export default class Iframe extends Component {
	static propTypes = {
		src: PropTypes.string,
		className: PropTypes.string
	};

	render() {
		const {src, className} = this.props;
		return (<iframe src={src} className={classNames}></iframe>);
	}
}
