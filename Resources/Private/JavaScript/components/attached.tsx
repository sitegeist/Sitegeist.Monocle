import * as React from "react";
import cx from "classnames";

import style from "./attached.css";

type Alignment = 'centered' | 'right' | 'left';

export function attached(alignment: Alignment = 'centered') {
    return function decorator<P>(WrappedComponent: React.ComponentType<P>) {
        return function Wrapper(props: P) {
            return (
                <div
                    className={cx(
                        style.attached,
                        style[`attached--${alignment}`]
                    )}
                    >
                    <WrappedComponent {...props}/>
                </div>
            );
        }
    }
}

