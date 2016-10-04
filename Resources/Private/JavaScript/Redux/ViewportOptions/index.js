import {createAction} from 'redux-actions';

const SET_ACTIVE_PRESET = '@sitegeist/monocle-ui/ViewportOptions/SET_ACTIVE_PRESET';
const SET_WIDTH = '@sitegeist/monocle-ui/ViewportOptions/SET_ACTIVE_WIDTH';
const SET_AVAILABLE_PRESETS = '@sitegeist/monocle-ui/ViewportOptions/SET_AVAILABLE_PRESETS';


const actionTypes =  {
    SET_WIDTH,
    SET_ACTIVE_PRESET,
    SET_AVAILABLE_PRESETS
};

const setWidth = createAction(SET_WIDTH, width => width);
const setActivePreset = createAction(SET_ACTIVE_PRESET, activePreset => activePreset);
const setAvailablePresets = createAction(SET_AVAILABLE_PRESETS, availablePresets => availablePresets);

const actions = {
    setWidth,
    setActivePreset,
    setAvailablePresets
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
        case SET_WIDTH:
            return state.setIn(['width'], action.payload).setIn(['activePreset'], null);

        case SET_ACTIVE_PRESET:
            const presetName = action.payload;
            const preset = state.availablePresets[presetName];
            let new_state = state.setIn(['activePreset'], action.payload);
            if (preset && preset.width ) {
                new_state = new_state.setIn(['width'], preset.width);
            } else {
                new_state = new_state.setIn(['width'], undefined);
            }
            return new_state
        case SET_AVAILABLE_PRESETS:
            return state.setIn(['availablePresets'], action.payload);

	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
