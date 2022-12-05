const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const Booking = require('../Schemas/bookingSchema');
const { verifyToken } = require('./userRouter');
const User = require('../Schemas/userSchema');
const bookingRouter = express.Router();


// SendGrid mailing 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendBookingPending(booking) {
    const { treatment, date, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Booking Pending for ${treatment}`,
        text: `Booking Pending for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Booking pending for ${treatment} on ${date}</h2>
            <p>Once the doctor confrim your appointment, you'll get an email confirmation.</p>
            
            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
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
function sendBookingConfirmation(booking) {
    const { treatment, doctor, date, slot, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Appointment confirmed for ${treatment}`,
        text: `Appointment confirmed for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Appointment Confirmation for ${treatment}</h2>
            <p>Appointment Date: ${date}</p>
            <p>Appointment Slot: ${slot}</p>
            <p>Appointment Doctor: ${doctor}</p>
            <p>Please be present on exact date and time with previous health records.</p>

            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
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
function sendBookingCancel(booking) {
    const { treatment, date, patientEmail, patientName } = booking;
    const msg = {
        to: patientEmail,
        from: 'nayanchdatta11@gmail.com',
        subject: `Appointment Cancelled for ${treatment}`,
        text: `Appointment Cancelled for ${treatment}`,
        html: `
        <div>
            <h4>Hello, ${patientName}</h4>
            <h2>Appointment Cancelled for ${treatment} on ${date}</h2>

            <br/><br/>
            <h3>Doctors Portal</h3>
            <p>Visit our site for more information.</p>
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
// SendGrid mailing end

// Get all bookings for specific user
bookingRouter.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.decoded.email });
        let query = { patientEmail: req.query.email, date: { $gt: Date.now() } };
        const projection = { __v: 0 };
        const bookings = await Booking.find(query, projection);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing bookings.' });
    }
})
// Get all bookings
bookingRouter.get('/all', verifyToken, async (req, res) => {
    try {
        const projection = { __v: 0 };
        const bookings = await Booking.find({}, projection);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing bookings.' });
    }
})

// Booking api for POST 
bookingRouter.post('/', async (req, res) => {
    try {
        const { treatment, date, patientEmail } = req.body;
        const query = { treatment: treatment, date: date, patientEmail: patientEmail };
        const exists = await Booking.findOne(query);
        if (!exists) {
            const bookingDoc = new Booking(req.body);
            const booking = await bookingDoc.save();
            sendBookingPending(req.body);
            res.json({ success: true, booking });
        } else {
            res.status(403).json({ success: false, message: 'Already booked for a treatment on' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on inserting a document.' });
    }
})

// Cancel a booking
bookingRouter.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        sendBookingCancel(booking);
        res.send({ success: true, deletedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on deleting a booking' });
    }
})
// Confirm a booking [Doctors role]
bookingRouter.put('/confirm/:id', async (req, res) => {
    try {
        const confirmBooking = await Booking.findByIdAndUpdate(req.params.id, { $set: { status: 'Confirm' } }, { new: true });
        sendBookingConfirmation(confirmBooking);
        res.send({ success: true, confirmBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on updating a booking.' });
    }
})


// Get all bookings for a specific doctor
bookingRouter.get('/appointments', verifyToken, async (req, res) => {
    try {
        const projection = { __v: 0 };
        const appointments = await Booking.find({ doctor: req.query.doctor }, projection);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing appointments.' });
    }
})

module.exports = bookingRouter;
