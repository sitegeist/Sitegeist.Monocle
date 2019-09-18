import React, {PureComponent} from 'react';

import PreviewFrame from './preview-frame';
import InfoTabs from './info-tabs';
import Grid from './grid';

import style from './style.css';

export default class Main extends PureComponent {
    render() {
        return (
            <section className={style.main}>
                <Grid/>
                <PreviewFrame/>
                <InfoTabs/>
            </section>
        );
    }
}
