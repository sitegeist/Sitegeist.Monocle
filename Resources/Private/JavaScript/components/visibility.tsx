import * as React from "react";

interface VisibilityProps {
    isVisible: boolean
}

export function visibility<P>(WrappedComponent: React.ComponentType<P>) {
    return function Wrapper(props: VisibilityProps & P) {
        return props.isVisible
            ? <WrappedComponent {...props}/>
            : null;
    }
}
