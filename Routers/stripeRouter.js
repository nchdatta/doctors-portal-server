const express = require('express');
require('dotenv').config();
const stripeRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SK_KEY);


stripeRouter.post("/stripe-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = price * 100;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ['card']
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});


module.exports = stripeRouter;