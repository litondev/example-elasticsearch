import {client} from "./connection.mjs";
   
// select / search
client.search({
 index: 'search-products',
 type: 'products',
 body: {
   "from" : 5,
   "size" : 10,
   "query": {  
    	"match_phrase": {
      		"title": { 
      			query: req.params.title, 
      			slop: 100 
      		}
    	}
   	}
 }
}).then(function(resp) {
  console.log("Successful query! Here is the response:", resp);
  res.send(resp);
}, function(err) {
 console.trace(err.message);
 res.send(err.message);
});  

// delete
client.delete({
	index: "store",
	type: "products",
	id: "10"
})
.then(function(resp) {
	console.log(resp);
},
function(err) {
	console.trace(err.message);
});

// update
client.update({
    index: "store",
    type: "products",
    id: "1",
    body: {
        // put the partial document under the `doc` key
        doc: {
            price: 5.99
        }
    }
})
.then(
    function(resp) {
        console.log("Successful update! The response was: ", resp);
    },
    function(err) {
        console.trace(err.message);
    }
);

import { client } from "./connection.mjs";

let dataArr = [];

for(let i=0;i<100;i++){
  dataArr.push(
    {
      _index  : 'search-products',
      _type   : 'products',
      _id      : i,
    },
    {
      title : "Product-"+i,
      price : 1000 * 10 * i,
      stock : i * 10,
      description : "Des-Product-"+i
    }
  );
}

client.bulk({
  maxRetries: 5,
  index: 'search-products',
  type: 'products',
  body: dataArr
},function(err,resp,status) {
    if (err) {
      console.log(err);
    } else {
      callback(resp.items);
    }
})