import {createAction} from 'redux-actions';

const TOGGLE_RENDERED_ELEMENTS = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_RENDERED_ELEMENTS';
const TOGGLE_SOURCE_CODE = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_SOURCE_CODE';
const TOGGLE_DESCRIPTION = '@sitegeist/monocle-ui/DisplayOptions/TOGGLE_DESCRIPTION';

const actionTypes =  {
	TOGGLE_RENDERED_ELEMENTS,
	TOGGLE_SOURCE_CODE,
	TOGGLE_DESCRIPTION
};

const toggleRenderedElements = createAction(TOGGLE_RENDERED_ELEMENTS);
const toggleSourceCode = createAction(TOGGLE_SOURCE_CODE);
const toggleDescription = createAction(TOGGLE_DESCRIPTION);

const actions = {
	toggleRenderedElements,
	toggleSourceCode,
	toggleDescription
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
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
