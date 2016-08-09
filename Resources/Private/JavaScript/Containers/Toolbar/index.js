import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';
import {IconButton} from 'Components/index';
import {Navigation, ViewportOptions, DisplayOptions} from 'Containers/index';

export default class Toolbar extends Component {
	render() {
		return (
		    <div className="neos-header" >
                <Navigation />

                <div className="neos-pull-right" >
                    <DisplayOptions />
                </div>

                <div className="neos-pull-right" >
                    <ViewportOptions />
                </div>

			</div>
        );
	}
}
