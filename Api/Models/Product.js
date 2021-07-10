const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    price:{type:Number,required:true},
    productImage:{type:Array,required:true},
    description:{type:String,required:true},
    size:{type:String,required:true},
})


module.exports=mongoose.model('Product',productSchema)