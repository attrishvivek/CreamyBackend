const express = require("express")
const Router = express.Router()
const stripe = require('stripe')('sk_test_51KVh5xHNv2PwHEfHCBrvIxwXfIWiF7hEyK4Wek3cFXIcKJs2rLTqjgEkmVinQMkJIjOfSssev3Vtr0yKm6JZZpw800TcSQb5UK');
const uuid = require('uuid');

Router.post('/Stripe', (req, res) => {
    const { product, token } = req.body
    // const key = uuid()

    stripe.customers.create({
        email: token.email,

    }).then((customer) => {
        return stripe.charges.create({
            amount: product * 100,
            currency: 'usd',
            customer: customer._id,
            source: `tok_${token.card.brand.toLowerCase()}`,
            receipt_email: token.email
        })
        // console.log("customer", customer)
    }).then((result) => {
        // console.log("result", customer)
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((error) => {
        res.status(400).json({
            message: error,
            status: 400,
        })
    })


})


module.exports = Router