import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import mergeClassNames from 'classnames';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const isPropsInspectorOpen = selectors.propsInspector.isOpen(state);
    const isLocked = Boolean(currentlySelectedBreakpoint);
    const isVisible = selectors.grid.isVisible(state);

    const styles = isLocked ? {
        width: currentlySelectedBreakpoint.width,
        transform: window.innerWidth < currentlySelectedBreakpoint.width ?
        `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
        height: currentlySelectedBreakpoint.height
    } : {
        width: isPropsInspectorOpen ? 'calc(100% - 50vw - 2rem)' : '100%',
        minWidth: isPropsInspectorOpen ? 'calc(100% - 400px - 2rem)' : '100%'
    };
    return {currentlySelectedBreakpoint, isLocked, isVisible, styles};
}, {
    onLoad: actions.prototypes.ready,
    setCurrentHtml: actions.prototypes.setCurrentHtml
})
@visibility
export default class Grid extends PureComponent {
    static propTypes = {
        isLocked: PropTypes.bool.isRequired
    };

    render() {
        const {styles, isLocked, currentlySelectedBreakpoint} = this.props;
        console.log(this.props);
        return (
            <div className={mergeClassNames({[style.frame]: true, [style.isLocked]: isLocked})}>foobar</div>
        );
    }
}
