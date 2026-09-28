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
    matchMediaWindow?: Window
}

export class Grid extends Component<IGridDefinition, GridState> {
    private mediaQueryList?: MediaQueryList;
    private mediaQueryHandler?: (e: MediaQueryListEvent) => void;

    constructor(props: IGridDefinition) {
        super(props)
        const {mediaQuery} = this.props;
        const matchMediaWindow = this.props.matchMediaWindow ?? window;
        if (props.mediaQuery) {
            this.state = {isActive: matchMediaWindow.matchMedia(mediaQuery).matches};
        } else {
            this.state = {isActive: true};
        }
    }

    componentDidMount() {
        const {mediaQuery} = this.props;
        const matchMediaWindow = this.props.matchMediaWindow ?? window;
        if (mediaQuery) {
            this.mediaQueryHandler = (e: MediaQueryListEvent) => this.setState({isActive: e.matches});
            this.mediaQueryList = matchMediaWindow.matchMedia(mediaQuery);
            this.mediaQueryList.addEventListener('change', this.mediaQueryHandler);
        }
    }

    componentWillUnmount() {
        if (this.mediaQueryList && this.mediaQueryHandler) {
            this.mediaQueryList.removeEventListener('change', this.mediaQueryHandler);
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
