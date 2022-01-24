import axios from "axios";
import Router from "next/router";
import moment from "moment"
import { getCookies,setCookies,removeCookies } from 'cookies-next';

export default function axiosServer(context){
	var instance = axios.create({
    	baseURL : process.env.NEXT_PUBLIC_API_URL,
    	headers : {
      		'Authorization' : getCookies(context,'token').token ? 'Bearer '+getCookies(context,'token').token : null
    	}
  	})

	function refreshToken(){	
		// console.log("Refresh Token");

		if(getCookies(context,'token').token && typeof window === 'undefined'){				
			let token = getCookies(context,'token').token.split(".") 
			
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
				let sendRefreshToken = instance;
	
				sendRefreshToken.defaults.headers = {
					Authorization : "Bearer " + getCookies(context,'token').token,
				}		
	
				return sendRefreshToken.post("/refresh-token")
				.then(res => {
					console.log("Success Refresh Token")
					setCookies("token",res.data.access_token,scontext)	
				})
				.catch(err => {							
					console.log("Failed Refresh Token")
					removeCookies("token",context)	
					context.res.writeHead(302, {
						Location: '/auth/login'
					});					
					context.res.end();					
				})
			}
		}
	}

	instance.interceptors.response.use(async (res) => {	
		if(!res.data.access_token) await refreshToken();

		return res;
	});

	return instance;
}