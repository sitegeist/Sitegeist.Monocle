import React from 'react';

import style from './attached.css';

export default (alignment = 'centered') => Component => props => (
    <div className={`${style.attached} ${style[`attached--${alignment}`]}`}>
        <Component {...props}/>
    </div>
);
