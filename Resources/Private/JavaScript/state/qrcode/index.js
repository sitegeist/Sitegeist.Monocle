import {createAction} from 'redux-actions';
import {$get, $set, $toggle} from 'plow-js';

export const actions = {};

actions.show = createAction('@sitegeist/monocle/qrcode/show');

actions.hide = createAction('@sitegeist/monocle/qrcode/hide');

actions.toggle = createAction('@sitegeist/monocle/qrcode/toggle');

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.show.toString():
            return $set('qrcode.isVisible', true, state);

        case actions.hide.toString():
            return $set('qrcode.isVisible', false, state);

        case actions.toggle.toString():
            return $toggle('qrcode.isVisible', state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.isVisible = $get('qrcode.isVisible');

export const sagas = {};
