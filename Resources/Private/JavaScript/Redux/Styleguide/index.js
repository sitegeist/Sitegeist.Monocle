import {createAction} from 'redux-actions';

const SET_PATH = '@sitegeist/monocle-ui/Styleguide/SET_PATH';
const SET_PROTOTYPES = '@sitegeist/monocle-ui/Styleguide/SET_PROTOTYPES';


const actionTypes =  {
    SET_PATH,
    SET_PROTOTYPES
};

const setPath = createAction(SET_PATH, path => path);
const setPrototypes = createAction(SET_PROTOTYPES, prototypes => prototypes);

const actions = {
    setPath,
    setPrototypes
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case SET_PATH:
			return state.setIn(['path'], action.payload);
        case SET_PROTOTYPES:
            return state.setIn(['prototypes'], action.payload);
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
