'use strict';
const Board = require('../models/boards');
function userDecorator(controller) {
    controller.request('put', (req, res, next) => {
        if(!req.body.lists) {
            return next();
        }
        return Board.findOne({_id: req.params.id})
            .then((board) => {
                if(!board) {
                    throw new Error('not_found');
                }
                if(req.body.lists.length !== board.lists.length) {
                    throw new Error('Invalid operation with list');
                }
                const missingLists = board.lists.find((listItem) => !req.body.lists.includes(listItem));
                if(missingLists) {
                    throw new Error('Invalid operation with list');
                }
                return next();
            })
            .catch(next);
    });
}
module.exports = userDecorator;
