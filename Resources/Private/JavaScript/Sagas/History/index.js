import { takeEvery, takeLatest } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import { redux } from '../../Redux/index';

function* historySaga() {

    yield take(redux.actionTypes.BOOT);

    if (window.location.hash && window.location.hash !== '#') {
        yield put(redux.Styleguide.actions.setPath(window.location.hash.substring(1)));
    } else if (action.payload && action.payload.defaultPath) {
        yield put(redux.Styleguide.actions.setPath(action.payload.defaultPath));
    }

    while (true) {
        const action = yield take(redux.Styleguide.actionTypes.SET_PATH);
        window.location.hash = action.payload;
    }
}

export default historySaga;
