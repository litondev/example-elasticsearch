import axios from "axios";
import Router from "next/router";
import moment from "moment"
import { getCookies,setCookies,removeCookies } from 'cookies-next';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.interceptors.request.use(config => {  
    config.headers['Authorization'] = getCookies(null,'token').token ? 'Bearer '+getCookies(null,'token').token : null
    return config;
});


function refreshToken(){  
  // console.log("Refresh Token");

  if(getCookies(null,'token').token && typeof window !== 'undefined'){        
    let token = getCookies(null,'token').token.split(".") 
    
    const decodedJWT = JSON.parse(atob(token[1]));    
    const dateNow = new Date()
    const miliseconds = dateNow.getTime() / 1000
    
    // EXPIRED TOKEN 
    // console.log(moment(decodedJWT.exp*1000).format("hh:mm:ss"))
    // TIME TO REFRESH TOKEN
    // console.log(moment(decodedJWT.exp*1000).subtract(30,'seconds').format("hh:mm:ss"))
    // TIME NOW
    // console.log(moment(miliseconds*1000).format("hh:mm:ss"))

    if(moment(miliseconds*1000).isAfter(moment(decodedJWT.exp*1000).subtract(10,'minutes'))){
      let sendRefreshToken = axios;

      sendRefreshToken.defaults.headers = {
        Authorization : "Bearer " + getCookies(null,'token').token,
      }   

      return sendRefreshToken.post("/refresh-token")
      .then(res => {
        setCookies("token",res.data.access_token)     
      })
      .catch(err => {   
        removeCookies("token")            
        Router.push("/")
      })
    }
  }
}

axios.interceptors.response.use(async (res) => {  
  if(!res.data.access_token) await refreshToken();  
  return res;
});

export default axios;