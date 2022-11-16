const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({
    treatmentId: mongoose.ObjectId,
    treatment: {
        type: String,
        required: true
    },
    date: {
        type: String,
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

module.exports = bookingSchema;