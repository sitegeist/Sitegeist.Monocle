import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import url from 'build-url';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const previewUri = $get('env.previewUri', state);
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);

    return {
        src: currentlyRenderedPrototype && url(previewUri, {
            queryParams: {
                prototypeName: currentlyRenderedPrototype.prototypeName
            }
        }),
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
    onLoad: actions.prototypes.ready
})
@visibility
export default class PreviewFrame extends PureComponent {
    render() {
        const {src, styles, onLoad} = this.props;

        return (
            <iframe
                id="preview-frame"
                className={style.frame}
                src={src}
                style={styles}
                frameBorder="0"
                onLoad={onLoad}
                />
        );
    }
}
