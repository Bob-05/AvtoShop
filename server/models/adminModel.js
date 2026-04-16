const db = require('../db');

class AdminModel {
    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM admin WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }
}

module.exports = AdminModel;