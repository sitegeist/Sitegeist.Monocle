import * as React from "react";
import {PureComponent, Component} from 'react';

interface SubgridState {
    isActive: boolean
}

interface IGridDefinition {
    mediaQuery: string
    label: string
    columns: number
    width: string
    maxWidth: string
    gutter: string
    gap: string
    margin: string
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
        const {grid} = props;
        if (grid.mediaQuery) {
            this.state = {isActive: window.matchMedia(grid.mediaQuery).matches};
        } else {
            this.state = {isActive: true};
        }
    }

    componentDidMount() {
        const {grid} = this.props;
        if (grid.mediaQuery) {
            const handler = (e: MediaQueryListEvent) => this.setState({isActive: e.matches});
            window.matchMedia(grid.mediaQuery).addEventListener('change', handler);
        }
    }

    render() {
        const {name, grid} = this.props;
        if (this.state.isActive) {
            return (
                <div
                    style={{
                        width: grid.width,
                        maxWidth: grid.maxWidth ?? null,
                        margin: grid.margin ?? "0 auto",
                        height: "100%",
                        opacity: "0.2",
                    }}
                    >
                    <div
                        style={{
                            display: "grid",
                            height: "100%",
                            boxSizing: "border-box",
                            padding: grid.gutter ?? 0,
                            gridGap: grid.gap ?? 0,
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
                                    color: "white",
                                    fontFamily: "sans-serif",
                                    minWidth: 0
                                }}
                                >&nbsp;{(index > 0) ? (index + 1) : (grid.label ?? name)}</div>
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
