import React, {PureComponent} from 'react';
import {withState, withHandlers} from 'recompose';
import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './resizable.css';

export default ({initialHeight, collapsedHeight, isCollapsed = false, toggleHandleClassName = ''}) => Component =>

@withState('height', 'setHeight', initialHeight)
@withState('isDragging', 'setIsDragging', false)
@withState('isCollapsed', 'setIsCollapsed', isCollapsed)
@withHandlers({
    startDrag: ({setIsDragging, isCollapsed}) => () => !isCollapsed && setIsDragging(true),
    drag: ({setHeight, isCollapsed}) => event => !isCollapsed && setHeight(window.innerHeight - event.pageY),
    stopDrag: ({setIsDragging, isCollapsed}) => () => !isCollapsed && setIsDragging(false),
    toggle: ({setIsCollapsed, isCollapsed}) => () => setIsCollapsed(!isCollapsed)
})
class extends PureComponent {
    render() {
        const {height, isDragging, isCollapsed, startDrag, drag, stopDrag, toggle, ...props} = this.props;

        return (
            <div
                style={{height: isCollapsed ? collapsedHeight : height, minHeight: collapsedHeight}}
                className={style.resizable}
                >
                {isDragging && <div className={style.overlay} onMouseUp={stopDrag} onMouseMove={drag}/>}
                <div className={style.handle} onMouseDown={startDrag}/>
                <Button className={toggleHandleClassName} onClick={toggle}>
                    <Icon icon={isCollapsed ? 'chevron-up' : 'chevron-down'}/>
                </Button>
                <Component {...props}/>
            </div>
        );
    }
}
