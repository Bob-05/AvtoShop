const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

let allServices = [];
let currentIndex = 0;
const itemsPerPage = 4;
let cachedReviews = null;

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
const ratingValueInput = document.getElementById('ratingValue');
let currentRating = 5;

function updateStarsDisplay(rating) {
    if (starWidget) {
        starWidget.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }
    if (ratingValueInput) {
        ratingValueInput.value = rating;
    }
    currentRating = rating;
}

if (starWidget) {
    starWidget.style.cursor = 'pointer';
    starWidget.style.display = 'inline-block';
    starWidget.style.letterSpacing = '4px';
    
    starWidget.addEventListener('click', (e) => {
        const rect = starWidget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const starWidth = rect.width / 5;
        const selectedStar = Math.floor(clickX / starWidth) + 1;
        if (selectedStar >= 1 && selectedStar <= 5) {
            updateStarsDisplay(selectedStar);
        }
    });
    
    starWidget.addEventListener('mousemove', (e) => {
        const rect = starWidget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const starWidth = rect.width / 5;
        const hoverStar = Math.floor(clickX / starWidth) + 1;
        if (hoverStar >= 1 && hoverStar <= 5) {
            starWidget.style.opacity = '0.8';
            starWidget.textContent = '★'.repeat(hoverStar) + '☆'.repeat(5 - hoverStar);
        }
    });
    
    starWidget.addEventListener('mouseleave', () => {
        starWidget.style.opacity = '1';
        updateStarsDisplay(currentRating);
    });
}

updateStarsDisplay(5);

let reviewIndex = 0;
let reviewsPerPage = 3;

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderServices() {
    if (!gridContainer) return;
    if (!allServices || allServices.length === 0) {
        gridContainer.innerHTML = '<div class="loading">Услуги не найдены</div>';
        return;
    }
    const visible = allServices.slice(currentIndex, currentIndex + itemsPerPage);
    gridContainer.innerHTML = '';
    
    visible.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        let iconHtml = '';
        if (s.icon_url && s.icon_url !== '') {
            iconHtml = `<img src="${SERVER_URL}${s.icon_url}" alt="${escapeHtml(s.name)}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'card-icon-emoji\'>🔧</div>'">`;
        } else {
            iconHtml = '<div class="card-icon-emoji">🔧</div>';
        }
        card.innerHTML = `
            <div class="card-icon">
                ${iconHtml}
            </div>
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
    
    let offset = 0;
    if (total > 0 && reviewsPerPage > 0) {
        offset = reviewIndex * (100 / reviewsPerPage);
    }
    reviewsCarousel.style.transform = `translateX(-${offset}%)`;
    
    if (reviewsPrevBtn) {
        if (total <= reviewsPerPage) {
            reviewsPrevBtn.style.display = 'none';
            reviewsNextBtn.style.display = 'none';
        } else {
            reviewsPrevBtn.style.display = 'flex';
            reviewsNextBtn.style.display = 'flex';
            reviewsPrevBtn.style.opacity = reviewIndex === 0 ? '0.4' : '1';
            reviewsNextBtn.style.opacity = reviewIndex >= maxIndex ? '0.4' : '1';
        }
    }
}

async function loadServicesFromServer() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const services = await response.json();
        
        if (!services || !Array.isArray(services)) {
            throw new Error('Некорректный ответ сервера');
        }
        
        allServices = services;
        renderServices();
        
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
        showToast('❌ Ошибка загрузки услуг: ' + error.message, 'error');
        
        if (gridContainer) {
            gridContainer.innerHTML = '<div class="loading">❌ Ошибка загрузки услуг. Проверьте соединение с сервером.</div>';
        }
    }
}

async function loadReviewsFromServer(forceRefresh = false) {
    if (!forceRefresh && cachedReviews) {
        renderReviewsToDOM(cachedReviews);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/reviews`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const reviews = await response.json();
        
        if (!reviews || !Array.isArray(reviews)) {
            throw new Error('Некорректный ответ сервера');
        }
        
        cachedReviews = reviews;
        renderReviewsToDOM(reviews);
        
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        showToast('❌ Ошибка загрузки отзывов: ' + error.message, 'error');
        
        if (reviewsWrapper) {
            reviewsWrapper.innerHTML = '<div class="loading">❌ Ошибка загрузки отзывов. Проверьте соединение с сервером.</div>';
            updateReviewsPerPage();
            renderReviews();
        }
    }
}

function renderReviewsToDOM(reviews) {
    if (!reviewsWrapper) return;
    
    if (!reviews || reviews.length === 0) {
        reviewsWrapper.innerHTML = '<div class="loading">⭐ Нет отзывов. Будьте первым!</div>';
        updateReviewsPerPage();
        renderReviews();
        return;
    }
    
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

async function sendReview(name, text, rating) {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, text, rating })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        showToast('✅ Спасибо за ваш отзыв!', 'success');
        return await response.json();
        
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
        showToast('❌ Ошибка отправки: ' + error.message, 'error');
        return null;
    }
}

if (gridContainer) loadServicesFromServer();
if (reviewsWrapper) loadReviewsFromServer();

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

if (reviewsPrevBtn) {
    reviewsPrevBtn.addEventListener('click', () => {
        if (reviewIndex > 0) {
            reviewIndex--;
            renderReviews();
        }
    });
}

if (reviewsNextBtn) {
    reviewsNextBtn.addEventListener('click', () => {
        const total = reviewsWrapper ? reviewsWrapper.children.length : 0;
        if (reviewIndex < total - reviewsPerPage) {
            reviewIndex++;
            renderReviews();
        }
    });
}

window.addEventListener('resize', () => {
    updateReviewsPerPage();
    renderReviews();
});

if (openReviewBtn) openReviewBtn.onclick = () => reviewModal.style.display = 'flex';
if (closeReviewBtn) closeReviewBtn.onclick = () => reviewModal.style.display = 'none';

window.onclick = (e) => {
    if (e.target === reviewModal) reviewModal.style.display = 'none';
};

if (starWidget) {
    starWidget.addEventListener('click', () => {
        let val = prompt('Оценка от 1 до 5:', currentRating);
        if (val && !isNaN(val) && val >= 1 && val <= 5) {
            currentRating = parseInt(val);
            starWidget.textContent = '★'.repeat(currentRating) + '☆'.repeat(5 - currentRating);
            const ratingValue = document.getElementById('ratingValue');
            if (ratingValue) ratingValue.value = currentRating;
        }
    });
}

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewName')?.value.trim();
        const text = document.getElementById('reviewText')?.value.trim();
        const rating = parseInt(document.getElementById('ratingValue')?.value) || 5;
        if (!name || !text) {
            showToast('⚠️ Заполните все поля', 'error');
            return;
        }
        const result = await sendReview(name, text, rating);
        if (result) {
            if (reviewModal) reviewModal.style.display = 'none';
            reviewForm.reset();
            updateStarsDisplay(5);
            cachedReviews = null;
            loadReviewsFromServer(true);
        }
    });
}

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