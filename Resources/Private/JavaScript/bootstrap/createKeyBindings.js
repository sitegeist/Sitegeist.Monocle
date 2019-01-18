import mousetrap from './util/enhancedMousetrap';
import {$get} from 'plow-js';
import url from 'build-url';

import {actions, selectors} from 'state';

export default (store) => {
    const hotkeys = selectors.hotkeys.all(store.getState());

    if (hotkeys === undefined) {
        return;
    }

    console.log(hotkeys);

    //
    // Open the navigation
    //
    mousetrap.bindGlobal(hotkeys.openNavigation, () => store.dispatch(actions.navigation.open()));

    //
    // Close the navigation
    //
    mousetrap.bindGlobal(hotkeys.closeNavigation, () => store.dispatch(actions.navigation.close()));

    //
    // Navigate up
    //
    mousetrap.bindGlobal(hotkeys.navigateUp, () => store.dispatch(actions.navigation.up()));

    //
    // Navigate down
    //
    mousetrap.bindGlobal(hotkeys.navigateDown, () => store.dispatch(actions.navigation.down()));

    //
    // Open preview in new window
    //
    mousetrap.bindGlobal(hotkeys.openPreviewInNewWindow, () => {
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

    //
    // Select prototype on enter, if there's only one search result
    //
    mousetrap.bindGlobal('enter', () => {
        const state = store.getState();
        const prototypeGroups = selectors.navigation.filteredAndGroupedPrototypes(state);

        if (prototypeGroups.length === 1) {
            if (prototypeGroups[0].prototypes.length === 1) {
                store.dispatch(
                    actions.prototypes.select(prototypeGroups[0].prototypes[0].name)
                );
                store.dispatch(actions.navigation.close());
            }
        }
    });
};
