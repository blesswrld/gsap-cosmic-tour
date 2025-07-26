import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { planetsData } from "./data/planets";
import StarryBackground from "./components/StarryBackground/StarryBackground";
import PlanetViewport from "./components/PlanetViewport/PlanetViewport";
import HeroSection from "./components/HeroSection/HeroSection";
import PlanetSection from "./components/PlanetSection/PlanetSection";

// --- Регистрация плагина GSAP ---
// Это обязательный шаг. Мы сообщаем GSAP, что собираемся использовать плагин ScrollTrigger.
gsap.registerPlugin(ScrollTrigger);

// --- Главный компонент приложения ---
function App() {
    // --- СОСТОЯНИЕ (STATE) ---
    // Используем useState для хранения пути к текущей иконке планеты.
    // Когда это состояние меняется (через setCurrentPlanetImage), React перерисовывает компонент PlanetViewport с новой картинкой.
    const [currentPlanetImage, setCurrentPlanetImage] = useState(
        planetsData[0].image // Начальное значение - иконка первой планеты.
    );

    // --- ССЫЛКИ (REFS) ---
    // Используем useRef для получения прямого доступа к DOM-элементам, чтобы GSAP мог их анимировать.
    const planetImageRef = useRef(null); // Ссылка на <img> с иконкой планеты.
    const appRef = useRef(null); // Ссылка на главный контейнер всего приложения.

    // useEffect запускает этот код один раз после того, как компонент будет отрисован в DOM.
    // Пустой массив зависимостей `[]` гарантирует, что эффект сработает только один раз.
    useEffect(() => {
        // gsap.context - лучшая практика для GSAP в React. Он "собирает" все созданные внутри него анимации
        // и позволяет легко их очистить при размонтировании компонента, предотвращая утечки памяти.
        const ctx = gsap.context(() => {
            // --- Анимация 1: Параллакс для фона ---
            // Анимируем позицию фона по мере скролла всей страницы.
            gsap.to(".starry-background", {
                backgroundPosition: "0% 100%",
                ease: "none", // Линейная анимация, без ускорений.
                scrollTrigger: {
                    trigger: appRef.current, // Триггер - весь контейнер приложения.
                    start: "top top", // Начать, когда верх триггера коснется верха экрана.
                    end: "bottom bottom", // Закончить, когда низ триггера коснется низа экрана.
                    scrub: 1.5, // "Втирает" анимацию в скролл. Делает ее плавной и зависимой от скорости скролла.
                },
            });

            // --- Анимации 2 и 3: Для каждой секции с планетой ---
            // Собираем все секции в массив, чтобы применить к каждой из них свою анимацию.
            const sections = gsap.utils.toArray(".planet-section-wrapper");

            sections.forEach((section, index) => {
                // Изначально скрываем инфо-блок через GSAP.
                // Это позволяет избежать "мигания" контента при загрузке.
                gsap.set(section.querySelector(".planet-info"), {
                    opacity: 0,
                    y: 50, // Сдвигаем его на 50px вниз.
                });

                // Анимация появления инфо-блока.
                gsap.to(section.querySelector(".planet-info"), {
                    opacity: 1, // Делаем видимым.
                    y: 0, // Возвращаем на исходную позицию.
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 60%", // Начать, когда верх секции достигнет 60% высоты экрана.
                        end: "bottom center",
                        // Анимация проигрывается вперед при входе в зону и назад при выходе.
                        toggleActions: "play reverse play reverse",
                    },
                });

                // Триггер для смены иконки планеты.
                ScrollTrigger.create({
                    trigger: section,
                    start: "top center", // Срабатывает, когда верх секции доходит до центра экрана.
                    end: "bottom center",
                    // Функция, которая вызывается, когда секция входит в активную зону или выходит из нее.
                    onToggle: (self) => {
                        // Ключевое условие: запускаем анимацию, только если триггер активен (self.isActive)
                        // и текущая иконка в DOM - это НЕ та, которая нам нужна для этой секции.
                        // Это предотвращает лишние запуски анимации при скролле вверх-вниз в пределах одной секции.
                        if (
                            self.isActive &&
                            planetImageRef.current.src.includes(
                                planetsData[index].image
                            ) === false
                        ) {
                            // Анимация исчезновения старой иконки
                            gsap.to(planetImageRef.current, {
                                opacity: 0,
                                y: -50,
                                duration: 0.4,
                                ease: "power2.in",
                                // Эта функция выполнится ПОСЛЕ того, как старая иконка полностью исчезнет.
                                onComplete: () => {
                                    // Обновляем состояние React. Это вызывает смену src у тега <img>.
                                    setCurrentPlanetImage(
                                        planetsData[index].image
                                    );
                                    // Анимируем появление новой иконки (которая уже в DOM благодаря смене state).
                                    gsap.fromTo(
                                        planetImageRef.current,
                                        { opacity: 0, y: 50 }, // Начальное состояние (прозрачная, снизу).
                                        {
                                            opacity: 1,
                                            y: 0,
                                            duration: 0.6,
                                            ease: "power2.out",
                                        } // Конечное состояние.
                                    );
                                },
                            });
                        }
                    },
                });
            });
        }, appRef); // Привязываем контекст к главному контейнеру.

        // Функция очистки. Вызовется, когда компонент будет удален со страницы.
        // Она отменяет все анимации, созданные внутри контекста.
        return () => ctx.revert();
    }, []);

    return (
        <div ref={appRef}>
            {/* Рендерим компоненты, передавая им нужные props и refs */}
            <StarryBackground />
            <PlanetViewport
                ref={planetImageRef}
                imageUrl={currentPlanetImage}
            />

            <main>
                <HeroSection
                    title="Космический тур"
                    subtitle="Скролльте, чтобы начать путешествие"
                    showArrow={true} // Передаем prop, чтобы показать анимированную стрелку.
                />

                {/* Динамически создаем секции для каждой планеты из нашего массива данных */}
                {planetsData.map((planet, index) => (
                    // Оборачиваем каждую секцию в div. GSAP будет искать именно этот div по классу.
                    <div key={planet.id} className="planet-section-wrapper">
                        <PlanetSection
                            planet={planet}
                            // Чередуем выравнивание текста слева и справа для разнообразия.
                            align={index % 2 === 0 ? "left" : "right"}
                        />
                    </div>
                ))}

                <HeroSection
                    title="Конец пути"
                    subtitle="Надеемся, вам понравилось."
                    // Здесь prop `showArrow` не передается, поэтому стрелки не будет.
                />
            </main>
        </div>
    );
}

export default App;
