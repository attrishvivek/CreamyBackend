const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

    content: {
        type: String,
        required: true
    },
    tag: { type: Object },
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
    parent: { type: mongoose.Types.ObjectId, ref: "comment", default: undefined }
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)