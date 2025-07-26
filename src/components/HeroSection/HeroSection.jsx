import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./HeroSection.module.css";

const HeroSection = ({ title, subtitle, showArrow = false }) => {
    const arrowRef = useRef(null);

    // Этот useEffect сработает только для компонента, где showArrow === true
    useEffect(() => {
        if (showArrow) {
            // Бесконечная плавная анимация "дыхания" или "покачивания"
            gsap.to(arrowRef.current, {
                y: 20, // Насколько сдвинется вниз
                duration: 1.2, // Длительность одного цикла
                ease: "power1.inOut", // Плавность анимации
                repeat: -1, // Бесконечное повторение
                yoyo: true, // Возвращаться в исходное положение
            });
        }
    }, [showArrow]);

    return (
        <section className={styles.heroSection}>
            <h1>{title}</h1>
            <p>{subtitle}</p>

            {/* Условный рендеринг: показываем стрелку только если showArrow === true */}
            {showArrow && (
                <div ref={arrowRef} className={styles.scrollArrow}>
                    <IoIosArrowDown />
                </div>
            )}
        </section>
    );
};

export default HeroSection;
