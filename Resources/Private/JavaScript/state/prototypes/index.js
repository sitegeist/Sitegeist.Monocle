import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $all, $override} from 'plow-js';
import {take, select, put, call} from 'redux-saga/effects';
import url from 'build-url';

import {sagas as business} from '../business';
import {selectors as sites} from '../sites';
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

actions.setCurrentHtml = createAction(
    '@sitegeist/monocle/prototypes/setCurrentHtml',
    currentlyRenderedHtml => currentlyRenderedHtml
);

actions.ready = createAction(
    '@sitegeist/monocle/prototypes/ready'
);

actions.reload = createAction(
    '@sitegeist/monocle/prototypes/reload'
);

actions.overrideProp = createAction(
    '@sitegeist/monocle/prototypes/overrideProp',
    (name, value) => ({name, value})
);

actions.selectPropSet = createAction(
    '@sitegeist/monocle/prototypes/selectPropSet',
    name => name
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.add.toString():
            return $override('prototypes.byName', action.payload, state);

        case actions.clear.toString():
            return $all(
                $set('prototypes.byName', {}),
                $set('prototypes.overriddenProps', {}),
                $set('prototypes.selectedPropSet', ''),
                state
            );

        case actions.select.toString():
            if (!$get(['prototypes', 'byName', action.payload], state)) {
                throw new Error(`Prototype "${action.payload}" does not exists and cannot be selected.`);
            }

            return $all(
                $set('prototypes.currentlySelected', action.payload),
                $set('prototypes.overriddenProps', {}),
                $set('prototypes.selectedPropSet', ''),
                state
            );

        case actions.setCurrentlyRendered.toString():
            return $set('prototypes.currentlyRendered', action.payload, state);

        case actions.setCurrentHtml.toString():
            return $set('prototypes.currentHtml', action.payload, state);

        case actions.overrideProp.toString():
            return $set(['prototypes', 'overriddenProps', action.payload.name], action.payload.value, state);

        case actions.selectPropSet.toString():
            return $set('prototypes.selectedPropSet', action.payload, state);

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

selectors.currentHtml = $get('prototypes.currentHtml');

selectors.overriddenProps = $get('prototypes.overriddenProps');

selectors.selectedPropSet = state => $get('prototypes.selectedPropSet', state) || '__default';

export const sagas = {};

sagas.load = business.operation(function * () {
    yield put(actions.clear());
    yield put(actions.setCurrentlyRendered(null));

    const prototypesEndpoint = yield select($get('env.prototypesEndpoint'));
    const sitePackageKey = yield select(sites.currentlySelectedSitePackageKey);
    const prototypes = yield business.authenticated(
        url(prototypesEndpoint, {
            queryParams: {sitePackageKey}
        })
    );

    yield put(actions.add(prototypes));
});

sagas.renderPrototypeOnSelect = function * () {
    while (true) { // eslint-disable-line
        const currentlyRenderedPrototype = (yield select(selectors.currentlyRendered));
        const prototypeName = (yield take(actions.select)).payload;

        if (currentlyRenderedPrototype && prototypeName === currentlyRenderedPrototype.prototypeName && iframeWindow()) {
            iframeWindow().location.reload();
        } else {
            yield call(
                business.operation(function * () {
                    const renderPrototypesEndpoint = yield select($get('env.renderPrototypesEndpoint'));
                    const sitePackageKey = yield select(sites.currentlySelectedSitePackageKey);
                    const renderedPrototype = yield business.authenticated(
                        url(renderPrototypesEndpoint, {
                            queryParams: {prototypeName, sitePackageKey}
                        })
                    );

                    yield put(actions.setCurrentlyRendered(renderedPrototype));
                    yield take(actions.ready);
                })
            );
        }
    }
};

sagas.reloadIframe = function * () {
    while (true) { // eslint-disable-line
        yield take(actions.reload);

        iframeWindow().location.reload();
    }
};
