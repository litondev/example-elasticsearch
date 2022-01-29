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