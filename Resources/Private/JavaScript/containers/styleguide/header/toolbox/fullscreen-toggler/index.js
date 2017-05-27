import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import url from 'build-url';
import {$get} from 'plow-js';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {visibility} from 'components';
import {selectors} from 'state';

import style from './style.css';

@connect(state => {
    const previewUri = $get('env.previewUri', state);
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);

    return {
        url: currentlyRenderedPrototype && url(previewUri, {
            queryParams: {
                prototypeName: currentlyRenderedPrototype.prototypeName
            }
        }),
        isVisible: Boolean(currentlyRenderedPrototype)
    };
})
@visibility
export default class FullscreenToggler extends PureComponent {
    render() {
        const {url} = this.props;

        return (
            <a href={url} target="_blank">
                <Button className={style.selector}>
                    <Icon icon="external-link" className={style.icon}/>
                </Button>
            </a>
        );
    }
}
