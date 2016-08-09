import {createAction} from 'redux-actions';

const SET_ACTIVE_PRESET = '@sitegeist/monocle-ui/Breakpoints/SET_ACTIVE_PRESET';
const SET_AVAILABLE_PRESETS = '@sitegeist/monocle-ui/Breakpoints/SET_AVAILABLE_PRESETS';


const actionTypes =  {
    SET_ACTIVE_PRESET,
    SET_AVAILABLE_PRESETS
};

const setActivePreset = createAction(SET_ACTIVE_PRESET, activePreset => activePreset);
const setAvailablePresets = createAction(SET_AVAILABLE_PRESETS, availablePresets => availablePresets);

const actions = {
    setActivePreset,
    setAvailablePresets
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case SET_ACTIVE_PRESET:
			return state.setIn(['activePreset'], action.payload);
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
