const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const web = require('./routes/web')
const connectDB = require('./db/connectDB')
const fileUpload = require("express-fileupload")
const cookieParser = require('cookie-parser')
const cors = require('cors')

//cookie parser
app.use(cookieParser())
//for getting the data
app.use(express.json())

app.use(fileUpload({useTempFiles:true}));

app.use('/api',web)
app.use(cors())




//connect database
connectDB()
//server create

app.listen(process.env.PORT,()=>{
    console.log(`server running on localhost ${process.env.PORT}`)
})


