import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { visibility, outside, attached } from "../../../../../../components";
import { selectors, actions, State } from "../../../../../../state";

import { Locale } from "./locale";

import style from "./style.css";

interface LocaleListProps {
    locales: {
        [key:string]: {
            label: string
        }
    }
    selectLocale: (localeName: string) => void
    onSelectLocale: (localeName: string) => void
}

class LocalesListC extends PureComponent<LocaleListProps> {
    handleSelectLocale = (localeName: string) => {
        this.props.selectLocale(localeName);
        this.props.onSelectLocale(localeName);
    }

    render() {
        const { locales } = this.props;

        return (
            <div className={style.list}>
                <div className={style.locales}>
                    {Object.keys(locales).map(name => ({name, ...locales[name]})).map(
                        locales => (
                            <Locale
                                key={locales.name}
                                onClick={this.handleSelectLocale}
                                {...locales}
                                />
                        )
                    )}
                    <hr className={style.separator}/>
                    <Locale
                        onClick={this.handleSelectLocale}
                        name=""
                        label="default"
                        />
                </div>
            </div>
        );
    }
}

export const LocalesList = visibility(outside(attached('right')(
    connect((state: State) => {
        return {
            locales: selectors.locales.all(state)
        };
    }, {
        selectLocale: actions.locales.select
    })(LocalesListC)
)));
