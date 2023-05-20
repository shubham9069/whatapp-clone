
const Message = require('../Modal/Message')
const mongoose = require('mongoose')

const new_message =async(req,res,next) => {
const {message,sender,receiver} = req.body;
var  messageFile = req.file
if(messageFile!=undefined) {
    messageFile["Url"] = `http://localhost:3001/${messageFile?.path}`
}


try{

    const data = new Message({
    message : message || "",
    sender: new mongoose.Types.ObjectId(sender),
    communication: [new mongoose.Types.ObjectId(receiver),new mongoose.Types.ObjectId(sender)],
    messageFile : messageFile || ""

    }) 
    await data.save();
    return res.status(200).json({ status: "success", message: "message is sent",messageFile});

}catch(err){
    console.log(err)
    return res.status(400).json({status:false,message:err})
}




}
const getmsg =async(req,res) => {
const {sender,receiver} = req.body;


try{

    // const data = await Message.find({$and :[{communication: receiver },{communication: sender }]})
    const data = await Message.find({communication:{$all:[receiver, sender ]}})
    
    return res.status(200).json({ status: "success", message:data});

}catch(err){
    console.log(err)
    return res.status(400).json({status:false,message:err})
}




}

module.exports={new_message,getmsg}