const UserModel = require('../models/User')
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


cloudinary.config({
    cloud_name: "dwy8hd761",
    api_key: "822826584515219",
    api_secret: "tOwVhCBcpcPxothANYLY3kaYcX4",
    //secure :true
});

class UserController{
          static getalluser = async(req,res)=>{
            try{
                //  res.send("hello user")
                const users = await UserModel.find()
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

          static getuserdetails = async(req,res)=>{
            try{
              const{id,name,email} = req.data1
                //  res.send("hello user")
                const users = await UserModel.findById(id)
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


          // static userinsert = async(req,res)=>{
          //   try{
          //      console.log(req.body)
          //   }
          //   catch(err){
          //     console.log(err)
          //   }
          // }

          static userinsert = async(req,res)=>{
            const {name,email,password,confirmpassword} = req.body
            const image = req.files.image
            //console.log(image)
            const imageupload = await cloudinary.uploader.upload(image.tempFilePath,{
                folder:'profileimageapi'
            })
            //console.log(imageupload)
            const user = await UserModel.findOne({email:email})
            //console.log(user)
               if (user){
                res
                    .status(401)
                    .json({status:"failed",message:"This email is already exist"});

               }
               else{
                   if(name && email && password && confirmpassword) {
                        if(password == confirmpassword){
                             try{
                              const hashpassword = await bcrypt.hash(password,10)
                              //console.log(hashpassword)
                              const result = new UserModel({

                                 name:name,
                                 email:email,
                                 password:hashpassword,
                                 image:{
                                  public_id:imageupload.public_id,
                                  url:imageupload.secure_url,
                                 },
                              })
                              await result.save()
                              res.status(201)
                              .json({
                                status:"success",
                                message:"Registration Successful"
                              })
                             }
                             catch(err){
                              console.log(err)
                             }
                           
                        }
                        else{
                              res.status(401)
                              .json({
                                status:"failed",
                                message:"All fields are required"
                              })   
                        }
                   }
               }
          }


          static verifylogin = async(req,res)=>{
            try{
                const {email,password} = req.body
                if(email && password){
                  const user = await UserModel.findOne({email:email})
                  if(user != null){
                    const isMatched = await bcrypt.compare(password,user.password)
                            if(isMatched){
                              const token = jwt.sign({ID:user._id},
                                     'himanshisharma83721@mca');
                                     //console.log(token)
                                     res.cookie('token',token)
                                     res.status(201)
                                     .json({
                                      status: 'success',
                                      message: 'successful',
                                      token:token,
                                      user,
                                     })
                            }
                            else{
                              res.status(401)
                              .json({
                                status: 'failed',
                                message: "email or password is not valid"
                              })
                            }

                  }
                  else{
                         res.status(401)
                              .json({
                                status: 'failed',
                                message: "you are not a registered user"
                              })
                  }
                }
                  else{
                    res.status(401)
                    .json({
                      status:"failed",
                      message:"all fields are required"
                    })
                  }
                }
            
            catch(err){
              console.log(err)
            }
          }




          static logout  = async(req,res)=>{
            try{
                      res.cookie('token',null,{
                        expires:new Date(Date.now()),
                        httpOnly:true,
                      })

                      res.status(201)
                      .json({
                        success:true,
                        message:'logged out'
                      })
            }
            catch(err){
              console.log(err)
            }
          }



          static updatepassword = async(req,res)=>{
            try{
                       const {id} = req.data1
                       const {old_password,new_password,confirm_password} = req.body;
                            if(old_password && new_password && confirm_password){
                                  const user = await UserModel.findById(id);
                                  const isMatched = await bcrypt.compare(old_password,user.password)
                                      if(!isMatched) {
                                        res.status(401)
                                        .json({
                                          status:"failed",
                                          message:"old password is incorrect"
                                        })
                                      }
                                      else{
                                           if(new_password !== confirm_password){
                                            res.status(401)
                                            .json({
                                              status:"failed",
                                              message:"password and confirm password does not matched"
                                            })
                                           }
                                           else{
                                               const newHashpassword = await bcrypt.hash(new_password,10)
                                               await UserModel.findByIdAndUpdate(id,{
                                                $set: {password:newHashpassword}
                                               })
                                               res.status(201)
                                               .json({
                                                status:'success',
                                                message:'Password updated successfully '
                                               })
                                           }
                                      }
                            }

                            else{
                                return res.status(400)
                                .json({
                                  status:"failed",
                                  message:"All fields are required"
                                })
                            }

            }
            catch(err){
              console.log(err)
            }
          }

          static updateprofile = async(req,res)=>{
            try{
                   const {id} = req.data1
                   if(req.files){
                    //update profile of user
                    const user = await UserModel.findById(id)
                    const image_id = user.image.public_id
                    await cloudinary.uploader.destroy(image_id)
                    const file = req.files.image 
                    const mycloud = await cloudinary.uploader.upload(file.tempFilePath,{
                            folder: 'profileimageapi',
                            width: 150,
                            crop:'scale'
                    })
                    var data =  {
                         name: req.body.name,
                         email:req.body.email,


                         image:{
                          public_id: mycloud.public_id,
                          url: mycloud.secure_url,
                         },
                    }
                   }
                   else{
                    var data = {
                      name: req.body.name,
                      email: req.body.email,
                    }
                   }
                   const result = await UserModel.findByIdAndUpdate(id,data)
                   res.status(200)
                   .json({
                    success:true,
                    message:'profile updated successfully',
                    result,
                   })
            }
            catch(err){
              console.log(err)
            }
          }




          //Admin Api
          static getsingleuser = async(req,res)=>{
            try{
                     const user = await UserModel.findById(req.params.id)
                     res.status(200)
                     .json({
                       success:true,
                       user,
                     })
            }
            catch(err){
              console.log(err)
            }
          }


          static deleteuser = async(req,res)=>{
            try{
                const userDelete = await UserModel.findById(req.params.id)
                if(!userDelete){
                  return res.status(500)
                  .json({
                    status:'500',
                    message:'user not found'
                  })
                }
                await UserModel.deleteOne(userDelete)

                res.status(200)
                .json({
                  status:"success",
                  message:"User Successfully deleted"
                })
            }
            catch(err){
              console.log(err)
            }
          }
}
module.exports = UserController