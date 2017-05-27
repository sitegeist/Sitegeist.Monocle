import {values} from 'ramda';

import * as prototypes from './prototypes';
import * as business from './business';

export const actions = {
    prototypes: prototypes.actions,
    business: business.actions
};

export const reducer = (state, action) => [
    prototypes.reducer,
    business.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    business: business.selectors
};

export const sagas = [
    ...values(prototypes.sagas)
];
