const ProductModel = require("../models/Product")
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

cloudinary.config({
    cloud_name: "dwy8hd761",
    api_key: "822826584515219",
    api_secret: "tOwVhCBcpcPxothANYLY3kaYcX4",
    //secure :true
});

class ProductController {
   
        static createproduct = async(req,res)=>{
            try{
                 const file = req.files.image
                 const myimage = await cloudinary.uploader.upload(file.tempFilePath,{
                    folder:'productimage',
                 })
                 const result = new ProductModel({
                     name:req.body.name,
                     description:req.body.description,
                     price:req.body.price,
                     stock:req.body.stock,
                     numOfReviews:req.body.numOfReviews,
                     image:{
                        public_id:myimage.public_id,
                        url:myimage.secure_url,
                     },
                 })
                 await result.save()
                 res.status(201)
                 .json({
                    status:'success',
                    message:'Product created successfully',
                    result,
                 })
            }
            catch(err){
                console.log(err)
            }
        }

        static getallproduct = async(req,res)=>{
                     try{
                          //  res.send("hello user")
                const users = await ProductModel.find()
                res.status(201)
                .json({
                  status: "success",
                  message: "successful",
                  users,
                })
                     }
                     catch(err){
                        console.log(err)
                     }
        }

        static getproductdetails = async(req,res)=>{
            try{
              
                  //  res.send("hello user")
                  const users = await ProductModel.findById(req.params.id)
                  res.status(201)
                  .json({
                    status: "success",
                    message: "successful",
                    users,
                  })
              }
              catch(err){
                  console.log(err)
              }
        }

      
        static deleteproduct= async(req,res)=>{
            try{
                const productDelete = await ProductModel.findById(req.params.id)
                if(!productDelete){
                  return res.status(500)
                  .json({
                    status:'500',
                    message:'product not found'
                  })
                }
                await ProductModel.deleteOne(productDelete)

                res.status(200)
                .json({
                  status:"success",
                  message:"Product Successfully deleted"
                })
            }
            catch(err){
              console.log(err)
            }
          }
}
module.exports = ProductController