import { client } from "./connection.mjs";

/* Get the health status */
client.cluster.health({},function(err,resp,status) {  
   console.log("-- Client Health --",resp);
});