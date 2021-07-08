const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../Models/Order');
const Product=require('../../Models/Product')

//fetch all orders
router.get('/', (req, res, next) => {
    Order.find().select("product quantity_id").populate("product","name").exec().then((docs) => {
        res.status(200).json({
           count:docs.length,
           orders:docs.map(doc=>{
               return{
                   _id:doc._id,
                   product:doc.product,
                   quantity:doc.quantity,
                   request:{
                    type:'GET',
                    url:'http:?/localhost:3000/orders/'+doc._id
                }     
              }
               }
           
          )
            })
    }).catch((error) => {
        res.status(500).json({
            message: error
        })
    })

})

//create order
router.post('/', (req, res, next) => {
Product.findById(req.body.productId)
.then(product=>{
    if(!product){
        return res.status(404).json({
            message:'Product not found'
        })
    }

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId
    })
    return order.save();
})
    .then((result) => {
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
    Order.findById(id).populate("product").exec().then((result) => {
        if(!result){
            return res.status(404).json({
                message:'Order not found'
            })
        }
        res.status(200).json({
            order:result,
            request:{
                type:'GET',
                url:'http:?/localhost:3000/orders/'
            }
        })
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
            result: docs,
            request:{
                type:'POST',
                url:'http:?/localhost:3000/orders/',
                body:{productId:'ID',quantity:'Number'}
            }
        })
    }).catch((error) => {
        res.status(500).json({
            message: error

        })
    })

})
module.exports = router;