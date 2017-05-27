import React from 'react';

import style from './attached.css';

export default Component => props => (
    <div className={style.attached}>
        <Component {...props}/>
    </div>
);
