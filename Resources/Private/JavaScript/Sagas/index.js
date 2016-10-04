import historySaga from './History/index';
import prototypeSaga from './Prototype/index';
import viewportPresetsSaga from './ViewportPresets/index';
import resourcesSaga from './Resources/index';
import sitesSaga from './Sites/index';

export default function* rootSaga() {
    yield [
        historySaga(),
        prototypeSaga(),
        viewportPresetsSaga(),
        resourcesSaga(),
        sitesSaga()
    ];
}
