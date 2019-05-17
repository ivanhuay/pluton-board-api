'use strict';
const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  columns: [{
    title: String,
    tickets: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tickers'
    }
  }],
  startDate: Date,
  endDate: Date,
  status: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Boards', BoardsSchema);
