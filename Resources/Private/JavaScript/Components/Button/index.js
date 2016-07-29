import React, {Component, PropTypes} from 'react';

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		onClick: PropTypes.func
	};

	render() {
		const {children, className, onClick} = this.props;

		return <button onClick={() => onClick()} className={className}>
			{children}
		</button>;
	}
}
