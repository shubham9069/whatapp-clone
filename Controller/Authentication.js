var bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
const User = require('../Modal/User')


 const Register = async (req,res)=>{
var  {FullName,Email,Password} = req.body;
Email = Email.toLowerCase();
const image = req.file


  try{
    const userData = await User.findOne({Email:Email});
    
    if(userData) return res.status(404).json({status:false,message:"user is already Found "})

    const hash = bcrypt.hashSync(Password, 8);
    var userdata = new User({
        FullName,
        Email,
        Password: hash ,
        ProfilePic:{...image,imageUrl:`http://localhost:3001/${image.path}`}
    })

    await userdata.save()

    return res.status(200).json({status:true,message:"user is saved"})

  }catch(err){
    console.log(err)
    return res.status(404).json({status:false,message:err})

  }

}
 const login = async (req,res)=>{
var  {Email,Password} = req.body;
Email = Email.toLowerCase();


  try{

// The first argument to find() is the query criteria whereas the second argument to the find() method is a projection, and it takes the form of a document with a list of fields for inclusion or exclusion from the result set. You can either specify the fields to include (e.g. { field: 1 }) or specify the fields to exclude (e.g. { field: 0 }). The _id field is implicitly included, unless explicitly excluded.
// In your case, db.users.find({name.first}) will give an error as it is expected to be a search criteria.

// To get the name json : db.users.find({},{name:1})

// If you want to fetch only name.first

    const userData = await User.findOne({Email:Email});    // here {key:1} means field dikhani h and zero means field hide kerni h 


    // console.log(userData)
    if(!userData) return res.status(404).json({status:false,message:"user is does not exist "})

    if(bcrypt.compareSync(Password,userData?.Password)){

      return res.status(200).json({status:true,message:"user is login",userData});
    }else{
      return res.status(404).json({status:true,message:"user passowrd is wrong"})
    }
   

  }catch(err){

    return res.status(404).json({status:false,message:err})

  }

}

const AllUser = async(req, res)=>{
const {token} = req.body

try{

  const userdata = await User.find({},{Password:0})

  if(!userdata.length) return res.status(404).json({status:false,message:"no data found  "})

  return res.status(200).json({status:true,message:"user is found",userdata});

}
catch(err){
  return res.status(404).json({status:false,message:err})
}


}




module.exports={Register,login,AllUser}