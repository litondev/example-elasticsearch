
import 'dotenv/config' 
import "../configs/database.mjs"

import UserModel from "../models/User.mjs";
import {BcryptHash} from "../helpers/Bcrypt.mjs";

for(let i=1;i<10;i++){
	(async () => {			

		await new UserModel({
			username : 'user'+i,
			email : 'user'+i+'@gmail.com',
			password : BcryptHash("12345678"),
			contacts : ['089','0897'],
			areas : [
				{name : 'area1'},
				{name : 'area2',type : 'B'}
			],
			identity : {
				card : '12jkhdkj'
			}
		}).save();
	})();

	console.log("Created User : "+i);	
}	

console.log("Seeder Done");

console.log("Please Press Ctrl + c To Close")

// process.exit();
