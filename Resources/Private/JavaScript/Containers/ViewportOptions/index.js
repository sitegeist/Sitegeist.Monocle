import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import {DropDown} from 'Components/index';


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
        const presetOptions = [{key:null, label:'--'}];
        for (var key in availablePresets) {
            if (availablePresets.hasOwnProperty(key)) {
                presetOptions.push({key: key, label: availablePresets[key]['label']});
            }
        }
        // active label
        const presetLabel = (activePreset && availablePresets[activePreset]) ? availablePresets[activePreset]['label'] : '--';

        return (
            <div>
               <DropDown label={presetLabel} items={presetOptions} onSelectItem={setActivePreset}/>
            </div>
        );
    }
}
