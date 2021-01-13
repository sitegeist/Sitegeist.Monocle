import { ActionType } from "typesafe-actions";
import { v4 as uuidV4 } from "uuid";
import { SagaIterator } from "redux-saga";
import { take, select, put, call } from "redux-saga/effects";

import { State } from "..";

import * as actions from "./actions";

export function* operation(task: () => SagaIterator<void>) {
    const taskName = uuidV4();

    yield put(actions.addTask(taskName));
    try {
        yield call(task);
    } catch (err) {
        console.error(err);
        yield put(actions.errorTask(taskName, err));
    }

    yield put(actions.finishTask(taskName));
}

export async function unauthenticated(url: string, options?: RequestInit) {
    const response = await fetch(url, { ...options, credentials: 'include' });

    if (response.ok) {
        return await response.json();
    }

    if (response.status === 401 || response.status === 403) {
        return 'RE-AUTHORIZE';
    }

    throw new Error(`Network response was not ok: (${response.status}) ${response.statusText}`);
}

export function authenticated(url: string, options?: RequestInit) {
    return call(function * () {
        while (true) { // eslint-disable-line
            const result = yield unauthenticated(url, options);

            if (result === 'RE-AUTHORIZE') {
                while (true) { // eslint-disable-line
                    yield put(actions.commenceAuthorization());

                    const { payload: credentials } = (
                        yield take(actions.authorize)
                    ) as ActionType<typeof actions.authorize>;
                    const loginEndpoint: string = yield select(
                        (state: State) => state.env.loginEndpoint
                    );
                    const body = new FormData();

                    body.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][username]', credentials.username);
                    body.set('__authentication[Neos][Flow][Security][Authentication][Token][UsernamePassword][password]', credentials.password);

                    const response = (
                        yield fetch(loginEndpoint, {
                            method: 'POST',
                            credentials: 'include',
                            body
                        })
                    ) as Response;

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
}
