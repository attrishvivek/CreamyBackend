const express = require('express')
const Router = express.Router()
const User = require('../Model/MambaRegistration')
const Friends = require('../Model/Friends')


Router.post('/sendfriendsRequest', async (req, res) => {
    const userId = req.headers['userid']
    // console.log("===userId===", userid)
    if (!userId) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { friendId } = req.body
    User.findOne({ userId: userId }, (err, userA) => {
        // console.log("====UserA====", userA)

        User.findOne({ userId:friendId }, (err, userB) => {

            // console.log("====userB", userB)

            if (!userA || !userB) {
                return res.status(401).json({
                    message: "No user exists with that ID",
                    status: 400,
                })
            }
            Friends.findOneAndUpdate({ requester: userA.userId, recipient: userB.userId, }, { $set: { status: 1 } }, {
                upsert: true,
                new: true,
            }, (err, docA) => {
                console.log("===docA====", docA)

                Friends.findOneAndUpdate({ recipient: userA.userId, requester: userB.userId, }, { $set: { status: 1 } }, {
                    upsert: true,
                    new: true,
                },
                    (err, docB) => {
                        console.log("===docB====", docB)
                        // User.findOneAndUpdate({ userId: userA.userId }, { $push: { Pendingfriends: userB.userId } }, (err, updateuserdataA) => {

                        // console.log('===updateuserDataA====', updateuserdataA)

                        User.findOneAndUpdate({ userId: userB.userId }, { $push: { Pendingfriends: userA.userId } }, (err, updateuserdataB) => {
                            // console.log('===updateuserdataB====', updateuserdataB)

                            res.status(200).json({
                                status: 'success',
                                data: {
                                    updateuserdataB
                                },
                            });


                        })


                        // })




                    }
                );

            }
            );

        })
    })

})


Router.post('/acceptrequest', async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { friendId } = req.body
    User.findOne({ userId: userid }, (error, userA) => {

        User.findOne({ userId: friendId }, (error, userB) => {
            if (!userA || !userB) {
                return res.status(401).json({
                    message: "No user exists with that ID",
                    status: 400,
                })
            }

            Friends.findOneAndUpdate({ requester: userA.userId, recipient: userB.userId, }, { $set: { status: 2 } }, {
                upsert: true,
                new: true,
            }, (error, docA) => {

                Friends.findOneAndUpdate({ requester: userB, recipient: userA, }, { $set: { status: 2 } }, {
                    upsert: true,
                    new: true,
                }, (error, docB) => {

                    User.findOneAndUpdate({ userId: userA.userId }, { $push: { friends: userB.userId } }, (error, updateUserA) => {

                        User.findOneAndUpdate({ userId: userB.userId }, { $push: { friends: userA.userId } }, (error, updateUserAB) => {
                            User.findOneAndUpdate({ userId: userA.userId }, { $pull: { Pendingfriends: userB.userId } }, (error, updateUserB) => {
                                // User.findOneAndUpdate({ userid: userB.userId }, { $pull: { Pendingfriends: docB._id } }, (error, updateUserBA) => {
                                res.status(200).json({
                                    status: 'success',
                                    data: {
                                        updateUserA,
                                        updateUserB

                                    },
                                });

                                // })

                            })

                        })
                    })

                }
                );
            }
            );

        })
    })
})


Router.post('/rejectuserrequest', async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { friendId } = req.body
    User.findOne({ userId: userid }, (error, userA) => {
        User.findOne({ userId: friendId }, (error, userB) => {
            if (!userA || !userB) {
                return res.status(401).json({
                    message: "No user exists with that ID",
                    status: 400,
                })
            }
            Friends.findOneAndRemove({ requester: userA.userId, recipient: userB.userId, }, (error, docA) => {

                Friends.findOneAndRemove({ recipient: userA.userId, requester: userB.userId, }, (error, docB) => {

                    User.findOneAndUpdate({ userId: userA.userId }, { $pull: { Pendingfriends: userB.userId } }, (error, updateUserA) => {
                        // User.findOneAndUpdate({ useridid: userA }, { $pull: { Pendingfriends: docB._id } }, (error, updateUserB) => {
                        if (error) {
                            return res.status(401).json({
                                status: 'failed',

                            });

                        } else {
                            res.status(200).json({
                                status: 'success',
                                data: {
                                    updateUserA
                                },
                            });
                        }
                        // })
                    })

                });

            });

        })

    })
})

Router.get('/getFriendlist', async (req, res) => {

    const userId = req.headers['userid']
    if (!userId) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    try {
        const user = await User.findOne({ userId: userId });
        const friends = await Promise.all(
            user.friends.map((friendId) => {
                return User.findOne({ userId: friendId });
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { userId, _id, userName, fullName, email } = friend;
            friendList.push({ userId, _id, userName, fullName, email });
        });
        res.status(200).json({
            status: 'success',
            data: friendList

        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            error: err
        });

    }

})


Router.get('/getPendinglist', async (req, res) => {

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    try {
        const user = await User.findOne({ userId: userid });
        const Pendingfriends = await Promise.all(
            user.Pendingfriends.map((friendId) => {
                return User.findOne({ userId: friendId });
            })
        );
        let PendingfriendList = [];
        Pendingfriends.map((friend) => {
            const { userId, _id, userName, fullName } = friend;
            PendingfriendList.push({ userId, _id, userName, fullName });
        });
        res.status(200).json({
            status: 'success',
            data: PendingfriendList

        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            error: err
        });

    }

})


module.exports = Router