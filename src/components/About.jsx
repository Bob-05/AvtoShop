import React, { useEffect } from 'react';
import '../styles/About.css';

const About = () => {
  // Функция для добавления класса для анимации при скроллинге
  useEffect(() => {
    const elements = document.querySelectorAll('.about__text');

    const handleScroll = () => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Для сразу анимации элементов, которые уже в области видимости

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="about" id="about">
      <div className="about__container">
        <h2 className="about__title">
          О нас
        </h2>

        <p className="about__text">
          Автосервис <strong>AVTOSHOP</strong> — это команда профессионалов с более чем 10-летним опытом работы.
          Мы специализируемся на ремонте и обслуживании автомобилей любой сложности. Используем только проверенные материалы и современное оборудование.
        </p>

        <p className="about__text">
          Нам важно не просто починить автомобиль, а дать вам уверенность на дороге.
          Мы ценим ваше время и предлагаем индивидуальный подход, честные цены и прозрачную работу.
        </p>
      </div>
    </section>
  );
};

export default About;
