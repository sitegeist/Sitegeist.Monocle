import * as React from "react";

import style from "./outside.module.css";

interface OutsideProps {
    onClickOutside?: () => void
}

export function outside<P>(WrappedComponent: React.ComponentType<P>) {
    return function Wrapper(props: OutsideProps & P) {
        return (
            <div>
                <div
                    role="presentation"
                    className={style.outside}
                    onClick={props.onClickOutside}
                    />
                <div className={style.inside}>
                    <WrappedComponent {...props}/>
                </div>
            </div>
        );
    }
}
