import React from 'react';

export default Component => ({isVisible, ...props}) => (
    isVisible ? <Component {...props}/> : null
);
