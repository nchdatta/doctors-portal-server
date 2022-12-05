const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Schemas/userSchema');
const userRouter = express.Router();

// Token verification middleware 
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json('Unauthorized access.');
    } else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, decoded) => {
            if (err) {
                res.status(403).json('Forbidden access.');
            } else {
                req.decoded = decoded;
                next();
            }
        })
    }
}

// Send jwt token to user 
userRouter.post('/verify-token', (req, res) => {
    // User contains email address 
    const user = req.body;
    const token = jwt.sign(user, process.env.JWT_SECRET_ACCESS, {
        expiresIn: '1d'
    });
    res.json({ success: true, accessToken: token });
})


// Get all users 
userRouter.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error occured on accessing users.' });
    }
})

// User role checking whether admin or not
userRouter.get('/role/:email', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.status(200).json({ role: user.role });
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized access.' });
    }
})
// Make a user an admin
userRouter.put('/admin/:email', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user.role !== 'admin') {
            const role = { $set: { role: 'admin' } }
            const user = await User.updateOne({ email: req.params.email }, role);
            res.json(user);
        }
    } catch (err) {
        res.status(500).json("Error occured on making user an admin.");
    }
})
// Make a user a Doctor
userRouter.put('/doctor', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.decoded.email });
        if (user.role === 'admin') {
            const role = { $set: { role: 'doctor' } }
            const user = await User.updateOne({ email: req.query.doctor }, role);
            res.json(user);
        } else {
            res.status(401).json("Unauthorized access.");
        }
    } catch (err) {
        res.status(500).json("Error occured on making user a doctor.");
    }
})

// Create a user 
userRouter.put('/', async (req, res) => {
    try {
        const filter = { email: req.body.email };
        const updateDoc = { $set: req.body };
        const user = await User.updateOne(filter, updateDoc, { upsert: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on insert/updating user.' });
    }
})
// Delete a user 
userRouter.delete('/:id', verifyToken, async (req, res) => {
    try {
        const requester = req.decoded.email;
        const reqUser = await User.findOne({ email: requester });
        if (reqUser.role === 'admin') {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized access.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error occured on insert/updating user.' });
    }
})



module.exports = { userRouter, verifyToken };