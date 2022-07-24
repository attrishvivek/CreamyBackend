const express = require('express')
const Router = express.Router()
const path = require('path')
const CreatePosts = require('../Model/CreatePost')
// const validatecoverphoto = require('../Validation.js/coverphoto')
const mongoose = require('mongoose')

const Objectid = mongoose.Types.ObjectId;


const multer = require("multer")
const { route } = require('./Googlelogin')
const CreatePost = require('../Model/CreatePost')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


Router.post('/CreatePost', upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { post } = req.body

    if (!req.file && post) {
        const savepost = new CreatePosts({
            user: userid,
            post: post
        })
        savepost.save().then((result) => {
            return res.status(201).json({
                status: 'success post',
                result: result
            })
        }).catch((error) => {
            return res.status(501).json({
                status: 'failed',
                error: error
            })
        })

    } else {
        if (req.file && !post) {
            const savepost = new CreatePosts({
                user: userid,
                image: req.file.path
            })
            savepost.save().then((result) => {
                return res.status(201).json({
                    status: 'success image',
                    result: result
                })
            }).catch((error) => {
                return res.status(501).json({
                    status: 'failed',
                    error: error
                })
            })

        } else {

            const savepost = new CreatePosts({
                user: userid,
                image: req.file.path,
                post: post
            })
            savepost.save().then((result) => {
                return res.status(201).json({
                    status: 'success post and Image',
                    result: result
                })
            }).catch((error) => {
                return res.status(501).json({
                    status: 'failed',
                    error: error
                })
            })

        }
    }

})

Router.get('/getallpost', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    CreatePosts.find({ userId: userid }).then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: err,
            status: 400,
        })
    })

})

Router.get('/getonePost/:userPostId', (req, res) => {
    const { userPostId } = req.params
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    CreatePosts.findOne({ _id: userPostId }).then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: err,
            status: 400,
        })
    })
})

Router.put('/updatePost', upload.single("image"), (req, res) => {
    // const { userPostId } = req.params
    const { post, userPostId } = req.body
    const userid = req.headers['userid']


    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    if (!req.file && post) {

        const data = {
            post: post

        }

        CreatePosts.findByIdAndUpdate({ _id: userPostId }, { $set: data }, { new: true }).then((result) => {
            res.status(201).json({
                message: "change post data successfully ",
                result: result,
                status: 201,
            })
        }).catch((err) => {
            res.status(400).json({
                message: err,
                status: 400,
            })
        })

    } else {
        if (req.file && !post) {
            const data = {
                image: req.file.path

            }

            CreatePosts.findByIdAndUpdate({ _id: userPostId }, { $set: data }, { new: true }).then((result) => {
                res.status(201).json({
                    message: "change image  data successfully ",
                    result: result,
                    status: 201,
                })
            }).catch((err) => {
                res.status(400).json({
                    message: err,
                    status: 400,
                })
            })
        } else {
            const data = {
                post: post,
                image: req.file.path

            }
            CreatePosts.findByIdAndUpdate({ _id: userPostId }, { $set: data }, { new: true }).then((result) => {
                res.status(201).json({
                    message: "change both image and post data successfully ",
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
    }
})

Router.delete('/deletepost', (req, res) => {
    const { userPostId } = req.params
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    CreatePosts.deleteOne({ _id: userPostId }).then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: err,
            status: 400,
        })
    })

})


// Router.get('/getGellery', (req, res) => {
//     const { userPostId } = req.params
//     const userid = req.headers['userid']
//     if (!userid) {
//         return res.status(400).json({
//             message: "User Id Required on Header",
//             status: 400,
//         })
//     }
//     // console.log("userid",userid)
//     CreatePosts.aggregate([
//         { $match: { user: Objectid(userid) } },
//         { $group: { user: "$user", image: { $sum: "$mambaToken" }, totaleth: { $sum: "$ethAmount" }, totalmatic: { $sum: "$maticAmount" }, totalusd: { $sum: "$usdAmount" } } }
//     ], (error, resulte) => {
//         if (error) {
//             return res.status(400).json({
//                 message: "execute error",
//                 error: error,
//                 status: 400,
//             })
//         } else {
//             return res.status(200).json({
//                 message: "to get Data",
//                 result: resulte,
//                 status: 200,
//             })
//         }
//     })
// })




module.exports = Router


