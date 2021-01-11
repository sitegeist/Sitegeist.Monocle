import mousetrap from "mousetrap";
import buildUrl from "build-url";

import { actions, selectors } from "../state";

import { Store } from "./createStore";

export function createKeyBindings(store: Store) {
    const hotkeys = selectors.hotkeys.all(store.getState());

    if (hotkeys === undefined) {
        return;
    }

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
        const previewEndpoint = state.env.previewUri;

        if (previewEndpoint !== undefined) {
            const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
            const sitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);
            const previewUrl = currentlyRenderedPrototype && buildUrl(previewEndpoint, {
                queryParams: {
                    prototypeName: currentlyRenderedPrototype.prototypeName,
                    sitePackageKey
                }
            });

            if (previewUrl !== null) {
                window.open(previewUrl, '_blank');
            }
        }
    });

    //
    // Select prototype on enter, if there's only one search result
    //
    mousetrap.bindGlobal('enter', () => {
        const state = store.getState();
        const [prototypeGroup] = selectors.navigation
            .filteredAndGroupedPrototypes(state);

        if (prototypeGroup) {
            const [prototype] = prototypeGroup.prototypes;

            if (prototype) {
                store.dispatch(
                    actions.prototypes.select(prototype.name)
                );
                store.dispatch(actions.navigation.close());
            }
        }
    });
};
