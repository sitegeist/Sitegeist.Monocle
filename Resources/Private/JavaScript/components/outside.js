import React from 'react';
import PropTypes from 'prop-types';

import style from './outside.css';

export default Component => {
    const outside = props => (
        <div>
            <div
                role="button"
                className={style.outside}
                onClick={props.onClickOutside ? props.onClickOutside : () => {}}
                />
            <div className={style.inside}>
                <Component {...props}/>
            </div>
        </div>
    );

    outside.propTypes = {
        onClickOutside: PropTypes.func
    };

    return outside;
};
