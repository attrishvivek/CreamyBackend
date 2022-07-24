const express = require('express')
const Router = express.Router()
const Post = require('../Model/CreamyPost')
const Comment = require('../Model/CreamyComment')
const { reseller } = require('googleapis/build/src/apis/reseller')
const { Route } = require('express')


Router.post('/CreamyComments', async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    const { postId, content, tag, reply, postUserId, parent } = req.body

    // const post = await Post.findById(postId)
    // if (!post) return res.status(400).json({ msg: "This post does not exist." })
    Post.findById(postId).exec((error, post) => {
        if (!post) {
            return res.status(401).json({
                message: "Error in find userpost",
                status: 400,
            })
        } else {
            const newComment = new Comment({
                user: userid,
                content, tag, postUserId, postId, reply, parent
            })
            Post.findOneAndUpdate({ _id: postId }, {
                $push: { comments: newComment._id }
            }, { new: true }, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: "Error in find userpost",
                        status: 400,
                    })
                } else {
                    newComment.save().then((result) => {
                        res.status(201).json({
                            message: "new commnents reply ",
                            result: result,
                            status: 201,
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            message: err,
                            status: 400,
                        })
                    })
                }
            })

        }
    })

    // if (reply) {
    //     const cm = await Comment.findById(reply)
    //     if (!cm) return res.status(400).json({ msg: "This comment does not exist." })
    // }

    // const newComment = new Comment({
    //     user: userid, content, tag, reply, postUserId, postId
    // })

    // await Post.findOneAndUpdate({ _id: postId }, {
    //     $push: { comments: newComment._id }
    // }, { new: true })

    // await newComment.save()

    // res.json({ newComment })

})

Router.get('/getcommentsPost', (req, res) => {

    Comment.aggregate([
        [
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'reply',
                    as: 'replies',
                },
            },
        ],

    ], (error, resulte) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                result: resulte,
                status: 200,
            })
        }
    })

})


Router.put('/commentUpdate/:commentid', (req, res) => {
    const { content } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const data = {
        content: content
    }
    Comment.findOneAndUpdate({ _id: req.params.commentid, user: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: " content Profile Updated",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
})


Router.delete('/commentdelete/:commentid', (req, res) => {
    const { content } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    Comment.findOneAndDelete({
        _id: req.params.commentid,
        $or: [
            { user: userid },
            { postUserId: userid }
        ]
    }, (error, comments) => {
        if (error) {
            return res.status(401).json({
                message: "Error Occure",
                status: 400,
            })
        } else {
            Post.findOneAndUpdate({ _id: comments.postId }, {
                $pull: { comments: req.params.commentid }
            }).then((result) => {
                res.status(200).json({
                    message: " content Profile Updated",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })

        }
    })
})


Router.put('/likeComment/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    Comment.find({ _id: req.params.id, likes: userid }, (error, result) => {
        if (error) {
            return res.status(401).json({
                messag: "error Occure",
                status: 400,
            })
        } else if (result.length > 0) {
            return res.status(200).json({
                messag: "You liked this post.",
                status: 200,
            })

        } else {
            Comment.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: userid } }, { new: true }).then((result) => {
                res.status(200).json({
                    message: "Profile like",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })
        }
    })
})

Router.put('/UnlikeComment/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }

    Comment.findOneAndUpdate({ _id: req.params.id }, { $pull: { likes: userid } }, { new: true }).then((result) => {
        res.status(200).json({
            message: "Post Unlike",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
    // }
    // })
})




module.exports = Router