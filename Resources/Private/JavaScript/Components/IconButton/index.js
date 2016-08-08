import React, {Component, PropTypes} from 'react';

import Icon from 'Components/Icon/index';
import Button from 'Components/Button/index';

export default class IconButton extends Component {
	static propTypes = {
		type: PropTypes.string,
		className: PropTypes.string,
		onClick: PropTypes.func,
        active: PropTypes.bool
	};

	render() {
		const {type, className, onClick, active} = this.props;

		return <Button className={className} onClick={() => onClick()} active={active}>
			<Icon type={type} />
		</Button>;
	}
}
