import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $override} from 'plow-js';
import {take, select, put, call} from 'redux-saga/effects';
import url from 'build-url';

import {sagas as business} from '../business';
import {iframeWindow} from 'dom';

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

actions.setCurrentlyRendered = createAction(
    '@sitegeist/monocle/prototypes/setCurrentlyRendered',
    currentlyRenderedPrototype => currentlyRenderedPrototype
);

actions.ready = createAction(
    '@sitegeist/monocle/prototypes/ready'
);

actions.reload = createAction(
    '@sitegeist/monocle/prototypes/reload'
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.add.toString():
            return $override('prototypes.byName', action.payload, state);

        case actions.clear.toString():
            return $set('prototypes.byName', {}, state);

        case actions.select.toString():
            return $set('prototypes.currentlySelected', action.payload, state);

        case actions.setCurrentlyRendered.toString():
            return $set('prototypes.currentlyRendered', action.payload, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('prototypes.byName');

selectors.byId = (state, prototypeName) =>
    $get(['prototypes', 'byName', prototypeName], state);

selectors.currentlySelected = createSelector(
    [
        $get('prototypes.currentlySelected'),
        selectors.all
    ],
    (currentlySelectedPrototypeName, prototypesByName) =>
        prototypesByName && prototypesByName[currentlySelectedPrototypeName]
);

selectors.currentlyRendered = $get('prototypes.currentlyRendered');

export const sagas = {};

sagas.loadPrototypesOnBootstrap = business.operation(function * () {
    document.title = 'Monocle: Loading...';
    const prototypesEndpoint = yield select($get('env.prototypesEndpoint'));
    const prototypes = yield business.authenticated(prototypesEndpoint);

    yield put(actions.add(prototypes));
    yield put(actions.select(Object.keys(prototypes)[0]));
});

sagas.renderPrototypeOnSelect = function * () {
    while (true) { // eslint-disable-line
        const prototypeName = (yield take(actions.select)).payload;

        document.title = 'Monocle: Loading...';
        yield call(
            business.operation(function * () {
                const renderPrototypesEndpoint = yield select($get('env.renderPrototypesEndpoint'));
                const renderedPrototype = yield business.authenticated(
                    url(renderPrototypesEndpoint, {
                        queryParams: {prototypeName}
                    })
                );

                yield put(actions.setCurrentlyRendered(renderedPrototype));

                const {title} = yield select(selectors.currentlySelected);

                document.title = `Monocle: ${title}`;

                yield take(actions.ready);
            })
        );
    }
};

sagas.reloadIframe = function * () {
    while (true) { // eslint-disable-line
        yield take(actions.reload);
        iframeWindow().location.reload();
    }
};
