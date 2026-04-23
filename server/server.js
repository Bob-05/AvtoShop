const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const ServiceModel = require('./models/serviceModel');
const ReviewModel = require('./models/reviewModel');
const AdminModel = require('./models/adminModel');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Папка для иконок:', path.join(__dirname, 'uploads'));

// =============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ОПТИМИЗАЦИЯ)
// =============================================

/**
 * Единая обработка ошибок
 * @param {Object} res - объект ответа Express
 * @param {Error} error - объект ошибки
 * @param {string} message - сообщение для пользователя
 */
function handleError(res, error, message = 'Ошибка сервера') {
    console.error(`[ERROR] ${new Date().toISOString()}:`, error.message || error);
    res.status(500).json({ 
        success: false, 
        message 
    });
}

/**
 * Проверка обязательных полей в запросе
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Array} fields - массив обязательных полей
 * @returns {boolean} - true если все поля валидны
 */
function validateRequired(req, res, fields) {
    for (const field of fields) {
        if (!req.body[field] && req.body[field] !== 0) {
            res.status(400).json({ 
                success: false, 
                message: `Поле ${field} обязательно` 
            });
            return false;
        }
    }
    return true;
}

/**
 * Единый формат успешного ответа
 * @param {Object} res - объект ответа Express
 * @param {number} statusCode - HTTP статус
 * @param {Object} data - данные для отправки
 */
function sendSuccess(res, statusCode, data) {
    res.status(statusCode).json({
        success: true,
        ...data
    });
}

// =============================================
// API ЭНДПОИНТЫ
// =============================================

// ---------- АВТОРИЗАЦИЯ ----------
/**
 * POST /api/login
 * Авторизация администратора
 * @body {string} email - Email администратора
 * @body {string} password - Пароль
 * @returns {Object} { success, token, message }
 */
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email и пароль обязательны' 
        });
    }

    try {
        const admin = await AdminModel.findByEmail(email);
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный email или пароль' 
            });
        }

        const isValid = await bcrypt.compare(password, admin.password_hash);
        
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный email или пароль' 
            });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        sendSuccess(res, 200, { 
            token, 
            message: 'Вход выполнен успешно' 
        });
    } catch (error) {
        handleError(res, error, 'Ошибка сервера при авторизации');
    }
});

// ---------- УСЛУГИ (ПУБЛИЧНЫЕ) ----------
/**
 * GET /api/posts
 * Получить все услуги (только нужные поля для публичной части)
 * @returns {Array} Массив услуг с полями id, name, description, price, icon_url
 */
app.get('/api/posts', async (req, res) => {
    try {
        const services = await ServiceModel.findAllPublic();
        res.json(services);
    } catch (error) {
        handleError(res, error, 'Ошибка загрузки услуг');
    }
});

// ---------- УСЛУГИ (ЗАЩИЩЁННЫЕ) ----------
/**
 * POST /api/posts
 * Добавить новую услугу (требует JWT-токен администратора)
 * @body {string} name - Название услуги
 * @body {string} description - Описание
 * @body {string} price - Цена
 * @body {string} [icon] - URL иконки (опционально)
 * @returns {Object} Созданная услуга (без лишнего SELECT)
 */
app.post('/api/posts', authenticateToken, async (req, res) => {
    if (!validateRequired(req, res, ['name', 'description', 'price'])) return;
    
    const { name, icon, description, price } = req.body;

    try {
        const id = await ServiceModel.create(name, description, price, icon || null);
        
        // ✅ ОПТИМИЗАЦИЯ: возвращаем данные без дополнительного SELECT к БД
        sendSuccess(res, 201, {
            id,
            name,
            description,
            price,
            icon_url: icon || null,
            message: 'Услуга успешно добавлена'
        });
    } catch (error) {
        handleError(res, error, 'Ошибка добавления услуги');
    }
});

