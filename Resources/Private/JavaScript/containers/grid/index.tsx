import { useState, useEffect } from 'react';

import style from "./style.css";

export function Grid() {

    const resizeListener = () => {
        console.log("resize")
    };

    useEffect(() => {
        resizeListener,
        // set resize listener
        window.addEventListener('resize', resizeListener);
        // clean up function
        return () => {
          // remove resize listener
          window.removeEventListener('resize', resizeListener);
        }
    }, [])

    return (
        <div className={style.main}>{"This is the Grid component"}</div>
    );
}
