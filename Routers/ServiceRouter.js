const express = require('express');
const mongoose = require('mongoose');
const Service = require('../Schemas/ServiceSchema');
const serviceRouter = express.Router();

// Get all services 
serviceRouter.get('/', async (req, res) => {
    try {
        const query = {};
        const services = await Service.find(query);
        res.json(services);
    } catch (err) {
        res.status(500).json('Error fetching data');
    }
})


module.exports = serviceRouter;