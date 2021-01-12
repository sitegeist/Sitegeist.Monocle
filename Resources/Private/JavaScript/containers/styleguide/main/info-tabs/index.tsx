import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import prettify from "html-prettify";

import Tabs from "@neos-project/react-ui-components/lib-esm/Tabs";

import { visibility, resizable } from "../../../../components";
import { selectors, State } from "../../../../state";

import { Code } from "./code";
import { Anatomy, AnatomyType } from "./anatomy";

import style from "./style.css";
import tabTheme from "./tabTheme.css";
import tabPanelTheme from "./tabPanelTheme.css";

interface InfoTabsProps {
    title?: string
    prototypeName: string
    description?: string
    renderedHtml: string
    renderedCode: string
    parsedCode: string
    anatomy: AnatomyType | AnatomyType[]
    prototypes: object
}

class InfoTabsC extends PureComponent<InfoTabsProps> {
    render() {
        const {
            title,
            prototypeName,
            description,
            renderedHtml,
            renderedCode,
            parsedCode,
            anatomy,
            prototypes
        } = this.props;

        return (
            <Tabs className={style.infoTabs} theme={tabTheme}>
                <Tabs.Panel title={title} icon="info" theme={tabPanelTheme}>
                    <h2>{title} <small className={style.prototypeLabel}>{prototypeName}</small></h2>
                    {description}
                </Tabs.Panel>
                <Tabs.Panel title="HTML" icon="code" theme={tabPanelTheme}>
                    <Code content={prettify(renderedHtml)} language="html" style={{whiteSpace: 'break-spaces'}}/>
                </Tabs.Panel>
                <Tabs.Panel title="Fusion" icon="terminal" theme={tabPanelTheme}>
                    <Code content={renderedCode} language="vim"/>
                </Tabs.Panel>
                <Tabs.Panel title="Fusion AST" icon="terminal" theme={tabPanelTheme}>
                    <Code content={parsedCode} language="yaml"/>
                </Tabs.Panel>
                <Tabs.Panel title="Anatomy" icon="heartbeat" theme={tabPanelTheme}>
                    <Anatomy anatomy={anatomy} prototypes={prototypes} prototypeName={prototypeName}/>
                </Tabs.Panel>
            </Tabs>
        );
    }
}

export const InfoTabs = connect((state: State) => {
    const prototypes = selectors.prototypes.all(state);
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
    const currentlySelectedPrototype = selectors.prototypes.currentlySelected(state);
    const currentHtml = selectors.prototypes.currentHtml(state);

    return {
        prototypes,
        ...currentlyRenderedPrototype,
        ...currentlySelectedPrototype,
        renderedHtml: currentHtml ? currentHtml : '',
        isVisible: Boolean(currentlyRenderedPrototype) && Boolean(currentlySelectedPrototype)
    };
})(visibility(resizable({
    initialHeight: 320,
    collapsedHeight: 40,
    toggleHandleClassName: style.toggleHandle
})(InfoTabsC)));
