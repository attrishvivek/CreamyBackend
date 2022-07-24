const express = require('express')
const Router = express.Router()
const Transactionmodel = require('../Model/CearmyTransaction')
const UserModal = require('../Model/CreamyUser')
const TransactionVerification = require('../Validation.js/CreamyTransactionvalitation')
var mongoose = require('mongoose');
const { Referral } = require('../Model/CreamyReferral')




const { populate } = require('../Model/CearmyTransaction')
const Objectid = mongoose.Types.ObjectId;



Router.post('/transaction-ico', (req, res) => {
    const userid = req.headers['userid']
    const { mambaToken, ethAmount, maticAmount, usdAmount, transactionHash, transactionStats, usdCrrentAmount, senderID, usdMaticCrrentAmount, transactiontype } = req.body
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const validate = TransactionVerification({
        mambaToken
    })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        const date = new Date()
        const components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ]

        orderID = components.join("")
        // console.log("id", orderID)
        const Transaction = new Transactionmodel({
            userProfile: userid,
            orderID: orderID,
            mambaToken: mambaToken,
            ethAmount: ethAmount,
            maticAmount: maticAmount,
            usdAmount: usdAmount,
            transactionHash: transactionHash,
            transactionStats: transactionStats,
            usdCrrentAmount: usdCrrentAmount,
            usdMaticCrrentAmount: usdMaticCrrentAmount,
            senderID: senderID,
            transactiontype: transactiontype
        })
        Transaction.save().then((result) => {
            res.status(201).json({
                message: "Your Trancation Save Successfully",
                status: true,
                result: result
            })
        }).catch((err) => {
            res.status(500).json({
                massage: "server error",
                err: err,
                status: false
            })
        })
    }
})
/* *************************get full Details with user details and transaction ************ */
Router.get("/transactiondetails", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Transactionmodel.find({ userProfile: userid }).populate('userProfile').exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                result: results,
                status: 200,
            })
        }
    })
})
/* ************************* End get full Details with user details and transaction ************ */

