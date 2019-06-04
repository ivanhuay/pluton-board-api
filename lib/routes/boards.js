'use strict';
const express = require('express');
const boards = require('../models/boards');
const router = express.Router();
router.post('/:id/lists', function(req, res, next) {
  var list = req.body.list;
  if (!list) {
    return next(new Error('List required'));
  }
  boards.findOne({
      _id: req.params.id
    })
    .then((board) => {
      if (!board) {
        return next(new Error('Not found'));
      }
      board.lists.push({
        title: list
      });
      return board.save();
    })
    .then((board) => {
      return res.json(board);
    })
    .catch(next);

});

module.exports = router;
