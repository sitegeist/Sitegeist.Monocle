import React from 'react';
import ReactDOM from 'react-dom';

import {createEnv, createStore} from './bootstrap';
import {Styleguide} from './containers';

const appContainer = document.getElementById('app');
const env = createEnv(appContainer);
const store = createStore(env);

ReactDOM.render(<Styleguide store={store}/>, appContainer);
