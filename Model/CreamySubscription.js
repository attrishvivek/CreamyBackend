const mongoose = require('mongoose')

const Subscribe = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    SubscriberUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Subscribe', Subscribe)