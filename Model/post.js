const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        
        
        userId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            max: 500,
        },
        image: {
            type: String,
        },
        video: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
      comments:{
          type: String,
      },

      userProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'singupuser'
    },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);