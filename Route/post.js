const express = require("express")
const Router = express.Router()
const mongoose = require('mongoose')
const Post = require('../Model/post')
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


Router.post('/post', upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { desc , comments } = req.body
    const data = new Post({
        userProfile: userid,
        comments:comments,
        userId: userid,
        desc: desc,
        image: req.file.path 
    })
    data.save().then((results) => {
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

/* Router.post('/post', upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { desc } = req.body
    const data = new Post({
        userId: userid,
        desc: desc,
        image: req.file.path 
    })
    data.save().then((results) => {
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
}) */

Router.get("/getuserpost", (req, res) => {
    
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Post.find({ userId: userid }).populate('userProfile').then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            likes: result.likes,
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

Router.delete('/deletepost/:id', (req, res) => {
    const { _id } = req.params.id

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }

    Post.findByIdAndDelete({ _id: req.params.id }).then((result) => {
        return res.status(200).json({
            messag: "Delete user successfully ",
            result: result,
            success: true,
        })
    })

})


Router.put("/:id/like", async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    try {
        const post = await Post.findOne({ _id: req.params.id });
        console.log("post",post)
        if (!post.likes.includes(userid)) {
            await post.updateOne({ $push: { likes: userid } });
            res.status(200).json({
                messag: "The post has been liked ",
                likes: post.likes.length - 1,
                success: true,
            });
        } else {
            await post.updateOne({ $pull: { likes: userid } });
            res.status(200).json({
                messag: "The post has been disliked ",
                likes: post.likes.length,
                success: true,
            });
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
});



/* comments     Api */

Router.put("/Comments", async (req, res) => {
    const userid = req.headers['userid']
    const { comments} = req.body
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
  const   data = {
        comments :comments,
        userProfile: userid
    }
    Post.findOneAndUpdate({userId:userid},{$set:data},{new :true}).populate('userProfile').then((result) => {
        res.status(200).json({
            message: "update data successfully ",
            result: result,
            status: 200,
        })
    }).catch((error) => {
        res.json({
            error: err,
            status: 501,
        })
    })
   
});



  // follow a user

Router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
  try{
  const user = await User.findById(req.params.id);
  const currentUser = await User.findById(req.body.userId)
  if(!user.followers.includes(req.body.userId)){
  await user.updateOne({$push:{followers:req.body.userId}});
  await currentUser.updateOne({$push:{followings:req.params.id}})
  res.status(200).json("user has been followed");
  }else{
    res.status(403).json("you already follow this user");
  }
  
  }catch(err){
    res.status(500).json(err)
  }
    }else{
      res.status(403).json("you cant follow yourself")
    }
  })

module.exports = Router