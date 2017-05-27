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

    return {
        src: currentlyRenderedPrototype && url(previewUri, {
            queryParams: {
                prototypeName: currentlyRenderedPrototype.prototypeName
            }
        }),
        isVisible: Boolean(currentlyRenderedPrototype)
    };
}, {
    onLoad: actions.prototypes.ready
})
@visibility
export default class PreviewFrame extends PureComponent {
    render() {
        const {src, onLoad} = this.props;

        return (
            <iframe className={style.frame} src={src} frameBorder="0" onLoad={onLoad}/>
        );
    }
}
