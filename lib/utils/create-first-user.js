'use strict';
const User = require('../models/user');
const logger = require('../logger');
const createFirstUser = () => {
    const username = process.env.FIRST_ADMIN;
    const password = process.env.FIRST_ADMIN;
    if(!(username && password)) {
        return false;
    }
    return User.findOne({})
        .then((user) => {
            if(user) {
                return logger.info('first user already exists');
            }
            const newUser = new User({username, password});
            return newUser.save()
                .then(() => logger.info('first user created'));
        });
};

module.exports = {createFirstUser};
