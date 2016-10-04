import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* boot(action) {
    if (window.location.hash && window.location.hash !== '#') {
        yield put(redux.Styleguide.actions.setPath(window.location.hash.substring(1)))
    } else if (action.payload && action.payload.defaultPath) {
        yield put(redux.Styleguide.actions.setPath(action.payload.defaultPath))
    }
}

function* pathChanged(action) {
    window.location.hash = action.payload;
}

function* historySaga() {
    yield* takeEvery(redux.actionTypes.BOOT, boot);
    yield* takeEvery(redux.Styleguide.actionTypes.SET_PATH, pathChanged);
}

export default historySaga;
