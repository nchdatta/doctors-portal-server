const express = require('express');
const Doctor = require('../Schemas/doctorSchema');
const { verifyToken } = require('./userRouter');
const doctorRouter = express.Router();

// Get all doctors 
doctorRouter.get('/', async (req, res) => {
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
// Get doctors speciality 
doctorRouter.get('/speciality', async (req, res) => {
    try {
        const query = { speciality: req.query.speciality };
        const specialities = await Doctor.find(query, { name: 1 });
        res.json(specialities);
    } catch (err) {
        res.status(500).json('Error fetching doctors specialities');
    }
})


module.exports = doctorRouter;