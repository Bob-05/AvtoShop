const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ServiceModel = require('./models/serviceModel');
const ReviewModel = require('./models/reviewModel');
const AdminModel = require('./models/adminModel');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// =============================================
// API ЭНДПОИНТЫ
// =============================================

// ---------- АВТОРИЗАЦИЯ ----------
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

        res.json({ 
            success: true, 
            token, 
            message: 'Вход выполнен успешно' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
});

// ---------- УСЛУГИ (ПУБЛИЧНЫЕ) ----------
// GET — получить все услуги
app.get('/api/posts', async (req, res) => {
    try {
        const services = await ServiceModel.findAll();
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка загрузки услуг' 
        });
    }
});

// ---------- УСЛУГИ (ЗАЩИЩЁННЫЕ) ----------
// POST — добавить услугу
app.post('/api/posts', authenticateToken, async (req, res) => {
    const { name, icon, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ 
            message: 'Название, описание и цена обязательны' 
        });
    }

    try {
        const id = await ServiceModel.create(name, description, price, icon || null);
        const newService = await ServiceModel.findById(id);
        res.status(201).json(newService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка добавления услуги' 
        });
    }
});

// PUT — обновить услугу
app.put('/api/post/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, icon, description, price } = req.body;

    try {
        const updated = await ServiceModel.update(id, name, description, price, icon || null);
        
        if (!updated) {
            return res.status(404).json({ 
                message: 'Услуга не найдена' 
            });
        }

        const updatedService = await ServiceModel.findById(id);
        res.json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка обновления услуги' 
        });
    }
});

// DELETE — удалить услугу
app.delete('/api/post/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ServiceModel.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                message: 'Услуга не найдена' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Услуга удалена' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка удаления услуги' 
        });
    }
});

// ---------- ОТЗЫВЫ (ПУБЛИЧНЫЕ) ----------
// GET — получить все отзывы
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await ReviewModel.findAll();
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка загрузки отзывов' 
        });
    }
});

// POST — добавить отзыв
app.post('/api/reviews', async (req, res) => {
    const { name, text, rating } = req.body;

    if (!name || !text || !rating) {
        return res.status(400).json({ 
            message: 'Имя, текст и рейтинг обязательны' 
        });
    }

    try {
        const id = await ReviewModel.create(name, text, rating);
        res.status(201).json({ 
            id, 
            name, 
            text, 
            rating, 
            message: 'Отзыв добавлен' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Ошибка добавления отзыва' 
        });
    }
});

// DELETE — удалить отзыв (только для админа)
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

        res.json({ 
            success: true, 
            message: 'Отзыв удален' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Ошибка удаления отзыва' 
        });
    }
});

// ---------- ЗАПУСК СЕРВЕРА ----------
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});