const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;