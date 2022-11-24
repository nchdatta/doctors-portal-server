const express = require('express');
const mongoose = require('mongoose');

const doctorSchema = require('../Schemas/doctorSchema');
const { verifyToken } = require('./userRouter');
const doctorRouter = express.Router();
const Doctor = mongoose.model('Doctor', doctorSchema);

// Get all doctors 
doctorRouter.get('/', verifyToken, async (req, res) => {
    try {
        const query = {};
        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (err) {
        res.status(500).json('Error fetching doctors data');
    }
})

// Post a doctor 
doctorRouter.post('/', verifyToken, async (req, res) => {
    try {
        const query = { name: req.body.name, email: req.body.email };
        const exists = await Doctor.findOne(query);
        if (!exists) {
            const doc = new Doctor(req.body);
            const doctor = await doc.save();
            res.json(doctor);
        } else {
            res.status(403).json('Doctor already registered.');
        }
    } catch (err) {
        res.status(500).json('Error fetching doctors data');
    }
})
// Delete a doctor 
doctorRouter.delete('/:id', verifyToken, async (req, res) => {
    try {
        const query = { _id: req.params.id };
        const doctor = await Doctor.deleteOne(query);
        res.json(doctor);
    } catch (err) {
        res.status(500).json('Cannot remove the doctor.');
    }
})


module.exports = doctorRouter;