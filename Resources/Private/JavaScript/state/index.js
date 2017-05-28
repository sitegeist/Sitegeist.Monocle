import {values} from 'ramda';

import * as prototypes from './prototypes';
import * as breakpoints from './breakpoints';
import * as sites from './sites';
import * as business from './business';

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    sites: sites.actions,
    business: business.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    breakpoints.reducer,
    sites.reducer,
    business.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    sites: sites.selectors,
    business: business.selectors
};

export const sagas = [
    ...values(prototypes.sagas),
    ...values(breakpoints.sagas),
    ...values(sites.sagas)
];
