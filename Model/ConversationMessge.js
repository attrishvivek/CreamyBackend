const mongoose = require('mongoose');


const message = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    conversationId: {
        type: String
    }, sender: {
        type: String
    }, text: {
        type: String
    },
}, { timestamps: true }
)

module.exports = mongoose.model('message', message);
