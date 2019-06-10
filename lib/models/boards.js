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
    status: String,
    public: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const defaultLists = [
  {title: 'Todo'},
  {title: 'In progress'},
  {title: 'Done'}
]
BoardsSchema.pre('save', function(next) {
    var self = this;
    if(self.isNew && self.lists.length == 0) {
      self.lists = defaultLists;
    }
    next();
});
module.exports = mongoose.model('Boards', BoardsSchema);
