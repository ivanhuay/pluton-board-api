'use strict';
const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  lists: [{
    title: String,
    list: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tickets'
    }]
  }],
  startDate: Date,
  endDate: Date,
  status: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Boards', BoardsSchema);
