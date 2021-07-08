const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../Models/Order')

//fetch all orders
router.get('/', (req, res, next) => {
    Order.find().exec().then((docs) => {
        res.status(200).json({
            message: 'Sending Get request',
            product: docs
        })
    }).catch((error) => {
        res.status(500).json({
            message: error
        })
    })

})

//create order
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
    order.save().then((result) => {
        res.status(200).json({
            message: 'Sending Post request',
            Details: result
        })
    }).catch((error) => {
        res.status(500).json({ error: error })
    })


})

//fetch single order
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    console.log('............................................', id)
    Order.findById(id).exec().then((result) => {
        console.log(result)
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({ error: error })
    })

})

//update order
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Order.update({ _id: id }, { $set: updateOps }).exec()
        .then((resul) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json({ message: error })
        })


})

//delete order
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id }).exec().then((docs) => {
        res.status(200).json({
            message: 'Order is deleted',
            id: id,
            result: docs
        })
    }).catch((error) => {
        res.status(500).json({
            message: error

        })
    })

})
module.exports = router;