/* *************************get full Details  transaction ************ */
Router.get("/tsxndetailsfor", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Transactionmodel.find({ userProfile: userid }).exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                result: results,
                status: 200,
            })
        }
    })
})
/* *************************End full Details  transaction ************ */
/* ****************************token count *************************** */
Router.get("/usertoken", (req, res) => {
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
    // console.log("userid", typeof userid)
    // Transactionmodel.aggregate([{ $match: {} }, {
    //     $group:
    //         { _id: null, sum: { $sum: "$mambaToken" } }
    // }])
    // Transactionmodel.aggregate([{ $match: { userProfile: userid } }, { $group: { _id: "$userProfile", TotalSum: { $sum: "$mambaToken" } } }]);
    // $group: {
    //     _id: { x : "$x" },
    //     y: { $first : "$y" }
    //   }
    Transactionmodel.aggregate([
        { $match: { userProfile: Objectid(userid) } },
        { $group: { _id: "$userProfile", totaltoken: { $sum: "$mambaToken" }, totaleth: { $sum: "$ethAmount" }, totalmatic: { $sum: "$maticAmount" }, totalusd: { $sum: "$usdAmount" } } }
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

/* **************************** END token count *************************** */

/* ******************************Manual Transaction put query******************** */
Router.put('/transactionmaunalupdate/:id', (req, res) => {
    const orderID = req.params['id']
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const { transactionHash, senderID } = req.body
    data = {
        transactionHash: transactionHash,
        senderID: senderID,
        transactiontype: 'Manual'
    }
    Transactionmodel.findOneAndUpdate({ orderID: orderID }, { $set: data }, { new: true }).then((result) => {
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

/* ****************************** ENd Manual Transaction put query******************** */

/* ****************************** Admin Transaction show details query******************** */
Router.get("/tsxndetailsforadmin", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Transactionmodel.find().populate('userProfile').exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                result: results,
                status: 200,
            })
        }
    })
})

/* ****************************** END Admin Transaction show details query******************** */

/* *************************** Admin Transaction Approve and Rejected query******************** */
Router.put('/transactionAdminupdate', (req, res) => {
    // const orderID = req.params['id']
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const { transactionStats, orderID } = req.body
    data = {
        transactionStats: transactionStats,
        orderID: orderID,
        transactionadmindate: new Date()
    }
    console.log("data", data)
    Transactionmodel.findOneAndUpdate({ orderID: orderID }, { $set: data }, { new: true }).populate('userProfile').then((result) => {
        res.status(200).json({
            message: "update data successfully ",
            result: result,
            status: 200,
        })
        // console.log("result", result)
        // let emailObj = {
        //     email: result.userProfile.email
        // }
        // console.log("emailObj", emailObj)
        // if (result.transactionStats === 'Accepted') {
        //     let sendLoginCredentials = Approved.sendMail(emailObj)
        // } else if (result.transactionStats === 'Rejected') {
        //     let sendLoginCredentials1 = Rejected.sendMail(emailObj)
        // } else {
        //     console.log(result.transactionStats)
        // }
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
})
/* ************************ End Admin Transaction Approve and Rejected query******************** */

/* ******************************** Admin total Token Sold **************************** */
Router.get('/getadmintotalsoldtoken', (req, res) => {
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
    Transactionmodel.aggregate(
        [
            { $group: { _id: null, maticAmount: { $sum: "$maticAmount" }, usdAmount: { $sum: "$usdAmount" }, ethAmount: { $sum: "$ethAmount" }, mambaToken: { $sum: "$mambaToken" }, } }
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
/* ******************************** End total Token Sold **************************** */

/* ****************************Transaction With Referrl system************************ */
Router.post('/transaction-counter', (req, res) => {
    const userid = req.headers['userid']
    const { mambaToken, ethAmount, maticAmount, usdAmount, transactionHash, transactionStats, usdCrrentAmount, senderID, usdMaticCrrentAmount, transactiontype } = req.body
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const validate = TransactionVerification({

    })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {

        Transactionmodel.find({ userProfile: userid }).count().exec((error, count) => {
            if (error) {
                return res.status(400).json({
                    message: "execute error",
                    error: error,
                    status: 400,
                })
            } else if (count) {
                const date = new Date()
                const components = [
                    date.getYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds()
                ]
                orderID = components.join("")
                console.log("id", orderID)
                const Transaction = new Transactionmodel({
                    userProfile: userid,
                    orderID: orderID,
                    mambaToken: mambaToken,
                    ethAmount: ethAmount,
                    maticAmount: maticAmount,
                    usdAmount: usdAmount,
                    transactionHash: transactionHash,
                    transactionStats: transactionStats,
                    usdCrrentAmount: usdCrrentAmount,
                    usdMaticCrrentAmount: usdMaticCrrentAmount,
                    senderID: senderID,
                    transactiontype: transactiontype
                })
                Transaction.save(function (err, book) {
                    console.log("book",book)
                    book.populate('userProfile', function (err, book) {
                        if (err) {
                            return res.status(400).json({
                                message: "someThing Wrong1",
                                error: err,
                                status: 400,
                            })
                        } else {
                            res.status(201).json({
                                message: "Your Trancation Save Successfully User",
                                status: true,
                                result: book
                            })
                           
                        }
                    })
                })
            } else {
                UserModal.findOne({ _id: userid }).exec((error, user) => {
                    if (error) {
                        return res.status(400).json({
                            message: "execute error",
                            error: error,
                            status: 400,
                        })
                    } else if (!user.refId) {
                        const date = new Date()
                        const components = [
                            date.getYear(),
                            date.getMonth(),
                            date.getDate(),
                            date.getHours(),
                            date.getMinutes(),
                            date.getSeconds(),
                            date.getMilliseconds()
                        ]

                        orderID = components.join("")
                        // console.log("id", orderID)
                        const Transactionwithoutref = new Transactionmodel({
                            userProfile: userid,
                            orderID: orderID,
                            mambaToken: mambaToken,
                            ethAmount: ethAmount,
                            maticAmount: maticAmount,
                            usdAmount: usdAmount,
                            transactionHash: transactionHash,
                            transactionStats: transactionStats,
                            usdCrrentAmount: usdCrrentAmount,
                            usdMaticCrrentAmount: usdMaticCrrentAmount,
                            senderID: senderID,
                            transactiontype: transactiontype
                        })
                        Transactionwithoutref.save(function (err, book) {
                            book.populate('userProfile', function (err, book) {
                                if (err) {
                                    return res.status(400).json({
                                        message: "someThing Wrong2",
                                        error: err,
                                        status: 400,
                                    })

                                } else {
                                    res.status(201).json({
                                        message: "Your Trancation Save Successfully User",
                                        status: true,
                                        result: book
                                    })
                                }
                            })
                        })

                    } else {
                        const date = new Date()
                        const components = [
                            date.getYear(),
                            date.getMonth(),
                            date.getDate(),
                            date.getHours(),
                            date.getMinutes(),
                            date.getSeconds(),
                            date.getMilliseconds()
                        ]

                        orderID = components.join("")
                        // console.log("id", orderID)
                        const Transactionwithref = new Transactionmodel({
                            userProfile: userid,
                            orderID: orderID,
                            mambaToken: mambaToken,
                            ethAmount: ethAmount,
                            maticAmount: maticAmount,
                            usdAmount: usdAmount,
                            transactionHash: transactionHash,
                            transactionStats: transactionStats,
                            usdCrrentAmount: usdCrrentAmount,
                            usdMaticCrrentAmount: usdMaticCrrentAmount,
                            senderID: senderID,
                            transactiontype: transactiontype
                        })
                        Transactionwithref.save((error, resultewithref) => {
                            resultewithref.populate('userProfile', function (error, resultewithref) {
                                if (error) {
                                    return res.status(400).json({
                                        message: "Registion exeution faild",
                                        status: false,
                                    })
                                } else {
                                    const date = new Date()
                                    const components = [
                                        date.getYear(),
                                        date.getMonth(),
                                        date.getDate(),
                                        date.getHours(),
                                        date.getMinutes(),
                                        date.getSeconds(),
                                        date.getMilliseconds()
                                    ]

                                    orderID = components.join("")
                                    console.log("id", orderID)
                                    const Transactionreferral = new Transactionmodel({
                                        userProfile: user.refId,
                                        orderID: orderID,
                                        mambaToken: (mambaToken * 15) / 100,
                                        ethAmount: null,
                                        maticAmount: null,
                                        usdAmount: null,
                                        transactionHash: "Referral Bonus",
                                        transactionStats: transactionStats,
                                        usdCrrentAmount: 0,
                                        usdMaticCrrentAmount: 0,
                                        senderID: '',
                                        transactiontype: 'Referral'
                                    })
                                    Transactionreferral.save(function (err, book) {
                                        book.populate('userProfile', function (err, book) {
                                            if (err) {
                                                return res.status(400).json({
                                                    message: "someThing Wrong",
                                                    error: err,
                                                    status: 400,
                                                })

                                            } else {
                                                res.status(201).json({
                                                    message: "Your Trancation Save Successfully ref",
                                                    status: true,
                                                    result: book
                                                })

                                            }
                                        })
                                    })

                                }

                            })
                        })
                    }
                })
            }

        })
    }
})

/* ****************************End Transaction With Referrl system************************ */

/* **************************** Transaction Admin Approve Add token ************************ */
Router.put('/transactionAdmintoken', (req, res) => {
    // const orderID = req.params['id']
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const { AdminTransactionWallet, AdminTransactionHash, orderID } = req.body
    data = {
        AdminTransactionWallet: AdminTransactionWallet,
        AdminTransactionHash: AdminTransactionHash,
        orderID: orderID
    }
    console.log("data", data)
    Transactionmodel.findOneAndUpdate({ orderID: orderID }, { $set: data }, { new: true }).populate('userProfile').then((result) => {
        res.status(200).json({
            message: "Add Admin Token Details",
            result: result,
            status: 200,
        })

        if (result.transactionHash == 'Referral Bonus') {
            let emailObj = {
                email: result.userProfile.email,
                transactionHash: result.transactionHash,
                senderID: result.senderID,
                mambaToken: result.mambaToken
            }
            let sendLoginCredentials1 = AdminBouns.sendMail(emailObj)
        } else {
            let emailObj1 = {
                email: result.userProfile.email,
                transactionHash: result.transactionHash,
                senderID: result.senderID,
                mambaToken: result.mambaToken
            }
            let sendLoginCredentials2 = AdminToken.sendMail(emailObj1)
        }




    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
})

/* **************************** Transaction Admin Approve Add token ************************ */

/* ***************************** Graph days,Monthly,Years data ***************************** */
Router.get('/getgraphdata', (req, res) => {

    var today = new Date();
    var first = today.getDate() - today.getDay();
    var firstDayWeek = new Date(today.setDate(first));
    var lastDayWeek = new Date(today.setDate(first + 6));
    var firstDayMonth = new Date(today.setDate(1));
    var lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    lastDayWeek.setHours(23, 59, 59, 0);
    lastDayMonth.setHours(23, 59, 59, 0);
    today = new Date().setHours(0, 0, 0, 0);

    Transactionmodel.aggregate([{
        $group: {
            _id: null,
            // "today": {
            //     $push: {
            //         $cond: {
            //             if: {
            //                 $gte: ["$createdAt", new Date()]
            //             },
            //             then: "$$ROOT",
            //             else: ''
            //         }
            //     }
            // }
            week: {
                $push: {
                    $cond: [{
                        $and: [{
                            $gte: ["$createdAt", new Date('01-01-2022')]
                        },
                        {
                            $lte: ["$createdAt", new Date()]
                        }
                        ]
                    },
                        "$$ROOT",
                        ''
                    ]
                },

            }
            // "month": {
            //     $push: {
            //         $cond: [{
            //             $and: [{
            //                 $gte: ["$createdAt", new Date(firstDayMonth)]
            //             },
            //             {
            //                 $lte: ["$createdAt", new Date(lastDayMonth)]
            //             }
            //             ]
            //         },
            //             "$$ROOT",
            //             ''
            //         ]
            //     }
            // }
        }
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



Router.get('/getmnthly', (req, res) => {
    const today = new Date()
    const month = today.getMonth()
    const day = today.getDay()
    const year = today.getFullYear()

    Transactionmodel.aggregate([{ $project: { "mambaToken": 1, createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, "_id": 0 } }], (error, resulte) => {
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

/* ***************************** END Graph days,Monthly,Years data ***************************** */


module.exports = Router