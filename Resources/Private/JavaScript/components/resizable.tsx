import * as React from "react";
import { useState } from "react";

import { Button, Icon } from '@neos-project/react-ui-components';

import style from './resizable.module.css';

interface ResizableOptions {
    initialHeight: number
    collapsedHeight: number
    isCollapsed?: boolean
    toggleHandleClassName?: string
}

export function resizable(options: ResizableOptions) {
    return function decorator<P>(WrappedComponent: React.ComponentType<P>) {
        return function Wrapper(props: P) {
            const [height, setHeight] = useState(options.initialHeight);
            const [isDragging, setIsDragging] = useState(false);
            const [isCollapsed, setIsCollapsed] = useState(options.isCollapsed);

            function startDrag() {
                if (!isCollapsed) {
                    setIsDragging(true);
                }
            }

            function drag(event: React.MouseEvent) {
                if (!isCollapsed) {
                    setHeight(window.innerHeight - event.pageY);
                }
            }

            function stopDrag() {
                if (!isCollapsed) {
                    setIsDragging(false);
                }
            }

            function toggle() {
                setIsCollapsed(!isCollapsed)
            }

            return (
                <div
                    style={{
                        height: isCollapsed
                            ? options.collapsedHeight
                            : height,
                        minHeight: options.collapsedHeight
                    }}
                    className={style.resizable}
                    >
                    {isDragging && <div
                        role="presentation"
                        className={style.overlay}
                        onMouseUp={stopDrag}
                        onMouseMove={drag}
                        />
                    }
                    <div
                        role="presentation"
                        className={style.handle}
                        onMouseDown={startDrag}
                        />
                    <Button
                        className={options.toggleHandleClassName ?? ''}
                        onClick={toggle}
                        style="clean"
                        >
                        <Icon
                            className={style.icon}
                            icon={isCollapsed ? 'chevron-up' : 'chevron-down'}
                            />
                    </Button>
                    <WrappedComponent {...props}/>
                </div>
            );
        }
    }
}
