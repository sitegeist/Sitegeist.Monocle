import {$get} from 'plow-js';
import {select, put, call, fork, take} from 'redux-saga/effects';
import url from 'build-url';

import * as prototypes from './prototypes';
import * as breakpoints from './breakpoints';
import * as locales from './locales';
import * as sites from './sites';
import * as business from './business';
import * as navigation from './navigation';
import * as hotkeys from './hotkeys';
import * as preview from './preview';
import * as propsInspector from './props-inspector';
import * as routing from './routing';
import * as qrcode from './qrcode';

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    locales: locales.actions,
    sites: sites.actions,
    business: business.actions,
    navigation: navigation.actions,
    hotkeys: hotkeys.actions,
    preview: preview.actions,
    propsInspector: propsInspector.actions,
    routing: routing.actions,
    qrcode: qrcode.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    breakpoints.reducer,
    locales.reducer,
    sites.reducer,
    business.reducer,
    navigation.reducer,
    hotkeys.reducer,
    preview.reducer,
    propsInspector.reducer,
    qrcode.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    locales: locales.selectors,
    sites: sites.selectors,
    business: business.selectors,
    navigation: navigation.selectors,
    hotkeys: hotkeys.selectors,
    preview: preview.selectors,
    propsInspector: propsInspector.selectors,
    qrcode: qrcode.selectors
};

const loadConfiguration = function* loadConfiguration() {
    const moduleUri = yield select($get('env.moduleUri'));
    const routePath = window.location.pathname === moduleUri ? '' : window.location.pathname.substring(moduleUri.length + 1);
    let [routePrototypeName] = routePath.split('/');

    while (true) { // eslint-disable-line
        yield take(actions.sites.select);
        yield call(business.sagas.operation(function* () { // eslint-disable-line
            const sitePackageKey = yield select(selectors.sites.currentlySelectedSitePackageKey);
            const configurationEndpoint = yield select($get('env.configurationEndpoint'));

            yield put(actions.prototypes.clear());
            yield put(actions.prototypes.setCurrentlyRendered(null));

            const configuration = yield business.sagas.authenticated(
                url(configurationEndpoint, {
                    queryParams: {sitePackageKey}
                })
            );

            yield put(actions.sites.set(configuration.ui.sitePackages));
            yield put(actions.breakpoints.set(configuration.ui.viewportPresets));
            yield put(actions.locales.set(configuration.ui.localePresets));
            yield put(actions.preview.set(configuration.ui.preview));
            yield put(actions.prototypes.add(configuration.styleguideObjects));

            const listOfPrototypes = yield select(prototypes.selectors.all);

            if (!listOfPrototypes || !Object.keys(listOfPrototypes).length) {
                yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
                    The prototype list is empty. Please check the Root.fusion file in your site package "${sitePackageKey}" and
                    make sure your components are included correctly.
                `));
                return;
            }

            const defaultPrototypeName = yield select(preview.selectors.defaultPrototypeName);
            const prototypeName = routePrototypeName || defaultPrototypeName || Object.keys(listOfPrototypes)[0];

            if (!prototypeName) {
                yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
                    Could not determine default prototypeName. Please make sure to have a defaultPrototypeName configured
                    for your site package.
                `));
                return;
            }

            routePrototypeName = null;

            try {
                yield put.resolve(prototypes.actions.select(prototypeName));
            } catch (err) {
                yield put(business.actions.errorTask('@sitegeist/monocle/bootstrap', `
                    Could not select default Prototype: ${err.message}
                `));
                return;
            }
        }));

        yield put(business.actions.finishTask('@sitegeist/monocle/bootstrap'));
        yield put(business.actions.finishTask('@sitegeist/monocle/switch-site'));
    }
};

export const saga = function * () {
    yield put(business.actions.addTask('@sitegeist/monocle/bootstrap'));

    document.title = 'Monocle: Loading...';

    const moduleUri = yield select($get('env.moduleUri'));
    const routePath = window.location.pathname === moduleUri ? '' : window.location.pathname.substring(moduleUri.length + 1);
    const [routeSitePackageKey] = routePath.split('/');

    const defaultSitePackageKey = yield select($get('env.defaultSitePackageKey'));
    const sitePackageKey = routeSitePackageKey || defaultSitePackageKey;

    //
    // Fork subsequent sagas
    //
    yield fork(routing.sagas.updateHistoryWhenPrototypeChanges);
    yield fork(prototypes.sagas.reloadIframe);
    yield fork(prototypes.sagas.renderPrototypeOnSelect);

    yield fork(loadConfiguration);
    yield put(sites.actions.select(sitePackageKey));

    yield fork(routing.sagas.updateStateOnDirectRouting);
};
