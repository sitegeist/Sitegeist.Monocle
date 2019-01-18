import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const src = selectors.navigation.previewUri(state);
    const sourceQuerySelector = selectors.preview.sourceQuerySelector(state);
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const isVisible = Boolean(src);
    const styles = currentlySelectedBreakpoint ? {
        width: currentlySelectedBreakpoint.width,
        transform: window.innerWidth < currentlySelectedBreakpoint.width ?
            `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
        height: currentlySelectedBreakpoint.height
    } : {
        width: '100%'
    };

    return {src, sourceQuerySelector, isVisible, styles};
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
        setCurrentHtml: PropTypes.func.isRequired
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
        const {styles} = this.props;

        return (
	<iframe
    role="presentation"
    id="preview-frame"
    ref={this.iframeReference}
    className={style.frame}
    style={styles}
    frameBorder="0"
    onLoad={this.iframeLoaded}
    />
        );
    }
}
