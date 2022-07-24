const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'singupuser',
        },
        post: {
            type: String,

        },
        image: {
            type: String
        },
        comments: {
            type: Array,
            user: [{
                user: {
                    type: mongoose.Schema.Types,
                    ref: 'singupuser',
                },
                date: {
                    type: Date,
                    default: Date.now(),
                },
                comment: {
                    type: String,
                },
                commentLikes: [
                    {
                        user: {
                            type: mongoose.Schema.Types,
                            ref: 'singupuser',
                        },
                    },
                ],
            }],
        },
        likes: {
            type: Array
        }
    })

module.exports = mongoose.model('PostSchema', PostSchema)