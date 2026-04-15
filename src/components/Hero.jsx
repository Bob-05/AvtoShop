import React from 'react';
import carImage from '../assets/png-clipart-sports-car-sports-car-black.png';
import '../styles/Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__title">Надёжный автосервис в Тихорецке</h1>
          <p className="hero__subtitle">
            Полное техническое обслуживание, диагностика, ремонт ходовой, КПП, электрики, замена масла и многое другое — всё в одном месте.
          </p>
          <p className="hero__details">
            📍 ул. Гражданская, 95 &nbsp;&nbsp;&nbsp; 📞 +7 (909) 452-10-10<br />
            🕗 Пн–Вс: 08:00–18:00 &nbsp;&nbsp;&nbsp; 💳 Оплата картой и наличными
          </p>
          <a href="#services" className="hero__cta-btn">Смотреть услуги</a>
        </div>
        <div className="hero__image">
          <img src={carImage} alt="Автомобиль" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
