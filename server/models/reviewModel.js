const db = require('../db');

class ReviewModel {
    // CREATE — создание отзыва
    static async create(name, text, rating) {
        const [result] = await db.query(
            'INSERT INTO reviews (name, text, rating) VALUES (?, ?, ?)',
            [name, text, rating]
        );
        return result.insertId;
    }

    // READ — получение всех отзывов
    static async findAll() {
        const [rows] = await db.query(
            'SELECT * FROM reviews ORDER BY created_at DESC'
        );
        return rows;
    }

    // DELETE — удаление отзыва
    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM reviews WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ReviewModel;