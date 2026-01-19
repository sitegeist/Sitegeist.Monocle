import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { Grid } from "../../../../grid";
import { selectors, State } from "../../../../state";
import type { GridDefinition } from "../../../../schema";

import style from "./style.module.css";

type NormalizedGridDefinition = GridDefinition & { columns: number };

interface PreviewGridOverlayProps {
    isVisible: boolean
    isLocked: boolean
    styles: React.CSSProperties
    grids: NormalizedGridDefinition[]
}

class PreviewGridOverlayC extends PureComponent<PreviewGridOverlayProps> {
    render() {
        const { isVisible, isLocked, styles, grids } = this.props;

        if (!isVisible || grids.length === 0) {
            return null;
        }

        const frameStyles = {
            ...styles,
            height: styles.height ?? "100%"
        };

        return (
            <div className={style.gridOverlay} aria-hidden="true">
                <div
                    className={cx(style.gridFrame, {
                        [style.isLocked]: isLocked
                    })}
                    style={frameStyles}
                    >
                    {grids.map((grid, index) => (
                        <Grid
                            key={`${grid.label ?? index}-${index}`}
                            label={grid.label ?? ""}
                            mediaQuery={grid.mediaQuery ?? ""}
                            gap={grid.gap ?? ""}
                            gutter={grid.gutter ?? ""}
                            columns={grid.columns}
                            width={grid.width ?? "100%"}
                            maxWidth={grid.maxWidth ?? "100%"}
                            margin={grid.margin ?? "0 auto"}
                            />
                    ))}
                </div>
            </div>
        );
    }
}

export const PreviewGridOverlay = connect((state: State) => {
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);
    const isLocked = Boolean(currentlySelectedBreakpoint);
    const isPropsInspectorOpen = selectors.propsInspector.isOpen(state);
    const gridsByName = selectors.grid.gridsByName(state);
    const grids = Object.entries(gridsByName).map(([name, grid]) => {
        const columns = typeof grid.columns === "string"
            ? parseInt(grid.columns, 10)
            : grid.columns;
        return {
            ...grid,
            label: grid.label ?? name,
            columns
        };
    }).filter((grid): grid is NormalizedGridDefinition => typeof grid.columns === "number" && !Number.isNaN(grid.columns));

    const styles = currentlySelectedBreakpoint ? {
        width: currentlySelectedBreakpoint.width,
        transform: window.innerWidth < currentlySelectedBreakpoint.width ?
        `translate(-50%) scale(${window.innerWidth / currentlySelectedBreakpoint.width})` : 'translate(-50%)',
        height: currentlySelectedBreakpoint.height
    } : {
        width: isPropsInspectorOpen ? 'calc(100% - 50vw - 2rem)' : '100%',
        minWidth: isPropsInspectorOpen ? 'calc(100% - 400px - 2rem)' : '100%'
    };

    return {
        isVisible: selectors.grid.isVisible(state),
        isLocked,
        styles,
        grids
    };
})(PreviewGridOverlayC);
