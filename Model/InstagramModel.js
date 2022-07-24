const mongoose = require('mongoose')

const InstagramLogin = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        name: {
            type: String,
            require: true,

        },
        email: {
            type: String,
            require: true,

        },
        token: {
            type: String
        },


    }, { timestamps: true }
);

module.exports = mongoose.model('InstagramLogin', InstagramLogin);