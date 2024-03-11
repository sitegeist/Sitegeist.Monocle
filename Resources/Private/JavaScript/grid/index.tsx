import * as React from "react";
import {Component} from 'react';

interface GridState {
    isActive: boolean
}

interface IGridDefinition {
    mediaQuery: string
    label: string
    columns: number
    gutter: string
    gap: string
    width: string
    maxWidth: string
    margin: string
}

export class Grid extends Component<IGridDefinition, GridState> {

    constructor(props: IGridDefinition) {
        super(props)
        const {mediaQuery} = this.props;
        if (props.mediaQuery) {
            this.state = {isActive: window.matchMedia(mediaQuery).matches};
        } else {
            this.state = {isActive: true};
        }
    }

    componentDidMount() {
        const {mediaQuery} = this.props;
        if (mediaQuery) {
            const handler = (e: MediaQueryListEvent) => this.setState({isActive: e.matches});
            window.matchMedia(mediaQuery).addEventListener('change', handler);
        }
    }

    render() {
        const {label, width, maxWidth, margin, gutter, gap, columns} = this.props;
        if (this.state.isActive) {
            return (
                <div
                    style={{
                        width: width ?? "100%",
                        maxWidth: maxWidth ?? null,
                        margin: margin ?? "0 auto",
                        height: "100%",

                    }}
                    >
                    <div
                        style={{
                            display: "grid",
                            height: "100%",
                            boxSizing: "border-box",
                            padding: gutter ?? 0,
                            gridGap: gap ?? 0,
                            gridTemplateColumns: "repeat(" + columns +  ", 1fr)",
                            gridTemplateRows: "100%",
                        }}
                        >
                        {[...Array(columns)].map((e, index) => (
                            <div
                                style={{
                                    backgroundColor: "rgba(255,20,147,0.2)",
                                    height: "100%",
                                    display: "grid-item",
                                    color: "white",
                                    fontFamily: "sans-serif",
                                    minWidth: 0
                                }}
                                >&nbsp;{(index > 0) ? (index + 1) : label}</div>
                            )
                        )}
                    </div>
                </div>
            );
        } else {
            return '';
        }
    }
}