/**
 * PUT /api/post/:id
 * Обновить существующую услугу (требует JWT-токен администратора)
 * @param {number} id - ID услуги
 * @body {string} name - Название услуги
 * @body {string} description - Описание
 * @body {string} price - Цена
 * @body {string} [icon] - URL иконки (опционально)
 * @returns {Object} Результат обновления
 */
app.put('/api/post/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    if (!validateRequired(req, res, ['name', 'description', 'price'])) return;
    
    const { name, icon, description, price } = req.body;

    try {
        const updated = await ServiceModel.update(id, name, description, price, icon || null);
        
        if (!updated) {
            return res.status(404).json({ 
                success: false,
                message: 'Услуга не найдена' 
            });
        }

        // ✅ ОПТИМИЗАЦИЯ: возвращаем результат без дополнительного SELECT
        sendSuccess(res, 200, {
            id: parseInt(id),
            name,
            description,
            price,
            icon_url: icon || null,
            message: 'Услуга успешно обновлена'
        });
    } catch (error) {
        handleError(res, error, 'Ошибка обновления услуги');
    }
});

/**
 * DELETE /api/post/:id
 * Удалить услугу (требует JWT-токен администратора)
 * @param {number} id - ID услуги
 * @returns {Object} Результат удаления
 */
app.delete('/api/post/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ServiceModel.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false,
                message: 'Услуга не найдена' 
            });
        }

        sendSuccess(res, 200, { 
            message: 'Услуга успешно удалена' 
        });
    } catch (error) {
        handleError(res, error, 'Ошибка удаления услуги');
    }
});

// ---------- ОТЗЫВЫ (ПУБЛИЧНЫЕ) ----------
/**
 * GET /api/reviews
 * Получить все отзывы
 * @returns {Array} Массив отзывов
 */
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await ReviewModel.findAll();
        res.json(reviews);
    } catch (error) {
        handleError(res, error, 'Ошибка загрузки отзывов');
    }
});

/**
 * POST /api/reviews
 * Добавить новый отзыв (публичный доступ)
 * @body {string} name - Имя автора
 * @body {string} text - Текст отзыва
 * @body {number} rating - Оценка от 1 до 5
 * @returns {Object} Созданный отзыв
 */
app.post('/api/reviews', async (req, res) => {
    if (!validateRequired(req, res, ['name', 'text', 'rating'])) return;
    
    const { name, text, rating } = req.body;
    
    // Дополнительная валидация рейтинга
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
            success: false, 
            message: 'Рейтинг должен быть от 1 до 5' 
        });
    }

    try {
        const id = await ReviewModel.create(name, text, rating);
        
        sendSuccess(res, 201, { 
            id, 
            name, 
            text, 
            rating, 
            message: 'Отзыв успешно добавлен' 
        });
    } catch (error) {
        handleError(res, error, 'Ошибка добавления отзыва');
    }
});

/**
 * DELETE /api/reviews/:id
 * Удалить отзыв (требует JWT-токен администратора)
 * @param {number} id - ID отзыва
 * @returns {Object} Результат удаления
 */
app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ReviewModel.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false,
                message: 'Отзыв не найден' 
            });
        }

        sendSuccess(res, 200, { 
            message: 'Отзыв успешно удален' 
        });
    } catch (error) {
        handleError(res, error, 'Ошибка удаления отзыва');
    }
});

// ---------- HEALTH CHECK (для мониторинга) ----------
/**
 * GET /api/health
 * Проверка работоспособности сервера
 * @returns {Object} Статус сервера
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ---------- ЗАПУСК СЕРВЕРА ----------
app.listen(PORT, () => {
    console.log(`\n✅ Сервер успешно запущен:`);
    console.log(`   📡 URL: http://localhost:${PORT}`);
    console.log(`   🗄️  API: http://localhost:${PORT}/api`);
    console.log(`   📁 Uploads: http://localhost:${PORT}/uploads\n`);
});