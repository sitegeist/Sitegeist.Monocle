import React, {PureComponent} from 'react';

import {resizable} from 'components';

@resizable({
    initialHeight: 320,
    collapsedHeight: 40
})
export default class InfoTabs extends PureComponent {
    render() {
        return (
            <div>
                INFOTABS
            </div>
        );
    }
}
