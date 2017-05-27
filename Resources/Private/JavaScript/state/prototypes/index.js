import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $override} from 'plow-js';
import {take, select, put} from 'redux-saga/effects'

import {sagas as business} from '../business';

export const actions = {};

actions.add = createAction(
    '@sitegeist/monocle/prototypes/add',
    listOfPrototypes => listOfPrototypes
);

actions.clear = createAction(
    '@sitegeist/monocle/prototypes/clear'
);

actions.select = createAction(
    '@sitegeist/monocle/prototypes/select',
    prototypeName => prototypeName
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.add.toString():
            return $override('prototypes.byName', action.payload, state);

        case actions.clear.toString():
            return $set('prototypes.byName', {}, state);

        case actions.select.toString():
            return $set('prototypes.currentlySelected', action.payload, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('prototypes.byName');

selectors.byId = (state, prototypeName) =>
    $get(['prototypes', 'byName', prototypeName], state);

selectors.currentlySelected = () => createSelector(
    [
        $get('prototypes.currentlySelected'),
        selectors.all()
    ],
    (currentlySelectedPrototypeName, prototypesByName) =>
        $get(currentlySelectedPrototypeName, prototypesByName)
);

export const sagas = {};

sagas.loadPrototypesOnBootstrap = business.operation(function * () {
    const prototypesEndpoint = yield select($get('env.prototypesEndpoint'));
    const prototypes = yield business.authenticated(prototypesEndpoint);

    yield put(actions.add(prototypes));
});
