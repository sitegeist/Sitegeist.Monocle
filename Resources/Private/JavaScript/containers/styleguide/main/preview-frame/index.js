import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import url from 'build-url';
import debounce from 'lodash.debounce';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const previewUri = $get('env.previewUri', state);
    const sourceQuerySelector = $get('env.previewSettings.sourceQuerySelector', state);
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
    const overriddenProps = selectors.prototypes.overriddenProps(state);
    const selectedPropSet = selectors.prototypes.selectedPropSet(state);
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const sitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);

    return {
        src: currentlyRenderedPrototype && url(previewUri, {
            queryParams: {
                prototypeName: currentlyRenderedPrototype.prototypeName,
                propSet: selectedPropSet,
                sitePackageKey: sitePackageKey,
                props: JSON.stringify(overriddenProps)
            }
        }),
        sourceQuerySelector: sourceQuerySelector,
        isVisible: Boolean(currentlyRenderedPrototype),
        styles: currentlySelectedBreakpoint ? {
            width: currentlySelectedBreakpoint.width,
            transform: window.innerWidth < currentlySelectedBreakpoint.width ?
                `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
            height: currentlySelectedBreakpoint.height
        } : {
            width: '100%'
        }
    };
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
