const express = require('express');
const jwt = require('jsonwebtoken');
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

// Get all users 
userRouter.get('/', (req, res) => {
    res.json('All users');
})

// Send token to user 
userRouter.post('/verify-token', (req, res) => {
    // User contains email address 
    const user = req.body;
    const token = jwt.sign(user, process.env.JWT_SECRET_ACCESS, {
        expiresIn: '1d'
    });
    res.json({ success: true, accessToken: token });
})

module.exports = { userRouter, verifyToken };