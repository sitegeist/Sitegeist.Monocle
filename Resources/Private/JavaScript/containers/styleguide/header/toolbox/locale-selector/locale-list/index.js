import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withHandlers} from 'recompose';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import Locale from './locale';

import style from './style.css';

@visibility
@outside
@attached('right')
@connect(state => {
    return {
        locales: selectors.locales.all(state)
    };
}, {
    selectLocale: actions.locales.select
})
@withHandlers({
    handleSelectLocale: props => localeName => {
        props.selectLocale(localeName);
        props.onSelectLocale(localeName);
    }
})
export default class LocaleList extends PureComponent {
    static propTypes = {
        locales: PropTypes.object.isRequired,
        handleSelectLocale: PropTypes.func.isRequired
    };

    render() {
        const {locales, handleSelectLocale} = this.props;

        return (
            <div className={style.list}>
                <div className={style.locales}>
                    {Object.keys(locales).map(name => ({name, ...locales[name]})).map(
                        locales => (
                            <Locale
                                key={locales.name}
                                onClick={handleSelectLocale}
                                {...locales}
                                />
                        )
                    )}
                    <hr className={style.separator}/>
                    <Locale
                        onClick={handleSelectLocale}
                        name=""
                        label="default"
                        />
                </div>
            </div>
        );
    }
}
