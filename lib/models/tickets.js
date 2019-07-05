'use strict';
const mongoose = require('mongoose');

const TicketsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    externalId: {
        type: Number,
        index: true
    },
    externalUrl: String,
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    activity: [{
        action: String,
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Tickets', TicketsSchema);
