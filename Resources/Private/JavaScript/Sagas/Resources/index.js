import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* boot(action) {
    if (action.payload && action.payload.resourcesEndpoint) {
        const json = yield fetch(action.payload.resourcesEndpoint, {
    		method: 'POST',
            credentials: 'same-origin'
    	})
        .then(response => response.json());
        yield put(redux.Styleguide.actions.setResources(json));
    }
}

function* resourcesSaga() {
    yield* takeEvery(redux.actionTypes.BOOT, boot);
}

export default resourcesSaga;
