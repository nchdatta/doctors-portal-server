const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({
    treatmentId: mongoose.ObjectId,
    treatment: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    patientPhone: {
        type: Number,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    }
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;