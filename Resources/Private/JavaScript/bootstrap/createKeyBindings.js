import mousetrap from './util/enhancedMousetrap';

import {actions} from 'state';

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
    // TODO: Open preview in new window
    //
};
