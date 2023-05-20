const express = require('express')
const Router =express.Router();
const multer = require('multer')
const {Register, login,AllUser} = require('../Controller/Authentication');
const { new_message, getmsg } = require('../Controller/Message');


//file storage Configration 
const Storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/assets')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
       
        cb(null,  uniqueSuffix + "-"+ file.originalname)
      }
})

const upload = multer({storage:Storage})   // THIS UPLOAD VARIABLE USED FOR UPLOAD A IMAGES 



//AUTHENTICATION
Router.post('/Register' ,upload.single("PicturePath"),Register)
Router.post('/Login' ,login)
Router.get('/allUser' ,AllUser)

//message
Router.post('/new-message' ,upload.single("messageFile"),new_message)
Router.post('/getmsg' ,getmsg)

module.exports = Router;