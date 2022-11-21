const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const bookingSchema = require('../Schemas/bookingSchema');
const { verifyToken } = require('./userRouter');
const bookingRouter = express.Router();
const Booking = mongoose.model('Booking', bookingSchema);


// SendGrid mailing 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendBookingConfirmation(booking) {
    const { treatment, date, patientEmail } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Booking confirm for ${treatment} on ${date}`,
        text: `Booking confirm for ${treatment} on ${date}`,
        html: `
        <div>
            <h4>Hello</h4>
            <h2>Booking Confirmation for ${treatment}</h2>
            <h4>Confirm on ${date}</h4>
            <p>Please visit our site for more information.</p>
        </div>
        `,
    };

    sgMail
        .send(msg)
        .then()
        .catch((error) => {
            console.error(error)
        })
}


// Get all bookings 
bookingRouter.get('/', verifyToken, async (req, res) => {
    try {
        // console.log(req.decoded)
        const query = { patientEmail: req.query.email };
        const projection = { __v: 0 };
        const bookings = await Booking.find(query, projection);
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on accessing bookings.' });
    }
})

// Booking api for POST 
bookingRouter.post('/', async (req, res) => {
    try {
        const { treatment, date, patientEmail } = req.body;
        const query = { treatment: treatment, date: date, patientEmail: patientEmail };
        const exists = await Booking.findOne(query);
        if (!exists) {
            const booking = new Booking(req.body);
            const bookingCollection = await booking.save();
            sendBookingConfirmation(req.body);
            res.status(200).json({ success: true, booking: bookingCollection });
        } else {
            res.status(500).json({ success: false, message: 'Already booked for a treatment on' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on inserting a document.' });
    }
})

// Delete a booking
bookingRouter.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, deletedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on inserting a document.' });
    }
})

module.exports = bookingRouter;
