import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import styles from './style.css';

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
            [styles.button]: true,
            [className]: true,
            ['neos-active']: active
        });

		return <button onClick={() => onClick()} className={classNames}>
			{children}
		</button>;
	}
}
