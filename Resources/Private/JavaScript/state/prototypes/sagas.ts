import { take, select, put } from "redux-saga/effects";
import buildUrl from "build-url";

import { State } from "..";

import * as business from "../business";
import * as sites from "../sites";
import { iframeWindow } from "../../dom";

import * as actions from "./actions";
import * as selectors from "./selectors";

export function* renderPrototypeOnSelect() {
    while (true) { // eslint-disable-line
        const currentlyRenderedPrototype = (
            yield select(selectors.currentlyRendered)
        ) as ReturnType<typeof selectors.currentlyRendered>;
        const prototypeName = (yield take(actions.select)).payload;

        if (currentlyRenderedPrototype && prototypeName === currentlyRenderedPrototype.prototypeName) {
            iframeWindow()?.location.reload();
        } else {
            yield put(actions.setCurrentlyRenderedPrototypeName(prototypeName));
            yield* business.sagas.operation(function * () {
                const renderPrototypesEndpoint = (
                    yield select(
                        (state: State) => state.env.prototypeDetailsEndpoint
                    )
                ) as string;
                const sitePackageKey = (
                    yield select(sites.selectors.currentlySelectedSitePackageKey)
                ) as ReturnType<typeof sites.selectors.currentlySelectedSitePackageKey>;
                const renderedPrototype = yield business.sagas.authenticated(
                    buildUrl(renderPrototypesEndpoint, {
                        queryParams: {sitePackageKey, prototypeName}
                    })
                );

                yield put(actions.setCurrentlyRendered(renderedPrototype));
                yield take(actions.ready);
            });
        }
    }
}

export function* reloadIframe() {
    while (true) { // eslint-disable-line
        yield take(actions.reload);

        iframeWindow()?.location.reload();
    }
}
