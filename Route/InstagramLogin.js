const express = require("express")
const Router = express.Router()
const User = require("../Model/InstagramModel")
const config = require('./config1.json')
const monoose = require('mongoose')
var jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library')
const { response } = require('express')
const fetch = require('node-fetch-npm');



Router.post("/Instagramlogin", function (req, res) {
    const { userID, accessToken } = req.body;

    const url = `https:/api.instagram.com/oauth/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, config.instagramsecret, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + config.instagramsecret;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                config.instagramsecret,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );

})


module.exports = Router