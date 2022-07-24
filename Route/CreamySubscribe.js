const express = require('express')
const Router = express.Router()
const Subscriber  = require('../Model/CreamySubscription')
const User = require('../Model/CreamyUser')
const ConversationModel = require("../Model/Conversation")
const mongoose = require('mongoose')


Router.post('/subScribeUser', (req,res) => {
    const userid = req.headers['userid']
    const {SubscriberUserId} =req.body
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    User.findOne({_id:userid}).exec((error,mainUser)  => {
        if(error){
             res.status(401).json({
                message: "DataBase Connection Issue",
                status: 400,
            })
        }else {
            if(!mainUser) {
                res.status(401).json({
                    message: "User Does Not Founds",
                    status: 400,
                })
            }else {
                // console.log("mainUser", mainUser)
                if(mainUser.Subscribe.includes(SubscriberUserId)){
                    res.status(200).json({
                        message: "You already subscribe this user",
                        status: 201,
                    })
                }else {
                    const UserSubscriber = new Subscriber({
                        userId: userid,
                        SubscriberUserId:SubscriberUserId
                    })
                    const New = new ConversationModel({
                        userId: new mongoose.Types.ObjectId(),
                        members: [userid, SubscriberUserId]
                
                    })
                    UserSubscriber.save()
                    New.save()
                    mainUser.updateOne({ $push: { Subscribe: SubscriberUserId } }).exec((error, save) => {
                        if(error){
                            res.status(401).json({
                               message: "DataBase Connection Issue",
                               status: 400,
                           })
                        }else {

                            res.status(200).json({
                                message: "You  subscribe  user",
                                status: 201,
                            })
                        }
                    })
                }
            }
        }
    })
})


Router.get('/UserSubScriberList', (req,res) => {
    const userid = req.headers['userid']
    
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    User.findOne({_id:userid}).populate('Subscribe','image userName firstname lastname').exec((error,userDtaa) => {
        if(error ) {
         res.status(401).json({
            message: "Database Connection Issue",
            status: 400,
        })
        } else {
            if(userDtaa.Subscribe.length !==0){
                let uniquesubscribe = userDtaa.Subscribe.filter((c, index) => {
                    return userDtaa.Subscribe.indexOf(c) === index;
                });
                
                res.status(200).json({
                    message: "Data Found",
                    status: 200,
                    resulte:uniquesubscribe
                }) 
            }else {
                res.status(200).json({
                        message: "Data Found not",
                        status: 200,
                        resulte:userDtaa.Subscribe
                    }) 
            }
         
            //  res.status(200).json({
            //     message: "Data Found",
            //     status: 200,
            //     resulte:userDtaa
            // })
        }
    })

})

module.exports = Router