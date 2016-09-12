import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import SelectBox from '@neos-project/react-ui-components/lib/SelectBox';

@connect(state => {
    return {
        activePreset: state.viewportOptions.activePreset,
        availablePresets: state.viewportOptions.availablePresets
    };
}, {
    setActivePreset: redux.ViewportOptions.actions.setActivePreset
})
export default class ViewportOptions extends Component {
    static propTypes = {
        activePreset: PropTypes.string,
        availablePresets: PropTypes.object.isRequired,
        setActivePreset:  PropTypes.func.isRequired,
    };

    render() {

        const {
            activePreset,
            availablePresets,
            setActivePreset
        } = this.props;

        // available items
        const options = [{value: null, label: 'fullscreen'}];
        for (var key in availablePresets) {
            if (availablePresets.hasOwnProperty(key)) {
                options.push({value: key, label: availablePresets[key]['label']});
            }
        }

        // active label
        const presetLabel = (activePreset && availablePresets[activePreset]) ? availablePresets[activePreset]['label'] : 'fullscreen';

        return (
            <div>
                <SelectBox
                    options={options}
                    placeholder={presetLabel}
                    placeholderIcon=""
                    onSelect={setActivePreset}
                />
            </div>
        );
    }
}
