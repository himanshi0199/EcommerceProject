const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        Required:true,
    },
    description:{
        type:String,
        REquired:true,
    },
    price:{
        type:String,
        Required:true,
    },
   stock:{
        type:Number,
        Required:true,
        default:1,
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        Required:true,
        default:0,
    },
    category:{
        type:String,
        Required:true,
    },
    image:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    createdAt:{
           type:Date,
           default:Date.now,
    },
    role:{
        type:String,
        default:"User",
    },
},{timestamps:true})

const ProductModel = mongoose.model("products",ProductSchema)

module.exports = ProductModel