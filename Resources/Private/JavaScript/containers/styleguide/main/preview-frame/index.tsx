import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import cx from "classnames";

import { selectors, actions, State } from "../../../../state";
import { visibility } from "../../../../components";

import style from "./style.css";
import { Grid } from "../../../grid";

interface PreviewFrameProps {
    src: string
    sourceQuerySelector: string
    styles: React.CSSProperties
    onLoad: () => void
    setCurrentHtml: (html: string) => void
    isLocked: boolean
}

class PreviewFrameC extends PureComponent<PreviewFrameProps> {
    private iframe: HTMLIFrameElement | null;

    updateSrc = debounce(src => {
        if (this.iframe) {
            this.iframe.contentWindow?.location.replace(src);
        }
    }, 500);

    UNSAFE_componentWillReceiveProps(newProps: PreviewFrameProps) {
        const { src } = this.props;

        if (src !== newProps.src && this.iframe) {
            this.updateSrc(newProps.src);
        }
    }

    iframeReference = (iframe: HTMLIFrameElement) => {
        if (iframe) {
            const { src } = this.props;

            this.iframe = iframe;
            this.updateSrc(src);
        }
    }

    iframeLoaded = () => {
        const { onLoad, setCurrentHtml, sourceQuerySelector } = this.props;
        setCurrentHtml(this.iframe?.contentDocument?.querySelector(sourceQuerySelector)?.innerHTML ?? '');
        onLoad();
    }

    render() {
        const { styles, isLocked } = this.props;

        return (
            <div className={style.frameWrapper}>
                <Grid />
                <iframe
                    role="presentation"
                    id="preview-frame"
                    ref={this.iframeReference}
                    className={cx({
                        [style.frame]: true,
                        [style.isLocked]: isLocked
                    })}
                    style={styles}
                    frameBorder="0"
                    onLoad={this.iframeLoaded}
                    />
            </div>
        );
    }
}

export const PreviewFrame = connect((state: State) => {
    const src = selectors.navigation.previewUri(state);
    const sourceQuerySelector = selectors.preview.sourceQuerySelector(state);
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const isLocked = Boolean(currentlySelectedBreakpoint);
    const isVisible = Boolean(src);
    const isPropsInspectorOpen = selectors.propsInspector.isOpen(state);

    const styles = currentlySelectedBreakpoint ? {
        width: currentlySelectedBreakpoint.width,
        transform: window.innerWidth < currentlySelectedBreakpoint.width ?
        `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
        height: currentlySelectedBreakpoint.height
    } : {
        width: isPropsInspectorOpen ? 'calc(100% - 50vw - 2rem)' : '100%',
        minWidth: isPropsInspectorOpen ? 'calc(100% - 400px - 2rem)' : '100%'
    };

    return {src, sourceQuerySelector, isVisible, isLocked, styles};
}, {
    onLoad: actions.prototypes.ready,
    setCurrentHtml: actions.prototypes.setCurrentHtml
})(visibility(PreviewFrameC));
