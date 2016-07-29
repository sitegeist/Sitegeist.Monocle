import React, {Component, PropTypes} from 'react';

import Icon from 'Components/Icon/index';
import Button from 'Components/Button/index';

export default class IconButton extends Component {
	static propTypes = {
		type: PropTypes.string,
		className: PropTypes.string,
		onClick: PropTypes.func
	};

	render() {
		const {type, className, onClick} = this.props;

		return <Button className={className} onClick={() => onClick()}>
			<Icon type={type} />
		</Button>;
	}
}
