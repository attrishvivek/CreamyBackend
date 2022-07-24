const mongoose = require('mongoose')

const commentreply = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

    content: {
        type: String,
        required: true
    },
    tag: { type: Object },
    reply: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
})

module.exports = mongoose.model('commentreply', commentreply)