import { useEffect, useState } from 'react';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Проверяем наличие токена при загрузке
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = () => {
    if (isLoggedIn) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Обработчик для логотипа
  const handleLogoClick = () => {
    navigate('/'); // Переход на главную страницу
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header__content">
        <div className="header__logo" onClick={handleLogoClick}>
          <span>AvtoShop</span>
        </div>

        <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
          <a href="#services">Услуги</a>
          <a href="#advantages">Преимущества</a>
          <a href="#about">О нас</a>
          <a href="#reviews">Отзывы</a>
          <a href="#contact">Контакты</a>
          <a href="/login">Вход</a>
          {/* {isLoggedIn ? (
            <>
              <button className="admin-btn" onClick={handleAdminClick}>Админ-панель</button>
              <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <a href="/login">Вход</a>
          )} */}
        </nav>

        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </header>
  );
}
