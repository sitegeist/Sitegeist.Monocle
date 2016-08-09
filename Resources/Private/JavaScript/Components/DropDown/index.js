import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

import Button from 'Components/Button/index';
import Icon from 'Components/Icon/index';

import style from './style.css';

@enhanceWithClickOutside
export default class DropDown extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		items: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired
			})
		),

		onSelectItem: PropTypes.func
	};

	state = {
		isOpen: false
	};

	toggle() {
		const {isOpen} = this.state;

		this.setState({isOpen: !isOpen});
	}

	handleClickOutside() {
        this.close();
    }

    close() {
        this.setState({isOpen: false});
    }

	render() {
		const {label, items, onSelectItem} = this.props;
		const {isOpen} = this.state;
        const classNames = mergeClassNames({
			[style.dropDownContainer]: true,
			'neos-open': isOpen
		});

		return (<div className={classNames}>
			<Button onClick={() => this.toggle()}>
				{label}
				<Icon type="angle-down" />
			</Button>

			<ul className="neos-dropdown-menu">
				{items.map(item => (
					<li key={item.key}>
						<a href="javascript:void();" onClick={() => onSelectItem && onSelectItem(item.key) && this.close()}>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</div>);
	}
}
