import React from "react";
import styles from "./PlanetSection.module.css";

const PlanetSection = ({ planet, align }) => {
    // Класс для выравнивания текста
    const alignmentClass = align === "left" ? styles.left : styles.right;

    return (
        <section className={`${styles.planetSection} ${alignmentClass}`}>
            <div className={styles.planetInfo}>
                <h2>{planet.name}</h2>
                <p>{planet.description}</p>
            </div>
        </section>
    );
};

export default PlanetSection;
