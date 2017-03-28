import {createAction} from 'redux-actions';

const SET_PATH = '@sitegeist/monocle-ui/Styleguide/SET_PATH';
const SET_PROTOTYPES = '@sitegeist/monocle-ui/Styleguide/SET_PROTOTYPES';
const SET_RESOURCES = '@sitegeist/monocle-ui/Styleguide/SET_RESOURCES';
const SET_RENDER_PROTOTYPES_ENDPOINT = '@sitegeist/monocle-ui/Styleguide/SET_RENDER_PROTOTYPES_ENDPOINT';
const SET_IFRAME_URI = '@sitegeist/monocle-ui/Styleguide/SET_IFRAME_URI';
const SET_PREVIEW_URI = '@sitegeist/monocle-ui/Styleguide/SET_PREVIEW_URI';
const SET_FULLSCREEN_URI = '@sitegeist/monocle-ui/Styleguide/SET_FULLSCREEN_URI';
const SET_GLOBAL_ERROR = '@sitegeist/monocle-ui/Styleguide/SET_GLOBAL_ERROR';


const actionTypes =  {
    SET_PATH,
    SET_PROTOTYPES,
    SET_RESOURCES,
    SET_RENDER_PROTOTYPES_ENDPOINT,
	SET_IFRAME_URI,
	SET_PREVIEW_URI,
    SET_FULLSCREEN_URI,
    SET_GLOBAL_ERROR
};

const setPath = createAction(SET_PATH, path => path);
const setPrototypes = createAction(SET_PROTOTYPES, prototypes => prototypes);
const setResources = createAction(SET_RESOURCES, resources => resources);
const setRenderPrototypesEndpoint = createAction(SET_RENDER_PROTOTYPES_ENDPOINT, prototypes => prototypes);
const setIframeUri = createAction(SET_IFRAME_URI, uri => uri);
const setPreviewUri = createAction(SET_PREVIEW_URI, uri => uri);
const setFullscreenUri = createAction(SET_FULLSCREEN_URI, uri => uri);
const setGlobalError = createAction(SET_GLOBAL_ERROR, err => err);

const actions = {
    setPath,
    setPrototypes,
    setResources,
    setRenderPrototypesEndpoint,
	setIframeUri,
	setPreviewUri,
    setFullscreenUri,
    setGlobalError
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case SET_PATH:
			return state.setIn(['path'], action.payload);
        case SET_PROTOTYPES:
            return state.setIn(['prototypes'], (typeof  action.payload === 'object') ? action.payload : {});
        case SET_RESOURCES:
            return state.setIn(['resources'], action.payload);
        case SET_RENDER_PROTOTYPES_ENDPOINT:
            return state.setIn(['renderPrototypesEndpoint'], action.payload);
        case SET_IFRAME_URI:
            return state.setIn(['iframeUri'], action.payload);
        case SET_PREVIEW_URI:
            return state.setIn(['previewUri'], action.payload);
        case SET_FULLSCREEN_URI:
            return state.setIn(['fullscreenUri'], action.payload);
        case SET_GLOBAL_ERROR:
            return state.setIn(['globalError'], action.payload);
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
