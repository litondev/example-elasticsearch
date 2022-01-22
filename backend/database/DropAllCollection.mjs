import 'dotenv/config' 
import "../configs/database.mjs"

import mongoose from "mongoose";

let countSuccess = 0;

mongoose.connection.db.dropCollection('users', (err, result) => {
	if(!err){
		console.log("Success Drop Collection User")
	}
	
	countSuccess++;
});


mongoose.connection.db.dropCollection('products', (err, result) => {
	if(!err){
		console.log("Success Drop Collection Product")
	}
	
	countSuccess++;		
});

let intervalCount = setInterval(() => {
	if(countSuccess == 2){
		mongoose.connection.close(() => {
		 	console.log("Close Conn");
		 	clearInterval(intervalCount);
		})
	};
},1000);
