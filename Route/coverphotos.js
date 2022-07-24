const express = require('express')
const Router = express.Router()
const path = require('path')
const SingupModel = require('../Model/MambaRegistration')
const validatecoverphoto = require('../Validation.js/coverphoto')


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


Router.put('/coverphotos', upload.single("coverphotos"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    const data = {
         coverphotos: req.file.path 
     /*   coverphotos: coverphotos */
    }
    SingupModel.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "update data successfully ",
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



module.exports = Router


