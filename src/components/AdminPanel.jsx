import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    icon: '',
    description: '',
    price: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) throw new Error('Ошибка загрузки услуг');
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId 
        ? `http://localhost:5000/api/post/${editingId}`
        : 'http://localhost:5000/api/posts';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      if (!response.ok) throw new Error(editingId ? 'Ошибка обновления' : 'Ошибка добавления');
      
      const data = await response.json();
      
      if (editingId) {
        setServices(services.map(s => s.id === editingId ? data : s));
      } else {
        setServices([...services, data]);
      }
      
      setNewService({ name: '', icon: '', description: '', price: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (service) => {
    setNewService({
      name: service.name,
      icon: service.icon,
      description: service.description,
      price: service.price
    });
    setEditingId(service.id);
    setSelectedService(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту услугу?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/post/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Ошибка удаления услуги');
      
      setServices(services.filter(service => service.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setNewService({ name: '', icon: '', description: '', price: '' });
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('myProject_isAdmin');
navigate('/');
    navigate('/login');
  };

  if (isLoading) return <div className="admin-loading">Загрузка услуг...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Админ-панель AvtoShop</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          Выйти
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-content">
        <div className="admin-form-section">
          <h2 className="admin-section-title">
            {editingId ? 'Редактировать услугу' : 'Добавить новую услугу'}
          </h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleInputChange}
                placeholder="Название услуги"
                className="admin-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <input
                type="text"
                name="icon"
                value={newService.icon}
                onChange={handleInputChange}
                placeholder="Изображение или иконка"
                className="admin-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <textarea
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                placeholder="Описание услуги"
                className="admin-textarea"
                required
              />
            </div>
            <div className="admin-form-group">
              <input
                type="text"
                name="price"
                value={newService.price}
                onChange={handleInputChange}
                placeholder="Цена"
                className="admin-input"
                required
              />
            </div>
            <button type="submit" className="admin-submit-btn">
              {editingId ? 'Обновить' : 'Добавить'}
            </button>
            {editingId && (
              <button 
                type="button"
                className="admin-cancel-btn"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
            )}
          </form>
        </div>

        <div className="admin-services-section">
          <h2 className="admin-section-title">Список услуг</h2>
          <div className="admin-services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className={`admin-service-card ${selectedService === service ? 'active' : ''}`}
                onClick={() => setSelectedService(service === selectedService ? null : service)}
              >
                <div className="admin-service-header">
                   <h3 className="admin-service-name">{service.name}</h3>
                  <span className="admin-service-price">{service.price}</span>
                </div>
                
                {selectedService === service && (
// В компоненте AdminPanel.jsx замените блок admin-service-actions на:
                <div className="admin-service-actions">
                  <button 
                    className="admin-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(service);
                    }}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="admin-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(service.id);
                    }}
                  >
                    Удалить
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;