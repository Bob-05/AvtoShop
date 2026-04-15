import React from 'react';
import '../styles/Advantages.css';  

const advantages = [
  { icon: "⭐", title: "Качество работы", description: "Высокое качество ремонта и обслуживания автомобилей." },
  { icon: "⏱️", title: "Скорость выполнения", description: "Быстрое и качественное выполнение всех услуг." },
  { icon: "💸", title: "Доступные цены", description: "Предлагаем выгодные цены на все виды ремонта и обслуживания." },
  { icon: "🔧", title: "Профессиональные мастера", description: "Работают только квалифицированные специалисты с опытом." },
];

const Advantages = () => {
  return (
    <section className="advantages" id="advantages">
      <div className="advantages__container">
        <h2 className="advantages__title">Наши Преимущества</h2>
        <div className="advantages__grid">
          {advantages.map((advantage, index) => (
            <div key={index} className="advantage__card">
              <div className="advantage__icon">{advantage.icon}</div>
              <h3 className="advantage__title">{advantage.title}</h3>
              <p className="advantage__description">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
