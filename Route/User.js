const express = require('express')
const Router = express.Router()
// const mongoose = require('mongoose')
const User = require('../Model/CreamyUser')
const UserValidatation = require('../Validation.js/UserSingup')
const validationLogin = require('../Validation.js/login')
const validation_reserpssword = require('../Validation.js/reset-password')


const crypto = require('crypto')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId;

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



Router.post('/Creamyregistration', (req, res) => {

    const { userName, email, password,role } = req.body

    // console.log(req.body)

    const validate = UserValidatation({ userName, email, password })


    if (!validate.isValid) {
        return res.status(400).json({
            message: validate.error,
            errors: validate.error,
            status: false,
        });
    } else {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8)

        User.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(400).json({
                    message: "email varified error",
                    errors: error,
                    status: false,
                })
            } else {
                if (user) {
                    return res.status(400).json({
                        message: "This email already registard",
                        user: user,
                        status: false,
                    })

                } else {

                    User.findOne({ userName: userName }).exec((error, user) => {
                        if (error) {
                            return res.status(400).json({
                                message: "userName  error",
                                errors: error,
                                status: false,
                            })
                        } else {
                            if (user) {
                                return res.status(400).json({
                                    message: "This userName already registard ",
                                    user: user,
                                    status: false,
                                })

                            } else {
                                const singup = new User({
                                    userId: new mongoose.Types.ObjectId(),
                                    userName: userName,
                                    email: email.toLowerCase(),
                                    password: hashedPassword,
                                    role: role,
                                    LoginType: 'Normal'
                                })
                                console.log(singup)
                                const token = jwt.sign({ email }, 'secret key',
                                    {
                                        expiresIn: "2h",
                                    }
                                );

                                singup.token = token;
                                singup.save().then((results) => {
                                    res.status(201).json({
                                        message: "New User Add Successfully",
                                        status: true,
                                        results: results
                                    })
                                }).catch((err) => {
                                    res.status(500).json({
                                        massage: "server error",
                                        err: err,
                                        status: false
                                    })
                                })

                            }
                        }
                    })

                }
            }
        })

    }
})


Router.post('/CreamyLogin', (req, res) => {


    const { email, password } = req.body
    const validate = validationLogin({ email, password })

    if (!validate.isValid) {
        return res.status(422).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        User.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "email varifation fail",
                    errors: error,
                    status: false,
                })
            }
            if (!user) {
                {
                    return res.status(401).json({
                        message: "Email is not registered",
                        user: user,
                        status: 400,
                    })
                }

            }
            bcrypt.compare(password, user.password, (error, match) => {

                const token = jwt.sign({ email }, 'secret key', {
                    expiresIn: "2h",
                })
                if (error) {
                    return res.status(401).json({
                        message: "password does not match",
                        status: 400,
                    })

                } else {
                    if (match) {
                        res.status(201).json({
                            message: "Login User sucessfully",
                            status: true,
                            image: user.image,
                            user: user,
                            match: match
                        })

                    } else {
                        res.status(401).json({
                            message: " password does not match",
                            status: 400
                        })

                    }
                }
            })

        })

    }
})


Router.post('/Creamyresetpassword', (req, res) => {
    const { email } = req.body
    const validate = validation_reserpssword({ email })
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        if (!validate.isValid) {
            return res.status(400).json({
                message: "validation Errors",
                errors: validate.error,
                status: false,
            });
        } else {
            User.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(422).json({
                        message: "Email Verification failed",
                        errors: error,
                        status: false,
                    })
                }
                if (!user) {
                    {
                        return res.status(201).json({
                            message: "Email is not registered",
                            user: user,
                            status: false,
                        })
                    }

                }
                user.token = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    res.status(201).json({
                        message: "Forget Password Link Send",
                        result: result,
                        status: 201
                    })
                }).catch((err) => {
                    res.status(500).json({
                        massage: "server error",
                        err: err,
                        status: 500
                    })
                })

            })
        }
    })
})


Router.post('/newpassword', (req, res) => {
    const { newpassword, token } = req.body

    SingupModel.findOne({ token: token }).exec((error, user) => {

        if (error) {

            return res.status(422).json({
                message: "to get Token Error",
                errors: error,
                status: false,
            })

        } else if (!user) {
            return res.status(422).json({
                message: "Token are not found",
                errors: error,
                status: false,
            })
        } else {
            let hashedPassword = bcrypt.hashSync(newpassword, 8)
            user.password = hashedPassword
            user.save().then((result) => {
                res.json({ message: "Password changed" })
            })
        }
    })

})


