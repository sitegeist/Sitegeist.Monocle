import React from 'react';

import style from './outside.css';

export default Component => props => (
    <div>
        <div className={style.outside} onClick={props.onClickOutside ? props.onClickOutside : () => {}}/>
        <div className={style.inside}>
            <Component {...props}/>
        </div>
    </div>
);
