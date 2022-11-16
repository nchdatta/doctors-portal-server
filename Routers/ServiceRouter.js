const express = require('express');
const mongoose = require('mongoose');
const serviceSchema = require('../Schemas/ServiceSchema');
const serviceRouter = express.Router();
const Service = mongoose.model('Service', serviceSchema);

// Get all services 
serviceRouter.get('/', async (req, res) => {
    try {
        const query = {};
        const services = await Service.find(query);
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json('Error fetching data');
    }
})


module.exports = serviceRouter;