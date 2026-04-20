// ========== КОНФИГУРАЦИЯ API ==========
const API_URL = 'http://localhost:5000/api';

// Глобальные переменные
let allServices = [];
let currentIndex = 0;
const itemsPerPage = 4;

// DOM элементы
const gridContainer = document.getElementById('servicesGrid');
const prevBtn = document.getElementById('prevServiceBtn');
const nextBtn = document.getElementById('nextServiceBtn');
const reviewsWrapper = document.getElementById('reviewsWrapper');
const reviewsCarousel = document.getElementById('reviewsCarousel');
const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
const reviewsNextBtn = document.getElementById('reviewsNextBtn');
const reviewModal = document.getElementById('reviewModal');
const openReviewBtn = document.getElementById('openReviewModal');
const closeReviewBtn = document.getElementById('closeReviewModal');
const starWidget = document.getElementById('starWidget');

let reviewIndex = 0;
let reviewsPerPage = 3;
let currentRating = 5;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

function escapeHtml(str) { 
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderServices() {
    if (!gridContainer) return;
    
    const visible = allServices.slice(currentIndex, currentIndex + itemsPerPage);
    gridContainer.innerHTML = '';
    
    visible.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">🔧</div>
            <h3 class="card-title">${escapeHtml(s.name)}</h3>
            <p class="card-desc">${escapeHtml(s.description)}</p>
            <div class="card-meta">${escapeHtml(s.price)}</div>
        `;
        gridContainer.appendChild(card);
    });
    
    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex + itemsPerPage >= allServices.length ? '0.4' : '1';
}

function updateReviewsPerPage() {
    if (window.innerWidth <= 600) reviewsPerPage = 1;
    else if (window.innerWidth <= 900) reviewsPerPage = 2;
    else reviewsPerPage = 3;
}

function renderReviews() {
    if (!reviewsWrapper || !reviewsCarousel) return;
    
    const total = reviewsWrapper.children.length;
    const maxIndex = Math.max(0, total - reviewsPerPage);
    if (reviewIndex > maxIndex) reviewIndex = maxIndex;
    if (reviewIndex < 0) reviewIndex = 0;
    
    const offset = reviewIndex * (100 / reviewsPerPage);
    reviewsCarousel.style.transform = `translateX(-${offset}%)`;
    
    if (reviewsPrevBtn) reviewsPrevBtn.style.opacity = reviewIndex === 0 ? '0.4' : '1';
    if (reviewsNextBtn) reviewsNextBtn.style.opacity = reviewIndex >= maxIndex ? '0.4' : '1';
}

// ========== API ФУНКЦИИ ==========

async function loadServicesFromServer() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const services = await response.json();
        allServices = services;
        renderServices();
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
    }
}

async function loadReviewsFromServer() {
    try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const reviews = await response.json();
        
        if (reviewsWrapper) {
            reviewsWrapper.innerHTML = '';
            reviews.forEach(review => {
                const div = document.createElement('div');
                div.className = 'review-item';
                div.innerHTML = `
                    <div class="review-name">${escapeHtml(review.name)}</div>
                    <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    <div class="review-text">${escapeHtml(review.text)}</div>
                `;
                reviewsWrapper.appendChild(div);
            });
            updateReviewsPerPage();
            renderReviews();
        }
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

async function sendReview(name, text, rating) {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, text, rating })
        });
        if (!response.ok) throw new Error('Ошибка отправки');
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
        return null;
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

loadServicesFromServer();
loadReviewsFromServer();

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Карусель услуг
if (prevBtn) {
    prevBtn.addEventListener('click', () => { 
        if (currentIndex - itemsPerPage >= 0) { 
            currentIndex -= itemsPerPage; 
            renderServices(); 
        } 
    });
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => { 
        if (currentIndex + itemsPerPage < allServices.length) { 
            currentIndex += itemsPerPage; 
            renderServices(); 
        } 
    });
}

// Карусель отзывов
if (reviewsPrevBtn) {
    reviewsPrevBtn.addEventListener('click', () => {
        if (reviewIndex > 0) { reviewIndex--; renderReviews(); }
    });
}
if (reviewsNextBtn) {
    reviewsNextBtn.addEventListener('click', () => {
        const total = reviewsWrapper ? reviewsWrapper.children.length : 0;
        if (reviewIndex < total - reviewsPerPage) { reviewIndex++; renderReviews(); }
    });
}

window.addEventListener('resize', () => {
    updateReviewsPerPage();
    renderReviews();
});

// Модалка отзыва
if (openReviewBtn) openReviewBtn.onclick = () => reviewModal.style.display = 'flex';
if (closeReviewBtn) closeReviewBtn.onclick = () => reviewModal.style.display = 'none';

// Закрытие модалки по клику вне
window.onclick = (e) => { 
    if (e.target === reviewModal) reviewModal.style.display = 'none'; 
};

// Звезды рейтинга
if (starWidget) {
    starWidget.addEventListener('click', () => {
        let val = prompt('Оценка от 1 до 5:', currentRating);
        if (val && !isNaN(val) && val >= 1 && val <= 5) {
            currentRating = parseInt(val);
            starWidget.textContent = '★'.repeat(currentRating) + '☆'.repeat(5 - currentRating);
            document.getElementById('ratingValue').value = currentRating;
        }
    });
}

// Отправка отзыва
document.getElementById('reviewForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = parseInt(document.getElementById('ratingValue').value) || 5;
    
    if (!name || !text) return alert('Заполните все поля');
    
    const result = await sendReview(name, text, rating);
    if (result) {
        reviewModal.style.display = 'none';
        document.getElementById('reviewForm').reset();
        document.getElementById('ratingValue').value = 5;
        if (starWidget) starWidget.textContent = '★★★★★';
        alert('Спасибо за отзыв!');
        loadReviewsFromServer();
    } else {
        alert('Ошибка отправки');
    }
});

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) { 
            e.preventDefault(); 
            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
    });
});