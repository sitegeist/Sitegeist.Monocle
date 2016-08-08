import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		onClick: PropTypes.func,
        active: PropTypes.bool
	};

	render() {
		const {children, className, onClick, active} = this.props;

        const classNames = mergeClassNames({
            ['neos-active']: active,
            [className]: true
        });


		return <button onClick={() => onClick()} className={classNames}>
			{children}
		</button>;
	}
}
