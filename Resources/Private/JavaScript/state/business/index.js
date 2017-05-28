import uuid from 'uuid';
import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $drop} from 'plow-js';
import {take, select, put, call} from 'redux-saga/effects';

export const actions = {};

actions.addTask = createAction(
    '@sitegeist/monocle/business/addTask',
    taskName => taskName
);

actions.finishTask = createAction(
    '@sitegeist/monocle/business/finishTask',
    taskName => taskName
);

actions.errorTask = createAction(
    '@sitegeist/monocle/business/errorTask',
    (taskName, reason) => ({taskName, reason})
);

actions.commenceAuthorization = createAction(
    '@sitegeist/monocle/business/commenceAuthorization'
);

actions.authorize = createAction(
    '@sitegeist/monocle/business/authorize',
    (username, password) => ({username, password})
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.addTask.toString():
            return $set(['business', 'tasks', action.payload], {}, state);

        case actions.errorTask.toString():
            return $set(['business', 'errors', action.payload.tasName], action.payload.reason, state);

        case actions.finishTask.toString():
            return $drop(['business', 'tasks', action.payload], state);

        case actions.commenceAuthorization.toString():
            return $set('business.needsAuthentication', true, state);

        case actions.authorize.toString():
            return $set('business.needsAuthentication', false, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.isBusy = createSelector(
    [
        $get('business.tasks')
    ],
    tasks => Object.keys(tasks).length > 0
);

selectors.needsAuthentication = $get('business.needsAuthentication');

export const sagas = {};

sagas.operation = (...args) => function * () {
    const taskName = typeof args[0] === 'string' ? args[0] : uuid.v4();
    const task = args[1] || args[0];

    yield put(actions.addTask(taskName));
    try {
        yield call(task);
    } catch (err) {
        console.error(err);
        yield put(actions.errorTask(taskName, err));
    }

    yield put(actions.finishTask(taskName));
};

sagas.unauthenticated = (url, options, ...args) =>
fetch(url, Object.assign({}, options, {credentials: 'include'}), ...args).then(
    response => {
        if (response.ok) {
            return response.json();
        }

        if (response.status === 401 || response.status === 403) {
            return 'RE-AUTHORIZE';
        }

        throw new Error(`Network response was not ok: (${response.status}) ${response.statusText}`);
    }
);

sagas.authenticated = (...args) => call(function * () {
    while (true) { // eslint-disable-line
        const result = yield sagas.unauthenticated(...args);

        if (result === 'RE-AUTHORIZE') {
            while (true) { // eslint-disable-line
                yield put(actions.commenceAuthorization());

                const credentials = (yield take(actions.authorize)).payload;
                const loginEndpoint = yield select($get('env.loginEndpoint'));
                const body = new FormData();

                body.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][username]', credentials.username);
                body.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][password]', credentials.password);

                const response = yield fetch(loginEndpoint, {
                    method: 'POST',
                    credentials: 'include',
                    body
                });

                if (response.ok) {
                    break;
                }

                if (response.status === 401 || response.status === 403) {
                    continue;
                }

                console.error(`Unexpected Network error during login: (${response.status}) ${response.statusText}`);
            }

            continue;
        }

        return result;
    }
});
