const mongoose = require('mongoose')

const Genders = Object.freeze(['Google', 'FaceBook', 'Normal']);

const singupuser = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },

        firstname: {
            type: String,
            trim: true
        },
        lastname: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
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
            trim: true
        },
        password: {
            type: String,
            require: true,
            trim: true
        },

        image: {
            type: String,
            default: 'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        coverphotos: {
            type: String,
            default: 'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        LoginType: {
            type: String,
            enum: ['Google', 'Facebook', 'Normal'],
        },
        RegisterAs: {
            type: String,
            enum: ['Arties', 'fan'],
        },
        DOB: {
            type: Date
        },
        Genders: {
            type: String,
            enum: ['Male', 'FeMale'],

        },
        state: {
            type: String,
        },
        bio: {
            type: String,
        },
        followers: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        following: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        about:{
            type:String,
            default:""
        },
        token: {
            type: String,
        },
        kyc:{
            type:Boolean,
            default:false
        },
        AccountStatus: {
            type: String,
            enum: ['Active', 'Suspend'],
            default: 'Active'
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        on_Boarding:{
            type:String,
            type:Boolean,
            default:false

        },
        Subscribe: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],

    }, { timestamps: true }
);

module.exports = mongoose.model('user', singupuser);