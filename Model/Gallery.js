const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    src:{
        type:String,
        default:''
    },
    // PostId:{type: mongoose.Types.ObjectId, ref: 'post'},
    user:{type: mongoose.Types.ObjectId, ref: 'user'},
    gallery: {
        type: String,
        enum: ['facebook', 'instagram','normal'],
        default: 'normal'
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Gallery', postSchema)