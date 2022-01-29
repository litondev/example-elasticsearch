import {client} from "./connection.mjs";

client.indices.create({  
  index: 'products'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  
  else {
    console.log("Create index response: ",resp);
  }
});