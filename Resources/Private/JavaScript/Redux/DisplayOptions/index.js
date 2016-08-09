import {createAction} from 'redux-actions';

const TOGGLE_RENDERED_ELEMENTS = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_RENDERED_ELEMENTS';
const TOGGLE_SOURCE_CODE = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_SOURCE_CODE';
const TOGGLE_DESCRIPTION = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_DESCRIPTION';
const TOGGLE_FULLSCREEN = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_FULLSCREEN';

const actionTypes =  {
	TOGGLE_RENDERED_ELEMENTS,
	TOGGLE_SOURCE_CODE,
	TOGGLE_DESCRIPTION,
	TOGGLE_FULLSCREEN
};

const toggleRenderedElements = createAction(TOGGLE_RENDERED_ELEMENTS);
const toggleSourceCode = createAction(TOGGLE_SOURCE_CODE);
const toggleDescription = createAction(TOGGLE_DESCRIPTION);
const toggleFullscreen = createAction(TOGGLE_FULLSCREEN);

const actions = {
	toggleRenderedElements,
	toggleSourceCode,
	toggleDescription,
	toggleFullscreen
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case TOGGLE_RENDERED_ELEMENTS:
			const renderedElements = state.renderedElements;
			return state.setIn(['renderedElements'], !renderedElements);

		case TOGGLE_SOURCE_CODE:
			const sourceCode = state.sourceCode;
			return state.setIn(['sourceCode'], !sourceCode);

		case TOGGLE_DESCRIPTION:
			const description = state.description;
			return state.setIn(['description'], !description);

		case TOGGLE_FULLSCREEN:
			const fullscreen = state.fullscreen;
			return state.setIn(['fullscreen'], !fullscreen);
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
