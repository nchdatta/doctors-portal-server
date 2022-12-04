const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
    treatment: {
        type: String,
        required: true
    },
    slots: {
        type: Array,
        required: true
    }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;