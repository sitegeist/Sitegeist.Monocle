import {createAction} from 'redux-actions';

const SET_ACTIVE_SITE = '@sitegeist/monocle-ui/SiteOptions/SET_ACTIVE_SITE';
const SET_AVAILABLE_SITES = '@sitegeist/monocle-ui/SiteOptions/SET_AVAILABLE_SITES';


const actionTypes =  {
    SET_ACTIVE_SITE,
    SET_AVAILABLE_SITES
};

const setActiveSite = createAction(SET_ACTIVE_SITE, activeSite => activeSite);
const setAvailableSites = createAction(SET_AVAILABLE_SITES, availableSites => availableSites);

const actions = {
    setActiveSite,
    setAvailableSites
};

const reducer = (state = {}, action) => {
	switch(action.type)	{
		case SET_ACTIVE_SITE:
			return state.setIn(['activeSite'], action.payload);
        case SET_AVAILABLE_SITES:
            return state.setIn(['availableSites'], action.payload);
	}
	return state;
};

export default {
	actionTypes,
	actions,
	reducer
};
