
import { useEffect,useState } from 'react';
import './App.css';
import Chat from './component/char_right/Chat';
import Sidebar from './component/sidebar/Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'




function App() {
  const [token,setToken] = useState("")
  const [logindata ,setLogindata] = useState({Email:"",Password:""})
  const [chat,setchat] = useState("")


  const login =async(e)=>{
    const {Email,Password} = logindata
    e.preventDefault();

    try{
      
      const response= await axios({
        method: "post",
       url:'http://54.178.189.195:3001/frontend/login',
       data:{Email,Password},
       header:{

       }
       })
       
       if(response.status == 200){
        
        const data = response?.data;
        setToken(data?.userData)
        window.localStorage.setItem("token",JSON.stringify(data?.userData))
      alert("login successful")
        }
        
      
     }
     catch(err){
      const error = err?.response?.data
     
      alert(error?.message)


     }


  }
  

   useEffect(()=>{
 const token = window.localStorage.getItem("token");
setToken(JSON.parse(token))




  },[])
  return (

    token ? 
    <>
    <div className="App">
    <div className="app_body">
    <Sidebar chat={chat} setchat={setchat} token={token}/>
    <Chat chat={chat} setchat={setchat} token={token}/>
    </div>
    </div>
    </>

    :
    <>

<div className=" d-flex justify-content-center align-items-center " style={{height:'100dvh'}} >
<form style={{maxWidth:'500px'}} onSubmit={login}>
<div className="mb-3">
  <label for="exampleFormControlInput1" className="form-label">Email address</label>
  <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" value={logindata?.Email} onChange={(e)=>setLogindata({...logindata,["Email"]:e.target.value})}/>
</div>
<div className="mb-3">
<label for="inputPassword5" className="form-label">Password</label>
<input type="password" id="inputPassword5" className="form-control" aria-labelledby="passwordHelpBlock"  value={logindata?.Password} onChange={(e)=>setLogindata({...logindata,["Password"]:e.target.value})}/>
<div id="passwordHelpBlock" className="form-text">
  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
</div>
<div className="mb-3">
<button type="submit" className="btn btn-primary" >submit</button>

</div>
</div>
</form>
</div>



    </>
  );
}

export default App;
