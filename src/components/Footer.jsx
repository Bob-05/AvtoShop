import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section footer__brand">
          <h2>AvtoShop</h2>
          <p>Надёжный автосервис в Тихорецке с гарантией качества и индивидуальным подходом.</p>
        </div>

        <div className="footer__section">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#services">Услуги</a></li>
            <li><a href="#advantages">Преимущества</a></li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#reviews">Отзывы</a></li>
            <li><a href="#contact">Контакты</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4>Контакты</h4>
          <ul>
            <li>г. Тихорецк, ул. Гражданская, 95</li>
            <li>+7 (999) 123-45-67</li>
            <li>avtoshop@example.com</li>
          </ul>
        </div>

      
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} AvtoShop. Все права защищены.</p>
      </div>
    </footer>
  );
}
