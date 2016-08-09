import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';

import styles from './style.css';

@connect(state => {
	return {
        prototypes: state.styleguide.prototypes,
        showRenderedElements: state.displayOptions.renderedElements,
        showSourceCode: state.displayOptions.sourceCode,
        showDescription : state.displayOptions.description,
	};
})
export default class PrototypeDisplay extends Component {
	static propTypes = {
        prototype: PropTypes.string,
        prototypes: PropTypes.object,
        showRenderedElements: PropTypes.bool.isRequired,
        showSourceCode: PropTypes.bool.isRequired,
        showDescription: PropTypes.bool.isRequired,
	};

    render() {
        const {
            prototype,
            prototypes,
            showRenderedElements,
            showSourceCode,
            showDescription
        } = this.props;

        const currentPrototype = (prototypes[prototype]) ? prototypes[prototype] : null;

        if (currentPrototype !== null) {
            return <div className={styles.prototype}>
                <h1 className={styles.headline}>{currentPrototype['title']} - prototype({prototype})</h1>
                { showRenderedElements ? <p>Rendered item</p> : '' }
                { showSourceCode ? <p>Item Source</p> : '' }
                { showDescription ? <p>{currentPrototype['description'] ? currentPrototype['description']  : 'no description found'}</p> : '' }
            </div>;
        } else {
            return <div>Prototype "{prototype}" was not found</div>;
        }
    }
}
