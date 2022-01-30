import { client } from "../elastic/connection.mjs";

try{
	let res = await client.cluster.health();	
   	console.log("-- Client Health --",res);
}catch(err){
	console.log(err);
}