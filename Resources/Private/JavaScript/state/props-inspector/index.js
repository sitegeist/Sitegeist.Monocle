import {createAction} from 'redux-actions';
import {$get, $toggle} from 'plow-js';

export const actions = {};

actions.toggle = createAction(
    '@sitegeist/monocle/props-inspector/toggle'
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.toggle.toString():
            return $toggle('propsInspector.isOpen', state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.isOpen = $get('propsInspector.isOpen');

export const sagas = {};
