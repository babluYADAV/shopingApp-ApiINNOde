const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./Api/Routes/Products/Product')
const orderRoutes = require('./Api/Routes/Orders/Order');
//use as logger
app.use(morgan('dev'));


mongoose.connect('mongodb+srv://shivramyadav:lkjh7890@cluster0.koq7g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log('err', err);
    });

mongoose.Promise=global.Promise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// handle CORS error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Headers", 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next()
})
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


//for error handling if bad url hit
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);

})



app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;