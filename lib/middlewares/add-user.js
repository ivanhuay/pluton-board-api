'use strict';

const User = require('../models/user');
function unauthorized() {
    const error = new Error('Unauthorized');
    error.status = 401;
    return error;
}
function addUser(req, res, next) {
    if(!req.user || !req.user.id) {
        return next(unauthorized());
    }
    return User.findOne({_id: req.user.id})
        .then((user) => {
            if(!user) {
                return next(unauthorized());
            }
            req.user.data = user;
            return next();
        })
        .catch(next);
}

module.exports = addUser;
