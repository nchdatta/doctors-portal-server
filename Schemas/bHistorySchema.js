const mongoose = require('mongoose');
const bHistorySchema = mongoose.Schema({
    patientEmail: {
        type: String,
        required: true
    },
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
    payment: {
        type: String,
        required: true,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    status: {
        type: String,
        required: true,
        enum: ['Cancelled', 'Prescribed'],
        default: 'Cancelled'
    }
});
const BookingHistory = mongoose.model('BookingHistory', bHistorySchema);
module.exports = BookingHistory;