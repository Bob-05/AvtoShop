import React, { useState, useEffect } from 'react';
import '../styles/Services.css';
import wrenchIcon from '../assets/wrenchs_4273441.png'; 

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки услуг');
        }

        const data = await response.json();
        setServices(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleClick = (service) => {
    setSelectedService(service === selectedService ? null : service);
  };

  if (isLoading) {
    return <div className="loading">Загрузка услуг...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="services" id="services">
      <div className="services__container">
        <h2 className="services__title">Наши услуги</h2>
        <div className="services__grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service__card ${selectedService === service ? 'expanded' : ''}`}
              onClick={() => handleClick(service)}
            >
              <div className="service__icon">
                <img src={wrenchIcon} alt={service.name} />
              </div>
              <h3 className="service__name">{service.name}</h3>

              {selectedService === service && (
                <div className="service__details">
                  <p><strong>Описание:</strong> {service.description}</p>
                  <p><strong>Цена:</strong> {service.price}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
