const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../Models/Product')
//fetch all products
router.get('/', (req, res, next) => {
    Product.find().select('name price _id').exec().then((docs) => {
        const resposne={
            count:docs.length,
            product:docs.map(doc=>{
                return{
                    name:doc.name,
                price:doc.price,
                _id:doc._id,
                request:{
                    type:'GET',
                    url:'http:localhost:3000/products/'+doc._id
                }
                }
            })
        }
        res.status(200).json(resposne)
    }).catch((error) => {
        res.status(500).json({
            message: error
        })
    })


})

//create product
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
    product.save().then((result) => {
        res.status(200).json({
            message: 'Sending Post request',
            Details: result
        })
    }).catch((error) => {
        res.status(500).json({ error: error })
    })


})

//fetch product with id special
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log('............................................', id)
    Product.findById(id).exec().then((result) => {
        console.log(result)
        res.status(200).json({ result })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({ error: error })
    })
})


//update product by id
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps }).exec()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json({ message: error })
        })

})

//delete product with a id
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then((docs) => {
        res.status(200).json({
            message: 'product is deleted',
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