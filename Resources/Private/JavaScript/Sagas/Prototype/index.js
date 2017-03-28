import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* boot(action) {
    if (action.payload && action.payload.prototypesEndpoint) {
        const json = yield fetch(action.payload.prototypesEndpoint, {
    		method: 'POST',
            credentials: 'same-origin'
    	})
        .then(response => {
            if (!response.ok) {
                return response.text();
            }
            return response.json()
        });

        if (typeof json === 'string') {
            yield put(redux.Styleguide.actions.setGlobalError(json));
        } else {
            yield put(redux.Styleguide.actions.setPrototypes(json));
        }
    }
}

function* prototypeSaga() {
    yield* takeEvery(redux.actionTypes.BOOT, boot);
}

export default prototypeSaga;
