import historySaga from './History/index';

export default function* rootSaga() {
    yield [
        historySaga()
    ];
}
