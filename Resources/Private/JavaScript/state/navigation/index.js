import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import url from 'build-url';
import {$get, $set, $all, $toggle, $count} from 'plow-js';

import * as prototypes from '../prototypes';
import * as sites from '../sites';

export const actions = {};

actions.open = createAction(
    '@sitegeist/monocle/navigation/open'
);

actions.close = createAction(
    '@sitegeist/monocle/navigation/close'
);

actions.toggle = createAction(
    '@sitegeist/monocle/navigation/toggle'
);

actions.search = createAction(
    '@sitegeist/monocle/navigation/search',
    term => term
);

actions.up = createAction(
    '@sitegeist/monocle/navigation/up'
);

actions.down = createAction(
    '@sitegeist/monocle/navigation/down'
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.open.toString():
            return $all(
                $set('navigation.isOpen', true),
                $set('navigation.currentIndex', -1),
                state
            );

        case actions.close.toString():
            return $all(
                $set('navigation.isOpen', false),
                $set('navigation.currentIndex', -1),
                state
            );

        case actions.toggle.toString():
            return $all(
                $toggle('navigation.isOpen'),
                $set('navigation.currentIndex', -1),
                state
            );

        case actions.search.toString():
            return $all(
                $set('navigation.searchTerm', action.payload),
                $set('navigation.currentIndex', -1),
                state
            );

        case actions.up.toString(): {
            const currentIndex = $get('navigation.currentIndex', state);

            if (currentIndex > 0 && $get('navigation.isOpen', state)) {
                return $set('navigation.currentIndex', currentIndex - 1, state);
            }

            return state;
        }

        case actions.down.toString(): {
            const currentIndex = $get('navigation.currentIndex', state);

            if (currentIndex < $count('prototypes.byName', state) - 1 && $get('navigation.isOpen', state)) {
                return $set('navigation.currentIndex', currentIndex + 1, state);
            }

            return state;
        }

        default:
            return state;
    }
};

export const selectors = {};

const sortByPropertyAccess = (a, b, accessorFunction, defaultValue) => {
    const valueA = accessorFunction(a) || defaultValue;
    const valueB = accessorFunction(b) || defaultValue;

    if (valueA === valueB) {
        return 0;
    }

    return valueA < valueB ? -1 : 1;
};

selectors.searchTerm = $get('navigation.searchTerm');
selectors.currentIndex = $get('navigation.currentIndex');
selectors.isOpen = $get('navigation.isOpen');

selectors.filteredAndGroupedPrototypes = createSelector(
    [
        prototypes.selectors.all,
        selectors.searchTerm,
        selectors.currentIndex
    ],
    (prototypes, searchTerm, currentIndex) => {
        const lowerCasedSearchTerm = searchTerm.toLowerCase();
        const result = Object.values(
            Object.keys(prototypes)
                .map(name => Object.assign({name}, prototypes[name], {
                    relevance: (
                        (prototypes[name].title.toLowerCase().includes(lowerCasedSearchTerm) * 2) +
                        name.toLowerCase().includes(lowerCasedSearchTerm) +
                        prototypes[name].description.toLowerCase().includes(lowerCasedSearchTerm)
                    )
                }))
                .filter(prototype => prototype.relevance)
                .sort((a, b) => (
                    sortByPropertyAccess(a, b, $get('structure.position'), Infinity) ||
                    sortByPropertyAccess(a, b, $get('options.position')) ||
                    sortByPropertyAccess(a, b, $get('title')) ||
                    b.relevance - a.relevance
                ))
                .map((prototype, index) => ({...prototype, isFocused: currentIndex === index}))
                .reduce((groups, prototype) => {
                    if (!groups[prototype.structure.label]) {
                        groups[prototype.structure.label] = {
                            ...prototype.structure,
                            prototypes: []
                        };
                    }

                    groups[prototype.structure.label].prototypes.push(prototype);

                    return groups;
                }, {})

        );

        return result;
    }
);

selectors.previewUri = createSelector(
    [
        $get('env.previewUri'),
        prototypes.selectors.currentlyRendered,
        prototypes.selectors.overriddenProps,
        prototypes.selectors.selectedPropSet,
        sites.selectors.currentlySelectedSitePackageKey
    ],
    (endpoint, renderedPrototype, props, propSet, sitePackageKey) => {
        if (!renderedPrototype) {
            return null;
        }

        const {prototypeName} = renderedPrototype;

        return url(endpoint, {
            queryParams: {
                prototypeName,
                propSet,
                sitePackageKey,
                props: JSON.stringify(props)
            }
        });
    }
);
