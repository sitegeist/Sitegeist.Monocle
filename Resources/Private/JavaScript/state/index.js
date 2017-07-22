import {values} from 'ramda';

import * as prototypes from './prototypes';
import * as breakpoints from './breakpoints';
import * as sites from './sites';
import * as business from './business';
import * as navigation from './navigation';

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    sites: sites.actions,
    business: business.actions,
    navigation: navigation.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    breakpoints.reducer,
    sites.reducer,
    business.reducer,
    navigation.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    sites: sites.selectors,
    business: business.selectors,
    navigation: navigation.selectors
};

export const sagas = [
    ...values(prototypes.sagas),
    ...values(breakpoints.sagas),
    ...values(sites.sagas)
];
