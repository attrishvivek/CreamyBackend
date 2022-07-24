const express = require('express')
const Router = express.Router()
const ConversationModel = require("../Model/Conversation")
const mongoose = require('mongoose')

Router.post("/conversation", (req, res) => {
    const { receiverId } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const New = new ConversationModel({
        userId: new mongoose.Types.ObjectId(),
        members: [userid, receiverId]

    })
    New.save().then((results) => {
        res.status(201).json({
            message: "New conversaton Add",
            success: true,
            results: results,
            status: 201
        })
    }).catch(err => {
        res.status(500).json({
            message: " server error",
            success: false,
            error: err.message
        })
    })
})

Router.get("/get-conversation", (req, res) => {
    const allconversation = ConversationModel.find()
    allconversation.then(results => {
        if (results) {
            res.status(200).json({
                message: "All the data for Conversation",
                success: true,
                results: results
            })
        }
    })
})

Router.get("/get-conversation-one", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    console.log(userid)
    const oneconReq = ConversationModel.find({ members: { $in: [userid] }, })
    oneconReq.then((results) => {
        res.status(200).json({
            message: "Requirment Found",
            results: results,
            success: true,
        })
    }).catch(err => {
        res.status(500).json({
            message: "Server Error",
            error: err.message,
            success: false
        })
    })
})



module.exports = Router