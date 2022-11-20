const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serviceRouter = require('./Routers/ServiceRouter');
const bookingRouter = require('./Routers/bookingRouter');
const { userRouter } = require('./Routers/userRouter');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

// Middleware 
app.use(cors());
app.use(express.json());


// Mongoose connection 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ern2bzt.mongodb.net/doctors-portal?retryWrites=true&w=majority`;
mongoose.connect(uri)
    .then(() => console.log('Connection successful.'))
    .catch(err => console.log(err.message));



// User route 
app.use('/user', userRouter);
// Service route 
app.use('/service', serviceRouter);
// Booking route 
app.use('/booking', bookingRouter);





app.get('/', (req, res) => {
    res.send("Home route!");
})

// Default error handler 
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json('There is a server-side error.');
        console.log(err)
    }
})

app.listen(port, () => console.log('Listening port at', port));