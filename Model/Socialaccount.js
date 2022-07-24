const mongoose = require('mongoose')

const Socialaccount = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        Facebook: {
            type: String
        },
        Twitter: {
            type: String
        },
        Linkedin: {
            type: String
        },
        Instagram: {
            type: String
        },
        Flickr: {
            type: String
        },
        Github: {
            type: String
        },
        Skype: {
            type: String
        },
        Google: {
            type: String
        },


    }, { timestamps: true }
);

module.exports = mongoose.model('Socialaccount', Socialaccount);