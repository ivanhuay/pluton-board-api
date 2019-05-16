'use strict';
const mongoose = require('mongoose');

const TicketsSchema = new mongoose.Schema({

}, {
  timestamps: true
});

module.exports = mongoose.model('Tickets', TicketsSchema);
