'use strict';
const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema({

}, {
  timestamps: true
});

module.exports = mongoose.model('Boards', BoardsSchema);
