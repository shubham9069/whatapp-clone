import React, { useEffect, useMemo, useRef, useState } from 'react'
import './chat.css'
import axios from 'axios'
import {io} from 'socket.io-client'
import EmojiPicker from 'emoji-picker-react';

var socket = io("http://54.178.189.195:3002",{secure: true})


const Chat = ({chat,token}) => {
  const [msg,setmsg] = useState("")
  const [msgArr,setmsgArr] = useState([])
  const [emoji,setemoji] = useState(false)
  const [typing,settyping] = useState(false)
  const [onlineUser,setOnlineUser] = useState([])

 
const lastMessageRef = useRef()

const clickinput =()=>{

var input = document.getElementById('inputclip')
input.click()

}

  const sendmsg =async(e,image)=>{
    e.preventDefault();
   
   

    try{
      var formdata = new FormData();
      formdata.append('message',msg)
      formdata.append('sender',token?._id)
      formdata.append('receiver',chat?._id,)
      formdata.append('createdAt',new Date())
      if(image!=undefined){
        formdata.append('messageFile',image)
      }
      
      
      const response= await axios({
        method: "post",
       url:'http://54.178.189.195:3001/frontend/new-message',
       data:formdata,
       header:{
        'Content-Type': 'multipart/form-data'
       }
       })
       
       if(response.status == 200){
        
        const data = response?.data;
        
        var obj ={
          message:msg,
          sender:token?._id,
          receiver:chat?._id,
          createdAt:new Date(),
          messageFile: data?.messageFile
        }
        console.log(obj)
        socket.emit('new-msg',obj)
        setmsgArr([...msgArr,obj])
        setmsg("")
      
        }
        
      
     }
     catch(err){
      const error = err?.response?.data
     console.log(err)


     }
   

  }
  const getmsg =async()=>{
   

    try{
      
      const response= await axios({
        method: "post",
       url:'http://54.178.189.195:3001/frontend/getmsg',
       data:{
        sender:token?._id,
        receiver:chat?._id},
       header:{

       }
       })
       
       if(response.status == 200){
        
        const data = response?.data;
        setmsgArr(data?.message)
        
        }
        
      
     }
     catch(err){
      const error = err?.response?.data
     
      alert(error?.message)


     }
   

  }
  useEffect(()=>{
    getmsg();
  },[chat])
  
  useEffect(() => {
   
    socket.emit("new-user", token)
   
  }, []);
  useEffect(() => {
   
    socket.on("online-user",user =>{
      console.log(user)
      setOnlineUser(user)
    })
   
  }, []);

  useEffect(() => {
   
    socket.on("send-msg", data => {
  

      setmsgArr([...msgArr,data])
     
    });
    var falsetyping;
    socket.on("typing-server", data => {
      console.log("outside timout")
      settyping(true) 
      
clearTimeout(falsetyping)
       falsetyping = setTimeout(() =>{
        console.log("inside timeout")
        settyping(false)
      },1000)
    });

    
  }, [msgArr]);
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgArr]);


  const handleinput =(e)=>{

    setmsg(e.target.value)
    var obj ={
      
      sender:token?._id,
      receiver:chat?._id,
     
      
    }
    socket.emit("start-typing", obj)
  }
  const onlineuser = useMemo(()=>{

    return onlineUser.some(a=>a?._id==chat?._id) ? <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#5bb45b',display:'inline-block'}}></div>: <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'red',display:'inline-block'}}></div>

  },[onlineUser,chat])
  return (
  <div className="chat-section">
  {chat ? 
    <>
          <div className="Header">
            <img src={chat?.ProfilePic[0]?.imageUrl} className='contact-img' />
            <div   style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems: 'flex-start ',gridGap:0}}>
            <p style={{marginBottom:0,fontSize:20}}>{chat?.FullName} {onlineuser}</p>
            {typing ? <p style={{marginBottom:0,fontSize:13}}>typing....</p>
            :<p style={{marginBottom:0,fontSize:13}}>Last seen 3:45 PM</p>
            }
            
            </div>
            <div>
            <i className="bi bi-search" style={{fontSize:18,color:'#54656f'}}></i>
 
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#54656f" /></svg>
            </div>
        </div>
    <div className='whatapp-contact-container'  onClick={()=>setemoji(false)}>
    
