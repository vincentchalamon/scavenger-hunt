"use client";

import React, {PropsWithChildren} from "react";
import styles from "./ZoomableFrame.module.css";

export const ZoomableFrame: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <div className={styles.zoomableFrame}>
      {children}
    </div>
  );
};
