'use strict';
const express = require('express');
const Boards = require('../models/boards');
const Tickets = require('../models/tickets');
const router = express.Router();
router.post('/board/:id', function(req, res, next) {
  const defaultList = 'Todo';
  if (!req.body.title) {
    return next(new Error('Title required'));
  }
  Boards.findOne({
      _id: req.params.id
    })
    .then(async(board) => {
      if (!board) {
        return next(new Error('Not found'));
      }
      const newTicket = new Tickets(req.body);
      await newTicket.save();
      board.tickets.push({ticket: newTicket._id, list: defaultList});
      return board.save();
    })
    .then((board) => {
      return res.json(board);
    })
    .catch(next);
});

module.exports = router;
