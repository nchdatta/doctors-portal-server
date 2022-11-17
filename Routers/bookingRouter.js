const express = require('express');
const mongoose = require('mongoose');
const bookingSchema = require('../Schemas/bookingSchema');
const bookingRouter = express.Router();
const Booking = mongoose.model('Booking', bookingSchema);

// Get all bookings 
bookingRouter.get('/', async (req, res) => {
    try {
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
        const query = { treatment: req.body.treatment, date: req.body.date, patientEmail: req.body.patientEmail };
        const exists = await Booking.findOne(query);
        if (!exists) {
            const booking = new Booking(req.body);
            const bookingCollection = await booking.save();
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
