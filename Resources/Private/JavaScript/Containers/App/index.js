import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import {redux} from 'Redux/index';

export default class App extends Component {
	static propTypes = {
        children: PropTypes.node.isRequired
	};

    render() {
        const {children} = this.props;

        return <div>
            {children}
        </div>;
    }
}
