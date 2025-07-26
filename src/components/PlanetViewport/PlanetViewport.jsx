import React from "react";
import styles from "./PlanetViewport.module.css";

const PlanetViewport = React.forwardRef(({ imageUrl }, ref) => {
    return (
        <div className={styles.planetViewport}>
            <img
                ref={ref}
                src={imageUrl}
                alt="Planet Icon"
                className={styles.planetImage}
            />
        </div>
    );
});

export default PlanetViewport;
