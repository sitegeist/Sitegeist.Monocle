import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* boot(action) {
    if (action.payload && action.payload.prototypesEndpoint) {
        const json = yield fetch(action.payload.prototypesEndpoint, {
    		method: 'POST',
            credentials: 'same-origin'
    	})
        .then(response => response.json());
        yield put(redux.SiteOptions.actions.setAvailableSites(json));
    }
}

function* sitesSaga() {
    yield* takeEvery(redux.actionTypes.BOOT, boot);
}

export default sitesSaga;
