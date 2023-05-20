const mongoose = require('mongoose')



const MessageSchema = new mongoose.Schema(
 {

    message:{
        type:String,
        require:true,
        
    },
    sender:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:true,
    },
    communication:[{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:true,
    }],
    messageFile: {
        type:Object,
        blackbox: true
        
    },
},
    
 {timestamps:true}
)
const Message = mongoose.model('message',MessageSchema)

module.exports=Message