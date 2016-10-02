import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {redux} from '../../Redux/index';

function* pathChanged(action) {
    window.location.hash = action.payload;
}

function* historySaga() {
    let path = '';

    if (window.location.hash && window.location.hash !== '#') {
        path = window.location.hash.substring(1);
    }

    // initially restore the previous path
    yield put(redux.Styleguide.actions.setPath(path))

    // register for all path actions to persist the path
    yield* takeEvery(redux.Styleguide.actionTypes.SET_PATH, pathChanged);
}

export default historySaga;
