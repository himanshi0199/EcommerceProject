const express = require('express')
const UserController = require('../controllers/UserController')
const checkuserauth = require('../middleware/auth')
const ProductController = require('../controllers/ProductController')
const router = express.Router()

//UserController files
router.get('/getalluser',checkuserauth,UserController.getalluser) 
router.post('/userinsert',UserController.userinsert)
router.post('/verifylogin',UserController.verifylogin)
router.get('/logout',UserController.logout)
router.get('/getuserdetails',checkuserauth,UserController.getuserdetails)
router.post('/updatepassword',checkuserauth,UserController.updatepassword)
router.post('/updateprofile',checkuserauth,UserController.updateprofile)
router.get('/getsingleuser/:id',checkuserauth,UserController.getsingleuser)
router.get('/deleteuser/:id',checkuserauth,UserController.deleteuser)


//product Controller 
router.post('/createproduct',ProductController.createproduct)
router.get('/getallproduct',ProductController.getallproduct)
router.get('/getproductdetails/:id',ProductController.getproductdetails)
router.get('/deleteproduct/:id',ProductController.deleteproduct)


module.exports = router