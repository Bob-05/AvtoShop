const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Токен не предоставлен' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Недействительный или истекший токен' 
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Недостаточно прав' 
            });
        }

        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };