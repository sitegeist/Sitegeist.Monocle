import React from 'react';
import PropTypes from 'prop-types';

export default Component => {
    const visibility = ({isVisible, ...props}) => (
        isVisible ? <Component {...props}/> : null
    );

    visibility.propTypes = {
        isVisible: PropTypes.bool.isRequired
    };

    return visibility;
};
