import {createAction} from 'redux-actions';

const SET_ACTIVE_BREAKPOINT = '@sitegeist/monocle-ui/Breakpoints/SET_ACTIVE_BREAKPOINT';
const SET_AVAILABLE_BREAKPOINTS = '@sitegeist/monocle-ui/Breakpoints/SET_AVAILABLE_BREAKPOINTS';


const actionTypes =  {
    SET_ACTIVE_BREAKPOINT,
    SET_AVAILABLE_BREAKPOINTS
};

const setActiveBreakpoint = createAction(SET_ACTIVE_BREAKPOINT, activeBreakpoint => activeBreakpoint);
const setAvailableBreakpoints = createAction(SET_AVAILABLE_BREAKPOINTS, availableBreakpoints => availableBreakpoints);

const actions = {
    setActiveBreakpoint,
    setAvailableBreakpoints
};

const reducer = (state, action) => {
	switch(action.type)	{
		case SET_ACTIVE_BREAKPOINT:
			return state.setIn(['breakpoints', 'active'], action.payload);
        case SET_AVAILABLE_BREAKPOINTS:
            console.log ([state, action]);
            return state.setIn(['breakpoints', 'available'], action.payload);
	}

	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
