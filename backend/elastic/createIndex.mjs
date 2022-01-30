import 'dotenv/config' 
import {client} from "./connection.mjs";

try{
	let healthRes = await client.cluster.health();

	console.log("-- Client Health --",healthRes);

	let indexRes = await client.indices.create({
	 index : 'products',
	});

	console.log("Create index response: ",indexRes);

	let mappingIndexRes = client.indices.putMapping({
		index : 'products',
		type : 'product',
		include_type_name : true,
		body : {
			product : {
				properties : {
					id : {
						type : "text",
					},
					title : {
						type : "text",
					},
					stock : {
						type : "integer"
					},
					price : {
						type : "integer"
					},
					description : {
						type : "text"
					},
					createdAt : {
						type : "date"
					}
				}
			}
		}
	})

	console.log("Create mapping index response: ",mappingIndexRes);
}catch(error){
	console.log(error);
}