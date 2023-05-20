const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv').config()
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const path  = require('path')
const frontend = require('./route/Frontend')
const { Server } = require("socket.io");

const io = new Server(3002, {
    cors: {
      origin: '*',
      credentials: true
    }}
    )

    var  user =[];
io.on("connection", (socket) => {
 
  console.log(socket.id, "is connected");

  socket.on("new-user",(userdata)=>{
    // console.log(userdata)
    user.push({...userdata,socketId:socket.id})
    io.emit('online-user',user)
  })
  
  socket.on('start-typing',(data)=>{
 
    const finduser = user.find(element => element?._id ==  data?.receiver)
    console.log(finduser)
    if(finduser){
      socket.to(finduser?.socketId).emit('typing-server')
    }
    
  })
  socket.on('new-msg',(data)=>{
 
    const finduser = user.find(element => element?._id ==  data?.receiver)
    console.log(finduser)
    if(finduser){
      socket.to(finduser?.socketId).emit('send-msg',data)
    }
    
  })
  socket.on('disconnect', () => {
    user = user?.filter(user => user?.socketId !=socket.id)
    
    io.emit('online-user',user)
    console.log('🔥: A user disconnected');
  });
  
 
  
});




// configration 
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
// app.use(morgan("common"))
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(cors())
app.use('/public/assets',express.static(path.join(__dirname,'public/assets')))



//MONGO DB CONNECT 
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL,{
    useNewURlparser:true,
    useUnifiedTopology:true,

}).then(()=>{

    console.log('DB is Connected ')
}).catch(err => console.log(err));


app.listen(PORT,()=>{
    console.log('server is running ' + PORT)
})


//Route
app.use('/Frontend',frontend)






