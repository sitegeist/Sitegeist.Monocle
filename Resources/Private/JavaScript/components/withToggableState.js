import {compose, withState, withHandlers} from 'recompose';

export default (propName, initialState) => {
    const updaterName = `toggle${propName.charAt(0).toUpperCase() + propName.slice(1)}`;

    return compose(
        withState(propName, updaterName, initialState),
        withHandlers({
            [updaterName]: updaters => () => updaters[updaterName](n => !n)
        })
    );
};
