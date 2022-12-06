const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'Doctor'],
        default: 'User'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;