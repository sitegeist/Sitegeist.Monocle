import React, {PureComponent} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './style.css';

export default class SiteSelector extends PureComponent {
    render() {
        return (
            <Button className={style.selector} style="clean">
                <Icon icon="globe" className={style.icon}/>
                SITESELECTOR
            </Button>
        );
    }
}
