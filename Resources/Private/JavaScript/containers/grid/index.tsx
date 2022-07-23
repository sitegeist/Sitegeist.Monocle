import * as React from "react";
import {useState, useEffect, PureComponent, Component} from 'react';

interface SubgridState {
    isActive: boolean
}

interface IGridDefinition {
    minWidth: string
    maxWidth: string
    columns: number
    width: string
    gutter: string
    offset: string
}

interface IGridConfigurationList {
    [key: string]: IGridDefinition
}

interface SubGridProps {
    name: string
    grid: IGridDefinition
}

interface GridProps {
    grids: () => IGridConfigurationList
}

class Subgrid extends Component<SubGridProps, SubgridState> {

    constructor(props: SubGridProps) {
        super(props)
        this.state = { isActive: window.matchMedia(this.createMediaQueryString()).matches };
    }

    createMediaQueryString(): string {
        const {grid} = this.props;
        const queries: string[] = [];
        if (grid.minWidth) {
            queries.push('(min-width: ' + grid.minWidth + ')');
        }
        if (grid.maxWidth) {
            queries.push('(max-width: ' + grid.maxWidth + ')');
        }
        return queries.join(' and ');
    }

    componentDidMount() {
        const handler = (e:MediaQueryListEvent) => this.setState({isActive: e.matches});
        window.matchMedia(this.createMediaQueryString()).addEventListener('change', handler);
    }

    render() {
        const {name, grid} = this.props;
        if (this.state.isActive) {
            return (
                <div style={{
                    width: grid.width,
                    height: "100%",
                    boxSizing: "content-box",
                }}
                     >
                   <div style={{
                        display: "grid",
                        color: "white",
                        opacity: "0.2",
                        height: "100%",
                        margin: grid.offset ?? 0,
                        gridGap: grid.gutter ?? 0,
                        gridTemplateColumns: "repeat(" + grid.columns +  ", 1fr)",
                        gridTemplateRows: "100%"
                    }}
                        >
                        {[...Array(grid.columns)].map((e, index) => (
                            <div
                                style={{
                                    backgroundColor: "deeppink",
                                    height: "100%",
                                    display: "grid-item",
                                }}
                                >&nbsp;{index > 0 ? index + 1 : name}</div>
                            )
                        )};
                    </div>
                </div>
            );
        } else {
            return '';
        }
    }
}

export class Grid extends PureComponent<GridProps> {
    render() {
        const { grids } = this.props;

        const subgrids: any[] = [];

        Object.entries(grids).forEach(
            (value, index) => {
                const key: string = value[0];
                const config: IGridDefinition = value[1];
                subgrids.push(<Subgrid key={key} name={key} grid={config} />);
            }
        );

        return (
            <React.Fragment>
                {subgrids}
            </React.Fragment>
        );
    }
}
