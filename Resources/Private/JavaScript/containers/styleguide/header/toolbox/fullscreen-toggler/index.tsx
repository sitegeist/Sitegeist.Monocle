import * as React from "react";
import { PureComponent } from "react";
import {connect} from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { visibility } from "../../../../../components";
import { selectors, State } from "../../../../../state";

import style from "./style.css";

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

export const FullscreenToggler = visibility(
    connect((state: State) => {
        const url = selectors.navigation.previewUri(state);
        const isVisible = Boolean(url);

        return {url, isVisible};
    })(FullscreenTogglerC)
);
