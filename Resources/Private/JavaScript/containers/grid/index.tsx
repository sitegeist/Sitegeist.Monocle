import * as React from "react";
import {useState, useEffect, PureComponent} from 'react';

import style from "./style.css";

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

interface GridProps {
    grids: () => IGridConfigurationList
}

export class Grid extends PureComponent<GridProps> {
    render() {
        const { grids } = this.props;

        Object.entries(grids).forEach(
            ([key, value]) => console.log(key, value)
        );

        return (
            <div>
                i am the grid
                {JSON.stringify(grids)}
            </div>
        );
    }
}
