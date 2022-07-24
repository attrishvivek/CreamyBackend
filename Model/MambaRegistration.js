const mongoose = require('mongoose')

const Genders = Object.freeze(['Google', 'FaceBook', 'Normal']);

const singupuser = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },

        firstname: {
            type: String
        },
        Lastname: {
            type: String
        },
        phone: {
            type: String
        },
        Description: {
            type: String
        },

        userName: {
            type: String,
            require: true,
        },
        fullName: {
            type: String,

        },
        email: {
            type: String,
        },
        password: {
            type: String,
            require: true
        },

        image: {
            type: String,
            default:'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        coverphotos: {
            type: String,
            default: 'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        LoginType: {
            type: String,
            enum: ['Google', 'FaceBook', 'Normal'],
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Friends',
            },
        ],
        Pendingfriends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Friends',
            },
        ],
        token: {
            type: String
        },

        resetToken: {
            type: String
        },
        expireToken: {
            type: Date
        },
        legalName: {
            type: String
        },
        DOB: {
            type: Date
        },
        streetAddress: {
            type: String
        },
        alternativeAddress: {
            type: String
        },
        useMambaSea: {
            type: String
        },
        town: {
            type: String
        },

        State: {
            type: String
        },
        Countrt: {
            type: String
        },
        PostCode: {
            type: Number
        },
        Employment: {
            type: String
        },
        fundSource: {
            type: String
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: {
            type: Array,
            default: [],
        },
       



    }, { timestamps: true }
);

module.exports = mongoose.model('singupuser', singupuser);