import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* boot(action) {
    if (action.payload && action.payload.viewportPresetsEndpoint) {
        const json = yield fetch(action.payload.viewportPresetsEndpoint, {
    		method: 'POST',
            credentials: 'same-origin'
    	})
        .then(response => response.json());
        yield put(redux.ViewportOptions.actions.setAvailablePresets(json));
    }
}

function* viewportPresetsSaga() {
    yield* takeEvery(redux.actionTypes.BOOT, boot);
}

export default viewportPresetsSaga;
