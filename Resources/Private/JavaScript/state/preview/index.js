import {createAction} from 'redux-actions';
import {$get, $set} from 'plow-js';

export const actions = {};

actions.set = createAction(
    '@sitegeist/monocle/preview/set',
    ({sourceQuerySelector}) => ({sourceQuerySelector})
);

actions.clear = createAction(
    '@sitegeist/monocle/preview/clear'
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.set.toString():
            return $set('preview', action.payload, state);

        case actions.clear.toString():
            return $set('preview', {}, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.sourceQuerySelector = $get('preview.sourceQuerySelector');
selectors.defaultPrototypeName = $get('preview.defaultPrototypeName');
