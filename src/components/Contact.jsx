import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact__container">
        <h2 className="contact__title">Контакты</h2>
        
        <div className="contact__info">
          <div className="contact__address">
            <h3>Адрес:</h3>
            <p>Гражданская ул., 95, Тихорецк</p>
          </div>
          
          <div className="contact__phone">
            <h3>Контактные телефоны:</h3>
            <p><strong>СТО:</strong> <a href="tel:+79094521010">+7 (909) 452-10-10</a></p>
            <p><strong>Магазин:</strong> <a href="tel:+79182309777">+7 (918) 230-97-77</a></p>
          </div>
        </div>

        {/* Вставка карты с точкой */}
        <div className="contact__map">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=40.130395%2C45.870130&pt=40.130395%2C45.870130&z=17&l=map"
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: '0' }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
       </div>
      </div>
    </section>
  );
};

export default Contact;
