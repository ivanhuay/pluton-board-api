'use strict';
const Auth = require('./auth');
const Users = require('./users');
const Boards = require('./boards');
const Tickets = require('./tickets');
const Integration = require('./integration');

module.exports = {
    Users,
    Auth,
    Boards,
    Tickets,
    Integration
};
