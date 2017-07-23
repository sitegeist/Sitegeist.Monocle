import {actions} from 'state';

export default (env, store) => {
    window.onpopstate = ({state}) => {
        const {sitePackageKey, prototypeName} = state;

        store.dispatch(actions.routing.route(sitePackageKey, prototypeName));
    };
};
