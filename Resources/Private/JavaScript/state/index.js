import {compose} from 'redux';
import {values} from 'ramda';

import * as prototypes from './prototypes';

export const actions = {
    prototypes: prototypes.actions
};

export const reducer = compose(
    prototypes.reducer
);

export const selectors = {
    prototypes: prototypes.selectors
};

export const sagas = [
    ...values(prototypes.sagas)
];
