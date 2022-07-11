import * as React from "react";
import { useState, useEffect } from 'react';

import style from "./style.css";

export function Grid() {

    const resizeListener = () => {
        console.log("resize")
    };

    useEffect(() => {
        // set resize listener
        window.addEventListener('resize', resizeListener);
        // clean up function
        return () => {
          // remove resize listener
          window.removeEventListener('resize', resizeListener);
        }
    }, [resizeListener])

    return (
        <div className={style.grid}>
            
        </div>
    );


}
