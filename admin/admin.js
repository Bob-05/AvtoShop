// ========== КОНФИГУРАЦИЯ ==========
const API_URL = 'http://localhost:5000/api';
let currentDeleteId = null;
let currentDeleteType = null;
let editingServiceId = null;

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
function checkAuth() {
    const token = localStorage.getItem('avtoshop_token');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function getToken() {
    return localStorage.getItem('avtoshop_token');
}

// ========== ВЫХОД ==========
function logout() {
    localStorage.removeItem('avtoshop_token');
    localStorage.removeItem('adminEmail');
    window.location.href = 'index.html';
}

// ========== API ЗАПРОСЫ ==========
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ========== ЗАГРУЗКА УСЛУГ ==========
async function loadServices() {
    const container = document.getElementById('adminServicesList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Загрузка услуг...</div>';
    
    const services = await apiRequest('/posts');
    
    if (!services || services.length === 0) {
        container.innerHTML = '<div class="loading">Нет услуг</div>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-item">
            <div class="service-info">
                <h3>${escapeHtml(service.name)}</h3>
                <p>${escapeHtml(service.description)}</p>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="service-price">${escapeHtml(service.price)}</span>
                <div class="service-actions">
                    <button class="btn-secondary" onclick="editService(${service.id})">Ред.</button>
                    <button class="btn-danger" onclick="confirmDelete('service', ${service.id}, '${escapeHtml(service.name)}')">Удалить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== ЗАГРУЗКА ОТЗЫВОВ ==========
async function loadReviews() {
    const container = document.getElementById('adminReviewsList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Загрузка отзывов...</div>';
    
    const reviews = await apiRequest('/reviews');
    
    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<div class="loading">Нет отзывов</div>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-info">
                <strong>${escapeHtml(review.name)}</strong>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                <p>${escapeHtml(review.text)}</p>
            </div>
            <div class="review-actions">
                <button class="btn-danger" onclick="confirmDelete('review', ${review.id}, 'отзыв от ${escapeHtml(review.name)}')">Удалить</button>
            </div>
        </div>
    `).join('');
}

// ========== ДОБАВЛЕНИЕ/РЕДАКТИРОВАНИЕ УСЛУГИ ==========
async function saveService(event) {
    event.preventDefault();
    
    const id = document.getElementById('serviceId').value;
    const name = document.getElementById('serviceName').value.trim();
    const description = document.getElementById('serviceDesc').value.trim();
    const price = document.getElementById('servicePrice').value.trim();
    
    const data = { name, description, price };
    
    let result;
    if (id) {
        result = await apiRequest(`/post/${id}`, 'PUT', data);
    } else {
        result = await apiRequest('/posts', 'POST', data);
    }
    
    if (result) {
        closeServiceModal();
        loadServices();
    } else {
        alert('Ошибка сохранения');
    }
}

async function editService(id) {
    const services = await apiRequest('/posts');
    const service = services.find(s => s.id === id);
    
    if (service) {
        editingServiceId = id;
        document.getElementById('modalTitle').textContent = 'Редактировать услугу';
        document.getElementById('serviceId').value = id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDesc').value = service.description;
        document.getElementById('servicePrice').value = service.price;
        openServiceModal();
    }
}

// ========== УДАЛЕНИЕ ==========
function confirmDelete(type, id, name) {
    currentDeleteType = type;
    currentDeleteId = id;
    
    const message = type === 'service' 
        ? `Удалить услугу "${name}"?`
        : `Удалить ${name}?`;
    
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'flex';
}

async function executeDelete() {
    if (!currentDeleteId || !currentDeleteType) return;
    
    const endpoint = currentDeleteType === 'service' 
        ? `/post/${currentDeleteId}`
        : `/reviews/${currentDeleteId}`;
    
    const result = await apiRequest(endpoint, 'DELETE');
    
    closeConfirmModal();
    
    if (result) {
        if (currentDeleteType === 'service') {
            loadServices();
        } else {
            loadReviews();
        }
    } else {
        alert('Ошибка удаления');
    }
    
    currentDeleteId = null;
    currentDeleteType = null;
}

// ========== МОДАЛКИ ==========
function openServiceModal() {
    document.getElementById('serviceModal').style.display = 'flex';
}

function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('modalTitle').textContent = 'Добавить услугу';
    editingServiceId = null;
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Страница входа
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;
            const errorDiv = document.getElementById('loginError');
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('avtoshop_token', data.token);
                    localStorage.setItem('adminEmail', email);
                    window.location.href = 'panel.html';
                } else {
                    errorDiv.textContent = data.message || 'Неверный email или пароль';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка соединения с сервером';
                errorDiv.style.display = 'block';
            }
        });
        return;
    }
    
    // Панель управления
    if (!checkAuth()) return;
    
    // Отображение email админа
    const emailDisplay = document.getElementById('adminEmailDisplay');
    if (emailDisplay) {
        emailDisplay.textContent = localStorage.getItem('adminEmail') || 'admin@avtoshop.ru';
    }
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Навигация по вкладкам
    const navItems = document.querySelectorAll('.nav-item');
    const tabs = {
        services: document.getElementById('servicesTab'),
        reviews: document.getElementById('reviewsTab')
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            Object.values(tabs).forEach(t => t?.classList.remove('active'));
            if (tabs[tab]) tabs[tab].classList.add('active');
            
            if (tab === 'services') loadServices();
            if (tab === 'reviews') loadReviews();
        });
    });
    
    // Загрузка данных
    loadServices();
    
    // Модалка услуги
    document.getElementById('openAddServiceModal')?.addEventListener('click', openServiceModal);
    document.getElementById('closeServiceModal')?.addEventListener('click', closeServiceModal);
    document.getElementById('cancelServiceModal')?.addEventListener('click', closeServiceModal);
    document.getElementById('serviceForm')?.addEventListener('submit', saveService);
    
    // Модалка подтверждения
    document.getElementById('cancelConfirm')?.addEventListener('click', closeConfirmModal);
    document.getElementById('confirmDelete')?.addEventListener('click', executeDelete);
    
    // Закрытие модалок по клику вне
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
    
    // Глобальные функции для onclick
    window.editService = editService;
    window.confirmDelete = confirmDelete;
});