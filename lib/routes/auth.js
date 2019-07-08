'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const logger = require('../logger');
const jwt = require('jsonwebtoken');
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const request = require('request-promise');
const {getUserData} = require('../utils/github');

function validation(req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: 'missing params', code: 'missing_params', status: 'error'});
        return;
    }
    next();
}

router.post('/login', validation, (req, res) => {
    User.findOne({username: req.body.username}).then((user) => {
        if (!user) {
            res.status(400).json({error: 'user not found!', code: 'user_not_found'});
            return;
        }
        if (!user.validPassword(req.body.password)) {
            res.status(400).json({error: 'authentication failed!', code: 'authentication_failed'});
            return;
        }
        let token = jwt.sign({id: user._id, type: 'native'}, JWT_SECRET);
        res.json({
            token
        });
    }).catch((error) => {
        logger.error('findUserError: ', error);
        res.status(400).json({error: 'authentication error', code: 'authentication_failed'});
    });
});

function checkIfExist(req, res, next) {
    User.count({username: req.body.username}).then((count) => {
        if (count === 0) {
            next();
            return;
        }
        res.status(400).json({error: 'username already in use!', code: 'username_alredy_used'});
    }).catch((error) => {
        logger.error('countUserError: ', error);
    });
}

router.post('/signup', validation, checkIfExist, (req, res) => {
    var newUser = new User({
        username: req.body.username,
        full_name: req.body.fullname,
        password: req.body.password,
        email: req.body.email
    });

    newUser.save().then(() => {
        res.json({status: 'completed'});
    }).catch((error) => {
        logger.error('signupError', error);
        res.status(400).json({error: 'save user error', code: 'save_error', status: 'error'});
    });
});

router.post('/oauth/github', (req, res, next) => {
    const code = req.body.code;
    let accessToken;
    request({
        uri: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        json:true,
        body: {
            client_secret: CLIENT_SECRET,
            client_id: CLIENT_ID,
            code
        }
    })
        .then((resp) => {
            accessToken = resp.access_token;
            return getUserData(resp.access_token);
        })
        .then((data) => {
            User.findOne({externalId: data.id})
                .then((user) => {
                    if(!user) {
                        const newUser = new User({
                            username: data.login,
                            email: data.email,
                            bio: data.bio,
                            url: data.url,
                            profileImage: data.avatar_url,
                            fullName: data.name,
                            externalId: data.id,
                            access_token: accessToken
                        });
                        return newUser.save();
                    }
                    user.username = data.login;
                    user.email = data.email;
                    user.bio = data.bio;
                    user.url = data.url;
                    user.profileImage = data.avatar_url;
                    user.fullName = data.name;
                    user.access_token = accessToken;
                    user.latestLogin = new Date();
                    return user.save();
                })
                .then((user) => {
                    let token = jwt.sign({id: user._id, type: 'external'}, JWT_SECRET);
                    res.json({token, profile:{username: user.username, profileImage: user.profileImage}});
                });
        })
        .catch(next);
});
module.exports = router;
