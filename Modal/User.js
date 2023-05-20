const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema(
 {

    FullName:{
        type:String,
        require:true,
        min:[2,'plz fill min 2 letter'],
        max:50
    },
    Email:{
        type:String,
        require:true,
        min:2,
        max:50,
        unique:true
    },
    ProfilePic: {
        type:[Object],
        blackbox: true
        
    },
    Password:{
        type:String,
        require:true,
        min:8
    }},
 {timestamps:true}
)
const User = mongoose.model('User',UserSchema)

module.exports=User