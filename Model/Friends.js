const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'singupuser',
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'singupuser',
    },
    status: {
        type: Number,
        enums: [
            1, //'pending',
            2, //'Accept',
            3, //'friends'
        ],
    },
});
const Friends = mongoose.model('Friends', friendsSchema);

module.exports = Friends;