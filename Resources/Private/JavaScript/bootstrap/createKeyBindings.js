import mousetrap from './util/enhancedMousetrap';
import {$get} from 'plow-js';
import url from 'build-url';

import {actions, selectors} from 'state';

export default (env, store) => {
    //
    // Open the navigation
    //
    mousetrap.bindGlobal(env.uiSettings.hotkeys.openNavigation, () => store.dispatch(actions.navigation.open()));

    //
    // Close the navigation
    //
    mousetrap.bindGlobal(env.uiSettings.hotkeys.closeNavigation, () => store.dispatch(actions.navigation.close()));

    //
    // Navigate up
    //
    mousetrap.bindGlobal(env.uiSettings.hotkeys.navigateUp, () => store.dispatch(actions.navigation.up()));

    //
    // Navigate down
    //
    mousetrap.bindGlobal(env.uiSettings.hotkeys.navigateDown, () => store.dispatch(actions.navigation.down()));

    //
    // Open preview in new window
    //
    mousetrap.bindGlobal(env.uiSettings.hotkeys.openPreviewInNewWindow, () => {
        const state = store.getState();
        const previewEndpoint = $get('env.previewUri', state);
        const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
        const sitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);
        const previewUrl = currentlyRenderedPrototype && url(previewEndpoint, {
            queryParams: {
                prototypeName: currentlyRenderedPrototype.prototypeName,
                sitePackageKey
            }
        });

        window.open(previewUrl, '_blank');
    });
};
