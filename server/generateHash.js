const bcrypt = require('bcrypt');

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Пароль: ' + password);
    console.log('Хеш: ' + hash);
});