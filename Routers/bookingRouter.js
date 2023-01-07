const express = require('express');
require('dotenv').config();
const Booking = require('../Schemas/bookingSchema');
const { verifyToken } = require('./userRouter');
const { sendBookingPending, sendBookingCancel, sendBookingConfirmation } = require('../sendGrid');
const BookingHistory = require('../Schemas/bHistorySchema');
const bookingRouter = express.Router();


// Get all bookings for a specific user
bookingRouter.get('/', verifyToken, async (req, res) => {
    try {
        const query = { patientEmail: req.query.email, date: { $gt: Date.now() } };
        const projection = { __v: 0 };
        const bookings = await Booking.find(query, projection);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing bookings.' });
    }
})

// Get a booking 
bookingRouter.get('/booking/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id, { treatment: 1, patientEmail: 1, patientName: 1 }, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing a booking.' });
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
        const { treatment, patientEmail } = req.body;
        const query = { treatment, patientEmail };
        const exists = await Booking.findOne(query);
        if (!exists) {
            const bookingDoc = new Booking(req.body);
            const booking = await bookingDoc.save();
            sendBookingPending(req.body);
            res.json({ success: true, booking });
        } else {
            res.status(403).json({ success: false, message: `Already booked for a treatment on ${exists.date.toString().slice(0, 16)}` });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on inserting a document.' });
    }
})
// Cancel a booking
bookingRouter.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id, { new: true });
        sendBookingCancel(deletedBooking);
        res.send({ success: true, deletedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on deleting a booking' });
    }
})

// Payment for a booking
bookingRouter.put('/:id', async (req, res) => {
    try {
        const bookingPayment = await Booking.findByIdAndUpdate(req.params.id, { $set: { payment: 'Paid' } }, { new: true });
        res.send({ success: true, bookingPayment });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on doing payment for booking' });
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

// BookingHistory collection
// Get all bookings history for a specific user
bookingRouter.get('/history', verifyToken, async (req, res) => {
    try {
        const query = { patientEmail: req.query.email };
        const bHistory = await BookingHistory.find(query);
        res.json(bHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing booking history.' });
    }
})
// Insert a booking into BookingHistory collection
bookingRouter.post('/history', async (req, res) => {
    try {
        const bDoc = new BookingHistory(req.body);
        await bDoc.save();
        res.send({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on inserting a booking into BookingHistory' });
    }
})



module.exports = bookingRouter;
