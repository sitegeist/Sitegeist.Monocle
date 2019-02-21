import {createAction} from 'redux-actions';
import {$get, $set} from 'plow-js';

export const actions = {};

actions.set = createAction(
    '@sitegeist/monocle/hotkeys/set',
    hotkeys => hotkeys
);

actions.clear = createAction(
    '@sitegeist/monocle/hotkeys/clear'
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.set.toString():
            return $set('hotkeys', action.payload, state);

        case actions.clear.toString():
            return $set('hotkeys', {}, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('hotkeys');
