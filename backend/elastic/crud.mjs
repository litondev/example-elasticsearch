import {client} from "./connection.mjs";
   
// select / search
client.search({
 index: 'search-products',
 type: 'products',
 body: {
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