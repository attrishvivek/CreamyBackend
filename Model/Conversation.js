const mongoose = require('mongoose');


const Conversation = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    members: {
        type: Array,
        default: []
    },
}, { timestamps: true }
)

module.exports = mongoose.model('Conversation', Conversation);
