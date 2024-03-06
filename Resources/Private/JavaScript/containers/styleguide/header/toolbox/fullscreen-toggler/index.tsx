import * as React from "react";
import { PureComponent } from "react";
import {connect} from "react-redux";

import { Button, Icon } from "@neos-project/react-ui-components";

import { visibility } from "../../../../../components";
import { selectors, State } from "../../../../../state";

import style from "./style.module.css";

interface FullscreenTogglerProps {
    url: string
}

class FullscreenTogglerC extends PureComponent<FullscreenTogglerProps> {
    render() {
        const { url } = this.props;

        return (
            <a href={url} target="_blank">
                <Button className={style.selector} style="clean">
                    <Icon icon="external-link" className={style.icon}/>
                </Button>
            </a>
        );
    }
}

export const FullscreenToggler = connect((state: State) => {
    const url = selectors.navigation.previewUri(state);
    const isVisible = Boolean(url);

    return {url, isVisible};
})(visibility(FullscreenTogglerC));
