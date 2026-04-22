const db = require('../db');

class ServiceModel {
    // CREATE — создание услуги
    static async create(name, description, price, icon_url = null) {
        const [result] = await db.query(
            'INSERT INTO services (name, description, price, icon_url) VALUES (?, ?, ?, ?)',
            [name, description, price, icon_url]
        );
        return result.insertId;
    }

    // READ — получение всех услуг (полные данные, для админ-панели)
    static async findAll() {
        const [rows] = await db.query(
            'SELECT * FROM services ORDER BY id DESC'
        );
        return rows;
    }

    // READ — получение всех услуг (только нужные поля, для публичной части)
    static async findAllPublic() {
        const [rows] = await db.query(
            'SELECT id, name, description, price, icon_url FROM services ORDER BY id DESC'
        );
        return rows;
    }

    // READ — получение одной услуги по ID
    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM services WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    // UPDATE — обновление услуги
    static async update(id, name, description, price, icon_url = null) {
        const [result] = await db.query(
            'UPDATE services SET name = ?, description = ?, price = ?, icon_url = ? WHERE id = ?',
            [name, description, price, icon_url, id]
        );
        return result.affectedRows > 0;
    }

    // DELETE — удаление услуги
    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM services WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ServiceModel;