{msgArr?.map((element)=>{

  return element?.sender==token?._id ?
  <div style={{backgroundColor:'#d9fdd3',margin: '0 0 1.5rem auto' }} ref={lastMessageRef} >
    <p style={{display:'inline-block',}}>{element?.message || <a href={element?.messageFile?.Url} target="_blank" className="messageFile-a">
    {/* for file message  */}
    {element?.messageFile?.mimetype == "image/png" ? 

  <svg width="50px" height="50px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M853.333333 960H170.666667V64h469.333333l213.333333 213.333333z" fill="#90CAF9" /><path d="M821.333333 298.666667H618.666667V96z" fill="#E1F5FE" /><path d="M448 490.666667l-149.333333 213.333333h298.666666z" fill="#1565C0" /><path d="M597.333333 563.2L490.666667 704h213.333333z" fill="#1976D2" /><path d="M672 522.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#1976D2" /></svg>

:
    element?.messageFile?.mimetype == "application/pdf" ? 

<svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 309.267 309.267" >
<g>
	<path style={{fill:'#E2574C'}} d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658
		c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z"/>
	<path style={{fill:"#B53629"}} d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z"/>
	<path style={{fill:"#FFFFFF"}} d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
		c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
		c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z
		 M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
		c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413
		c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964
		c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
		c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703
		c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z"/>
</g>
</svg> : 
<svg width="30px" height="30px" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.03 25.291C35.4996 25.291 34.9909 25.0803 34.6158 24.7052C34.2407 24.3301 34.03 23.8214 34.03 23.291V6.271H16C14.4087 6.271 12.8826 6.90313 11.7574 8.02835C10.6321 9.15357 10 10.6797 10 12.271V52.351C10 53.9423 10.6321 55.4684 11.7574 56.5936C12.8826 57.7188 14.4087 58.351 16 58.351H47.06C48.6504 58.3481 50.1748 57.715 51.2994 56.5904C52.424 55.4658 53.0571 53.9414 53.06 52.351V25.291H36.03Z" fill="#999999"/>
<path d="M51.88 21.291L38.03 7.44092V8.27094V21.291H51.06H51.88Z" fill="#000000"/>
</svg>
    }
    <p>{element?.messageFile?.originalname}</p>
    </a>}</p>
    <span style={{fontSize:11,color:'#667781',verticalAlign:'bottom',paddingLeft:8}}>{new Date(element.createdAt).toLocaleTimeString()}</span>
    </div>
    :
  <div style={{backgroundColor:"white"}} ref={lastMessageRef}>
  <p style={{display:'inline-block',}}>{element?.message || <a href={element?.messageFile?.Url} target="_blank" className="messageFile-a">
    {/* for file message  */}
    {element?.messageFile?.mimetype == "image/png" ? 

  <svg width="50px" height="50px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M853.333333 960H170.666667V64h469.333333l213.333333 213.333333z" fill="#90CAF9" /><path d="M821.333333 298.666667H618.666667V96z" fill="#E1F5FE" /><path d="M448 490.666667l-149.333333 213.333333h298.666666z" fill="#1565C0" /><path d="M597.333333 563.2L490.666667 704h213.333333z" fill="#1976D2" /><path d="M672 522.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#1976D2" /></svg>

:
    element?.messageFile?.mimetype == "application/pdf" ? 

<svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 309.267 309.267" >
<g>
	<path style={{fill:'#E2574C'}} d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658
		c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z"/>
	<path style={{fill:"#B53629"}} d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z"/>
	<path style={{fill:"#FFFFFF"}} d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
		c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
		c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z
		 M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
		c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413
		c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964
		c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
		c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703
		c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z"/>
</g>
</svg> : 
<svg width="30px" height="30px" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.03 25.291C35.4996 25.291 34.9909 25.0803 34.6158 24.7052C34.2407 24.3301 34.03 23.8214 34.03 23.291V6.271H16C14.4087 6.271 12.8826 6.90313 11.7574 8.02835C10.6321 9.15357 10 10.6797 10 12.271V52.351C10 53.9423 10.6321 55.4684 11.7574 56.5936C12.8826 57.7188 14.4087 58.351 16 58.351H47.06C48.6504 58.3481 50.1748 57.715 51.2994 56.5904C52.424 55.4658 53.0571 53.9414 53.06 52.351V25.291H36.03Z" fill="#999999"/>
<path d="M51.88 21.291L38.03 7.44092V8.27094V21.291H51.06H51.88Z" fill="#000000"/>
</svg>
    }
    <p>{element?.messageFile?.originalname}</p>
    </a>}</p>
    <span style={{fontSize:11,color:'#667781',verticalAlign:'bottom',paddingLeft:8}}>{new Date(element.createdAt).toLocaleTimeString()}</span>
    </div>
})}
    {/* reciver */}
   

    {/* sender */}
   


  
        </div>
        <div className="footer-chat">
        {emoji && ( <div className="chat-emoji"><EmojiPicker onEmojiClick={(emoji)=>setmsg((prev)=>prev+emoji?.emoji)}/></div>)}
       
        <div>
        <i class="bi bi-emoji-smile" style={{fontSize:20,color:'#54656f'}} onClick={()=>setemoji(true)}></i>
        
        <i class="bi bi-paperclip " style={{fontSize:20,color:'#54656f'}} onClick={clickinput}></i>
        <input type='file' hidden onChange={(e)=>sendmsg(e,e.target.files[0])} id="inputclip"></input>
        </div>

        <form onSubmit={sendmsg} style={{all:'inset',width:'100%',}}>
        <input type="text" placeholder='Send Your Message' value={msg} onChange={handleinput}/>
        </form>
        

        <div>
        <i class="bi bi-send" style={{fontSize:20,color:'#54656f'}} onClick={sendmsg}></i>
        </div>
            
        </div>
        </>
        :<div className="whatapp-logo-container">
          <svg viewBox="0 0 303 172" width="360" height="204" preserveAspectRatio="xMidYMid meet" class="" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M229.565 160.229C262.212 149.245 286.931 118.241 283.39 73.4194C278.009 5.31929 212.365 -11.5738 171.472 8.48673C115.998 35.6999 108.972 40.1612 69.2388 40.1612C39.645 40.1612 9.51318 54.4147 5.7467 92.952C3.0166 120.885 13.9985 145.267 54.6373 157.716C128.599 180.373 198.017 170.844 229.565 160.229Z" fill="#DAF7F3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M131.589 68.9422C131.593 68.9422 131.596 68.9422 131.599 68.9422C137.86 68.9422 142.935 63.6787 142.935 57.1859C142.935 50.6931 137.86 45.4297 131.599 45.4297C126.518 45.4297 122.218 48.8958 120.777 53.6723C120.022 53.4096 119.213 53.2672 118.373 53.2672C114.199 53.2672 110.815 56.7762 110.815 61.1047C110.815 65.4332 114.199 68.9422 118.373 68.9422C118.377 68.9422 118.381 68.9422 118.386 68.9422H131.589Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M105.682 128.716C109.186 128.716 112.026 125.908 112.026 122.446C112.026 118.983 109.186 116.176 105.682 116.176C104.526 116.176 103.442 116.481 102.509 117.015L102.509 116.959C102.509 110.467 97.1831 105.203 90.6129 105.203C85.3224 105.203 80.8385 108.616 79.2925 113.335C78.6052 113.143 77.88 113.041 77.1304 113.041C72.7503 113.041 69.1995 116.55 69.1995 120.878C69.1995 125.207 72.7503 128.716 77.1304 128.716C77.1341 128.716 77.1379 128.716 77.1416 128.716H105.682L105.682 128.716Z" fill="white"></path><rect x="0.445307" y="0.549558" width="50.5797" height="100.068" rx="7.5" transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.5547 41.6171)" fill="#42CBA5" stroke="#316474"></rect><rect x="0.445307" y="0.549558" width="50.4027" height="99.7216" rx="7.5" transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.9258 37.9564)" fill="white" stroke="#316474"></rect><path d="M57.1609 51.7354L48.5917 133.759C48.2761 136.78 45.5713 138.972 42.5503 138.654L9.58089 135.189C6.55997 134.871 4.36688 132.165 4.68251 129.144L13.2517 47.1204C13.5674 44.0992 16.2722 41.9075 19.2931 42.2251L24.5519 42.7778L47.0037 45.1376L52.2625 45.6903C55.2835 46.0078 57.4765 48.7143 57.1609 51.7354Z" fill="#EEFEFA" stroke="#316474"></path><path d="M26.2009 102.937C27.0633 103.019 27.9323 103.119 28.8023 103.21C29.0402 101.032 29.2706 98.8437 29.4916 96.6638L26.8817 96.39C26.6438 98.5681 26.4049 100.755 26.2009 102.937ZM23.4704 93.3294L25.7392 91.4955L27.5774 93.7603L28.7118 92.8434L26.8736 90.5775L29.1434 88.7438L28.2248 87.6114L25.955 89.4452L24.1179 87.1806L22.9824 88.0974L24.8207 90.3621L22.5508 92.197L23.4704 93.3294ZM22.6545 98.6148C22.5261 99.9153 22.3893 101.215 22.244 102.514C23.1206 102.623 23.9924 102.697 24.8699 102.798C25.0164 101.488 25.1451 100.184 25.2831 98.8734C24.4047 98.7813 23.5298 98.6551 22.6545 98.6148ZM39.502 89.7779C38.9965 94.579 38.4833 99.3707 37.9862 104.174C38.8656 104.257 39.7337 104.366 40.614 104.441C41.1101 99.6473 41.6138 94.8633 42.1271 90.0705C41.2625 89.9282 40.3796 89.8786 39.502 89.7779ZM35.2378 92.4459C34.8492 96.2179 34.4351 99.9873 34.0551 103.76C34.925 103.851 35.7959 103.934 36.6564 104.033C37.1028 100.121 37.482 96.1922 37.9113 92.2783C37.0562 92.1284 36.18 92.0966 35.3221 91.9722C35.2812 92.1276 35.253 92.286 35.2378 92.4459ZM31.1061 94.1821C31.0635 94.341 31.0456 94.511 31.0286 94.6726C30.7324 97.5678 30.4115 100.452 30.1238 103.348L32.7336 103.622C32.8582 102.602 32.9479 101.587 33.0639 100.567C33.2611 98.5305 33.5188 96.4921 33.6905 94.4522C32.8281 94.3712 31.9666 94.2811 31.1061 94.1821Z" fill="#316474"></path><path d="M17.892 48.4889C17.7988 49.3842 18.4576 50.1945 19.3597 50.2923C20.2665 50.3906 21.0855 49.7332 21.1792 48.8333C21.2724 47.938 20.6136 47.1277 19.7115 47.0299C18.8047 46.9316 17.9857 47.5889 17.892 48.4889Z" fill="white" stroke="#316474"></path><path d="M231.807 136.678L197.944 139.04C197.65 139.06 197.404 139.02 197.249 138.96C197.208 138.945 197.179 138.93 197.16 138.918L196.456 128.876C196.474 128.862 196.5 128.843 196.538 128.822C196.683 128.741 196.921 128.668 197.215 128.647L231.078 126.285C231.372 126.265 231.618 126.305 231.773 126.365C231.814 126.381 231.842 126.395 231.861 126.407L232.566 136.449C232.548 136.463 232.522 136.482 232.484 136.503C232.339 136.584 232.101 136.658 231.807 136.678Z" fill="white" stroke="#316474"></path><path d="M283.734 125.679L144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2005 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679Z" fill="white"></path><path d="M144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2004 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679" stroke="#316474"></path><path d="M278.565 121.405L148.68 130.463C146.256 130.632 144.174 128.861 144.012 126.55L138.343 45.695C138.181 43.3846 139.994 41.3414 142.419 41.1723L272.304 32.1142C274.731 31.945 276.81 33.7166 276.972 36.0271L282.641 116.882C282.803 119.193 280.992 121.236 278.565 121.405Z" fill="#EEFEFA" stroke="#316474"></path><path d="M230.198 129.97L298.691 125.193L299.111 131.189C299.166 131.97 299.013 132.667 298.748 133.161C298.478 133.661 298.137 133.887 297.825 133.909L132.794 145.418C132.482 145.44 132.113 145.263 131.777 144.805C131.445 144.353 131.196 143.684 131.141 142.903L130.721 136.907L199.215 132.131C199.476 132.921 199.867 133.614 200.357 134.129C200.929 134.729 201.665 135.115 202.482 135.058L227.371 133.322C228.188 133.265 228.862 132.782 229.345 132.108C229.758 131.531 230.05 130.79 230.198 129.97Z" fill="#42CBA5" stroke="#316474"></path><path d="M230.367 129.051L300.275 124.175L300.533 127.851C300.591 128.681 299.964 129.403 299.13 129.461L130.858 141.196C130.025 141.254 129.303 140.627 129.245 139.797L128.987 136.121L198.896 131.245C199.485 132.391 200.709 133.147 202.084 133.051L227.462 131.281C228.836 131.185 229.943 130.268 230.367 129.051Z" fill="white" stroke="#316474"></path><ellipse rx="15.9969" ry="15.9971" transform="matrix(0.997577 -0.0695704 0.0699429 0.997551 210.659 83.553)" fill="#42CBA5" stroke="#316474"></ellipse><path d="M208.184 87.1094L204.777 84.3593C204.777 84.359 204.776 84.3587 204.776 84.3583C203.957 83.6906 202.744 83.8012 202.061 84.6073C201.374 85.4191 201.486 86.6265 202.31 87.2997L202.312 87.3011L207.389 91.4116C207.389 91.4119 207.389 91.4121 207.389 91.4124C208.278 92.1372 209.611 91.9373 210.242 90.9795L218.283 78.77C218.868 77.8813 218.608 76.6968 217.71 76.127C216.817 75.5606 215.624 75.8109 215.043 76.6939L208.184 87.1094Z" fill="white" stroke="#316474"></path></svg>
          <h1>WhatApp Web</h1>
          <p>Send and receive messages without keeping your phone online.
          <br/>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
          </div>
  }
  </div>
  
)
        }

export default Chat