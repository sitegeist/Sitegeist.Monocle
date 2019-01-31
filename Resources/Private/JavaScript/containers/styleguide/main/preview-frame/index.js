import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import debounce from 'lodash.debounce';
import mergeClassNames from 'classnames';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const src = selectors.navigation.previewUri(state);
    const sourceQuerySelector = $get('env.previewSettings.sourceQuerySelector', state);
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const isLocked = Boolean(currentlySelectedBreakpoint);
    const isVisible = Boolean(src);
    const isPropsInspectorOpen = selectors.propsInspector.isOpen(state);

    const styles = isLocked ? {
        width: currentlySelectedBreakpoint.width,
        transform: window.innerWidth < currentlySelectedBreakpoint.width ?
        `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
        height: currentlySelectedBreakpoint.height
    } : {
        width: isPropsInspectorOpen ? 'calc(100% - 50vw - 2rem)' : '100%',
        minWidth: isPropsInspectorOpen ? 'calc(100% - 400px - 2rem)' : '100%'
    };

    return {src, sourceQuerySelector, isVisible, isLocked, styles};
}, {
    onLoad: actions.prototypes.ready,
    setCurrentHtml: actions.prototypes.setCurrentHtml
})
@visibility
export default class PreviewFrame extends PureComponent {
    static propTypes = {
        src: PropTypes.string.isRequired,
        sourceQuerySelector: PropTypes.string.isRequired,
        styles: PropTypes.object,
        onLoad: PropTypes.func.isRequired,
        setCurrentHtml: PropTypes.func.isRequired,
        isLocked: PropTypes.bool.isRequired
    };

    updateSrc = debounce(src => {
        if (this.iframe) {
            this.iframe.contentWindow.location.replace(src);
        }
    }, 500);

    componentWillReceiveProps(newProps) {
        const {src} = this.props;

        if (src !== newProps.src && this.iframe) {
            this.updateSrc(newProps.src);
        }
    }

    iframeReference = iframe => {
        if (iframe) {
            const {src} = this.props;

            this.iframe = iframe;
            this.updateSrc(src);
        }
    }

    iframeLoaded = () => {
        const {onLoad, setCurrentHtml, sourceQuerySelector} = this.props;
        setCurrentHtml(this.iframe.contentDocument.querySelector(sourceQuerySelector).innerHTML);
        onLoad();
    }

    render() {
        const {styles, isLocked} = this.props;

        return (
	<iframe
    role="presentation"
    id="preview-frame"
    ref={this.iframeReference}
    className={mergeClassNames({
        [style.frame]: true,
        [style.isLocked]: isLocked
    })}
    style={styles}
    frameBorder="0"
    onLoad={this.iframeLoaded}
    />
        );
    }
}
