const express = require('express')
const Router = express.Router()
const Post = require('../Model/CreamyPost')
const User = require('../Model/CreamyUser')
const Comment = require('../Model/CreamyComment')
const Gallery = require('../Model/Gallery')




const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './postImage/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

Router.post('/CreamyPost', upload.array("images", 3), (req, res) => {
    const { content } = req.body;
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    // if (!req.file) {
    //     const UserPost = new Post({
    //         userId: userid,
    //         content: content,
    //         user: userid
    //     })
    //     console.log("Post", UserPost)
    //     UserPost.save().then((results) => {
    //         res.status(201).json({
    //             message: " User New Post Successfully",
    //             status: 201,
    //             results: results
    //         })
    //     }).catch((err) => {
    //         res.status(500).json({
    //             massage: "server error",
    //             err: err,
    //             status: 500
    //         })
    //     })

    // } else {
    const UserPost = new Post({
        userId: userid,
        content: content,
        user: userid,
        images: req.files
    })
    console.log("UserPost", UserPost)
    UserPost.save().then((results) => {
        res.status(201).json({
            message: " User New Post Successfully",
            status: 201,
            results: results
        })
    }).catch((err) => {
        res.status(500).json({
            massage: "server error",
            err: err,
            status: 500
        })
    })
})



Router.get("/allPostget", async (req, res) => {
    let { page = 1  , limit =5  } = req.query
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const comment = Comment.aggregate([
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
    ])
    const currentUser = await User.findById(userid);
    Post.find({ user: [...currentUser.following, userid] }).sort({ createdAt: 1 }).populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).populate('user').limit(limit * 1)
        .skip((page - 1) * limit).then((results) => {
            res.status(200).json({
                message: "All category with pagination",
                data: results,
                success: true,
            })
        }).catch((err) => {
            res.status(500).json({
                massage: "server error",
                err: err,
                status: 500
            })
        })
})

Router.put('/CreamyupdatePost/:id', upload.array("images", 3), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { content } = req.body

    // if (!req.files) {
    //     const data = {
    //         content: content,
    //     }
    //     console.log('content')
    //     Post.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true }).then((result) => {
    //         res.status(200).json({
    //             message: " content Profile Updated",
    //             result: result,
    //             status: 200,
    //         })
    //     }).catch((err) => {
    //         res.json({
    //             error: err,
    //             status: 501,
    //         })
    //     })
    // } else {
    const data = {
        content: content,
        images: req.files
    }
    console.log('image')
    Post.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "Profile Updated",
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

})

Router.delete('/CreaMyDeletePost/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    Post.findOneAndDelete({ _id: req.params.id, user: userid }, (error, post) => {
        if (error) {
            return res.status(401).json({
                message: "Error Occure",
                status: 400,
            })
        } else {
            Comment.deleteMany({ _id: { $in: post.comments } }).then((result) => {
                res.status(200).json({
                    message: " content Delete ",
                    result: post,
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


Router.put('/likePost', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const {postId} = req.body
    console.log("postId",postId)
    Post.find({ _id: postId, likes: userid }, (error, result) => {
        console.log("result",result)
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
            Post.findOneAndUpdate({ _id: postId }, { $push: { likes: userid } }, { new: true }).then((result) => {
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

Router.put('/UnlikePost', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const {postId} = req.body
    console.log("postId",postId)

    Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userid } }, { new: true }).then((result) => {
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


Router.get('/UserPost/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    console.log("userprofile",typeof req.params.id )

    Post.find({ user: req.params.id }).sort({ createdAt: 1 }).populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).populate('user').then((result) => {
        res.status(200).json({
            message: "Profile Updated",
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

Router.put('/updtaeCommentsStatus/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }

    Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { commentOpen: userid } }, { new: true }).then((result) => {
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
    
})


Router.get('/UserGallery', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }


    Post.find({ user: req.params.id }).sort({ createdAt: 1 }).populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).populate('user').then((result) => {
        res.status(200).json({
            message: "Profile Updated",
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



Router.get('/getallpostGellery', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Post.find({ userId: userid },{images:1}).exec((error, user) => {
        if(error) {
           return res.status(400).json({
                message: err,
                status: 400,
            })
        }else {
           const arr = [];
let obj={}
        const newimage =  user.filter((item)=> item.images.length != 0)
        // arr.push(newimage)
        newimage.map((item) => {
            item.images.map((image) => {
                 obj = {src:`https://nodejs.creamycam.io/${image.path}`,alt:image.filename,width:"350",height:'250'}
                 arr.push(obj)
            })
         
        })

        // newimage.filter((item) => item.images.some((str) => str.path.length !== 0))
    //  const  filterimage = newimage.map((element) => {
    //         return {...element, images: element.images.filter((item) => item.path.length !==0 )}
    //       })
          
// const filterimage = newimage.filter((item) => item.images.foreach(let i in ))
        // function checkImage() {
        //     return user.image.length !==0
        // }
        res.status(201).json({
            message: "found data successfully ",
            result: arr,
            status: 201,
        })


        }

    })

})


Router.post('/addGellary',upload.single("images"),(req,res) => {
    const userid = req.headers['userid']

    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const UserPost = new Gallery({
        userId: userid,
        src: req.file.path,
        user: userid,
        gallery:req.body.gallery
    })
    UserPost.save().then((results) => {
        res.status(201).json({
            message: " User Add Gellery Image Successfully",
            status: 201,
            results: results
        })
    }).catch((err) => {
        res.status(500).json({
            massage: "server error",
            err: err,
            status: 500
        })
    })
})

Router.get('/GetGellary',upload.single("images"),(req,res) => {
    const userid = req.headers['userid']

    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Gallery.find({ user: userid },{ src: 1, gallery: 1 }).sort({ createdAt: 1 }).exec((error, user) => {
        if(error) {
            return res.status(400).json({
                 message: err,
                 status: 400,
             })
         }else {
            const arr = [];
 let obj={}
         user.map((item) => {
                  obj = {src:`https://nodejs.creamycam.io/${item.src}`,alt:item._id,width:"350",height:'250'}
                  arr.push(obj)
         })
         res.status(201).json({
             message: "found data successfully ",
             result: arr,
             status: 201,
         })

         }
    })
    
})

Router.get('/getUserFrindsGellery/:id', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Post.find({ userId: req.params.id },{images:1}).exec((error, user) => {
        if(error) {
           return res.status(400).json({
                message: error,
                status: 400,
            })
        }else {
           const arr = [];
let obj={}
        const newimage =  user.filter((item)=> item.images.length != 0)
        // arr.push(newimage)
        newimage.map((item) => {
            item.images.map((image) => {
                 obj = {src:`https://nodejs.creamycam.io/${image.path}`,alt:image.filename,width:"350",height:'250'}
                 arr.push(obj)
            })
         
        })
        res.status(201).json({
            message: "found data successfully ",
            result: arr,
            status: 201,
        })
        }

    })

})

module.exports = Router