import {createAction} from 'redux-actions';
import {$get, $set, $toggle} from 'plow-js';

export const actions = {};

actions.show = createAction('@sitegeist/monocle/grid/show');

actions.hide = createAction('@sitegeist/monocle/grid/hide');

actions.toggle = createAction('@sitegeist/monocle/grid/toggle');

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.show.toString():
            return $set('grid.isVisible', true, state);

        case actions.hide.toString():
            return $set('grid.isVisible', false, state);

        case actions.toggle.toString():
            return $toggle('grid.isVisible', state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.isVisible = $get('grid.isVisible');

export const sagas = {};
