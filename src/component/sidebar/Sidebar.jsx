import React, { useEffect, useState } from 'react'
import './sidebar.css'

const Sidebar = ({chat,setchat,token}) => {
  const [userData ,setUserData] =useState([])

  const getuser =async(e)=>{
    console.log("sds")
    

   await fetch(`http://54.178.189.195:3001/frontend/allUser`)
    .then((response) => response.json())
    .then((actualData) => {
        
    setUserData(actualData?.userdata)
    
  })
    .catch((err) => {
     console.log(err.message);
    });



  }

  useEffect(()=>{
    getuser();
      },[])
    
  return (
    <div className='sidebar-section'>
        <div className="Header">
            <img src={token?.ProfilePic?.length ? token?.ProfilePic[0]?.imageUrl :null } className='contact-img' />
            <p style={{margin:0}}>{token?.FullName}</p>
            <div>
                
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M13,2.05v3.03c3.39,0.49,6,3.39,6,6.92c0,0.9-0.18,1.75-0.48,2.54l2.6,1.53C21.68,14.83,22,13.45,22,12 C22,6.82,18.05,2.55,13,2.05z M12,19c-3.87,0-7-3.13-7-7c0-3.53,2.61-6.43,6-6.92V2.05C5.94,2.55,2,6.81,2,12 c0,5.52,4.47,10,9.99,10c3.31,0,6.24-1.61,8.06-4.09l-2.6-1.53C16.17,17.98,14.21,19,12,19z" fill="#54656f" /></g></g></svg>

<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"  fill="#54656f"/></svg>

<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#54656f" /></svg>
            </div>
        </div>
        <div className="contact">
            <div className='searchbox'>
            <i className="bi bi-search"></i>
                <input type="text" name="" placeholder='search your contact' />
            </div>


             {userData?.filter(element=>element?._id!=token?._id).map((items)=>{
                
                return  <div className='contact-box' onClick={()=>setchat(items)}>
            <img src={items?.ProfilePic[0]?.imageUrl} className='contact-img' />
              <div>
              <h4 style={{marginBottom:'0.5rem',fontWeight:400}} >{items?.FullName}</h4>
              <p>this is my how are .....</p>
              </div>
              <p style={{fontSize:12}}>{new Date(items?.createdAt).toLocaleString()}</p>
            </div>
            
            })} 
          
         
        </div>
    </div>
  )
}

export default Sidebar