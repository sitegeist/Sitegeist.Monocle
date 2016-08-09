import {createAction} from 'redux-actions';

const SET_PATH = '@sitegeist/monocle-ui/Styleguide/SET_PATH';
const SET_PROTOTYPES = '@sitegeist/monocle-ui/Styleguide/SET_PROTOTYPES';
const SET_RENDER_PROTOTYPES_ENDPOINT = '@sitegeist/monocle-ui/Styleguide/SET_RENDER_PROTOTYPES_ENDPOINT';


const actionTypes =  {
    SET_PATH,
    SET_PROTOTYPES,
    SET_RENDER_PROTOTYPES_ENDPOINT
};

const setPath = createAction(SET_PATH, path => path);
const setPrototypes = createAction(SET_PROTOTYPES, prototypes => prototypes);
const setRenderPrototypesEndpoint = createAction(SET_RENDER_PROTOTYPES_ENDPOINT, prototypes => prototypes);

const actions = {
    setPath,
    setPrototypes,
    setRenderPrototypesEndpoint
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case SET_PATH:
			return state.setIn(['path'], action.payload);
        case SET_PROTOTYPES:
            return state.setIn(['prototypes'], action.payload);
        case SET_RENDER_PROTOTYPES_ENDPOINT:
            return state.setIn(['renderPrototypesEndpoint'], action.payload);
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
