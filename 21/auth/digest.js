const passportHttp = require('passport-http');

const users = require('./../secure/users') || [];
//передаються данные в хеше
module.exports = new passportHttp.DigestStrategy({qop:'auth'}, (username, done) => {
    const targetUser = users.find(user => user.username === username); //find() возвращает значение первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback функции
    console.log(users)
    if (targetUser) {
        return done(null, targetUser.username, targetUser.password);
    } else {
        return done(null, false, {message: 'Such user doesn\'t exist'});
    }
}, (params, done) => done(null, true));
