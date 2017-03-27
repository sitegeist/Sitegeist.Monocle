import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';

import {PrototypeDisplay} from 'Containers/index';
import styles from './style.css';

@connect(state => {
	return {
        activePreset: state.viewportOptions.activePreset,
        availablePresets: state.viewportOptions.availablePresets,

        path: state.styleguide.path,
        prototypes: state.styleguide.prototypes,
        globalerror: state.styleguide.globalError
	};
})
export default class PreviewSection extends Component {
	static propTypes = {
        activePreset: PropTypes.string,
        availablePresets: PropTypes.object,
        path: PropTypes.string,
        prototypes: PropTypes.object
	};

	state = {
	    readyCount: 0
    };

	constructor(props) {
	    super(props);
	    this.addReady = this.addReady.bind(this);
    }

    addReady() {
	    this.setState({
	        readyCount: this.state.readyCount + 1
        })
    }

    render() {
        const {activePreset, availablePresets} = this.props;
        const {path, prototypes, globalerror} = this.props;
        const {readyCount} = this.state;
        const addReady = this.addReady;

        const width = (availablePresets[activePreset]) ? availablePresets[activePreset]['width'] : '';
        const label = (availablePresets[activePreset]) ? availablePresets[activePreset]['label'] : '';

        const displayPrototypes = [];
        for (const prototypeName in prototypes) {
            if (prototypes.hasOwnProperty(prototypeName) && prototypes[prototypeName].path.startsWith(path)) {
                displayPrototypes.push(prototypeName);
            }
        }

        return <div className={styles.previewSection}>
            {!!globalerror && <div style={{marginTop: '40px'}} dangerouslySetInnerHTML={{__html: globalerror}} />}
            {displayPrototypes.map((item, key) => (
                <PrototypeDisplay key={item} prototypeName={item} ready={addReady} visible={key <= readyCount}/>
            ))}
        </div>;
    }
}
