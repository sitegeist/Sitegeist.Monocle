import React, {PureComponent} from 'react';
import Bar from '@neos-project/react-ui-components/lib-esm/Bar';

import PrototypeSelector from './prototype-selector';
import SiteSelector from './site-selector';
import Toolbox from './toolbox';

import style from './style.css';

export default class Header extends PureComponent {
    render() {
        return (
            <header className={style.header}>
                <Bar position="top" className={style.bar}>
                    <div className={style.section}>
                        <SiteSelector/>
                    </div>
                    <div className={style.section}>
                        <PrototypeSelector/>
                    </div>
                    <div className={style.section}>
                        <Toolbox/>
                    </div>
                </Bar>
            </header>
        );
    }
}