Router.post('/CreamypersonalDetails', upload.single("image"), (req, res) => {
    const { firstname, lastname, DOB, phone, state, Genders, RegisterAs, bio, email } = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    if (!req.file) {
        const data = {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            state: state,
            email: email,
            Genders: Genders,
            RegisterAs: RegisterAs,
            bio: bio,
            DOB: DOB,
            on_Boarding:true
        }
        // console.log("data",data)
        User.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                messag: "update data successfully ",
                result: result,
                status: 200,
            })
        }).catch((err) => {
            res.json({
                error: err,
                status: 501,
            })
        })

    } else {
        const data = {

            firstname: firstname,
            lastname: lastname,
            phone: phone,
            state: state,
            email: email,
            Genders: Genders,
            RegisterAs: RegisterAs,
            bio: bio,
            DOB: DOB,
            image: req.file.path,
            on_Boarding:true
        }
        User.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                messag: "update data successfully ",
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

Router.put('/follow', async (req, res) => {
    const userid = req.headers['userid']
    const {id} = req.body
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    if (userid !== req.params.id) {
        try {
            const user = await User.findById(id);
            console.log(user)
            const currentUser = await User.findById(userid);
            if (!user.followers.includes(userid)) {
                await user.updateOne({ $push: { followers: userid } });
                await currentUser.updateOne({
                    $push: { following: id }
                });
                res.status(201).json({
                    message: "User has been followed",
                    status: 201,
                })
            } else {
                res.status(403).json({
                    message: "You already follow this user",
                    status: 403,
                })
                // res.status(403).json("You already follow this user");
            }
        } catch (err) {
            res.status(500).json({
                massage: "server error",
                err: err,

            })
        }
    } else {
        res.status(403).json({
            message: "You can't follow yourself",
            status: 403,
        })
        // res.status(403).json("");
    }


})


Router.put('/Unfollow/:id', async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    if (userid !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(userid);
            if (user.followers.includes(userid)) {
                await user.updateOne({ $pull: { followers: userid } });
                await currentUser.updateOne({
                    $pull: { following: req.params.id }
                });
                res.status(201).json({
                    message: "User has been unfollowed",
                    status: 201,
                })
            } else {
                res.status(403).json({
                    message: "You don't follow this user",
                    status: 403,
                })

            }
        } catch (err) {
            res.status(500).json({
                massage: "server error",
                err: err,

            })
        }
    } else {
        res.status(403).json({
            message: "You can't follow yourself",
            status: 403,
        })

    }


})

Router.get('/suggestUser', async (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    if (userid === "null") {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const num = 5;
    const currentUser = await User.findById(userid);
    console.log("currentUser", currentUser)
    // const newArr = [userid];
    User.aggregate(
        [{ $match: { _id: { $nin: [...currentUser.followers, currentUser._id] } } },
        { $sample: { size: Number(num) } },
        {
            $lookup: {
                from: "users",
                localField: "followers",
                foreignField: "_id",
                as: "followers",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "following",
            },
        }], (error, resulte) => {
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

Router.get('/getUserFriends/:id',(req,res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    User.find({_id:req.params.id}).then((result) => {
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

Router.get('/getpersonal',(req,res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    User.find({_id:userid}).then((result) => {
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

Router.put('/getCoverProfile',upload.single("coverphotos"),(req,res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const data = {
        coverphotos: req.file.path
    }
    User.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            messag: "update data successfully ",
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

Router.put('/ProfileImage',upload.single("image"),(req,res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const data = {
        image: req.file.path
        }
    User.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            messag: "update Profile successfully ",
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


Router.put('/AboutProfile',(req,res) => {
    const userid = req.headers['userid']
    const {about} = req.body
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const data = {
        about:about
    }
    User.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            messag: "About Added ",
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

Router.get('/getadminuser', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    if (userid === "null") {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    User.aggregate(
        [
            {
                $lookup: {
                    from: 'transactionhistories',
                    localField: '_id',
                    foreignField: 'userProfile',
                    as: 'person'
                }
            },
            { $project: { "firstname": 1, "email": 1, "kyc": 1, "userId": 1, "lastname": 1, "DOB": 1, "phone": 1, "createdAt": 1,"state":1,"RegisterAs":1, ethtotal: { $sum: "$person.ethAmount" }, matictotal: { $sum: "$person.maticAmount" }, usdtotal: { $sum: "$person.usdAmount" }, quizTotal: { $sum: "$person.mambaToken" } } },

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

Router.delete('/deleteaccount/:id', (req, res) => {
    const userdeleteID = req.params['id']
    const userid = req.headers['userid']
    
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    User.findOneAndDelete({ _id: userdeleteID }).then((result) => {
        res.status(201).json({
            message: "User removed.",
            // result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: "Connection Failed",
            status: 400,
        })
    })

})


Router.get('/getUserAvailble/:username',(req,res) => {
    const {userName} = req.body
   
    User.findOne({userName:req.params.username}).then((result) => {
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


Router.put('/userAccountSuspend', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const { AccountStatus, userID } = req.body
    data = {
        AccountStatus: AccountStatus,
        userId: userID
    }
    // console.log(data)
    User.findOneAndUpdate({ _id: Objectid(userID) }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "User Suspended",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            message: "Something Wrong. Contact Support",
            status: 501,
        })
    })
})

Router.get('/Search/:fullName', (req,res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    User.find({$or:[{fullName:{ $regex: req.params.fullName }},{userName:{ $regex: req.params.fullName }}]}).limit(10)
    .select("fullName firstname userName image").then((result) => {
        res.status(201).json({
            message: "found data successfully",
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








module.exports = Router