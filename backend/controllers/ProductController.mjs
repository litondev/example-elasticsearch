// import models
import ProductModel from "../models/Product.mjs";

// import helpers
import FormatResponse from "../helpers/FormatResponse.mjs";

// import validators
import {ValidateProduct} from "../validators/ProductValidator.mjs";

import { client } from "../elastic/connection.mjs";

import fs from "fs";

// function get All Products
export const ProductIndex = async (req, res) => {
    try {
       let filter = {};

       if(req.query.search){
            filter = {
                $and : [{
                    $or : [
                        {
                            title : {
                                $regex : ".*" + req.query.search + ".*",
                            },                                                        
                        }
                    ]
                }]           
            }
       }

       const products = await ProductModel
        .find(filter)
        .limit(req.query.per_page || 5)
        .sort({
            [req.query.order || 'createdAt'] : (req.query.ordering === 'asc' ? 1 : -1)
        })
        .select({
            _id : 1,
            title : 1,
            price : 1,
            photo : 1.,
            description : 1,
            stock : 1
        });

       return res.json(products);
    } catch (error) {       
       return FormatResponse.Failed(error,res);
    }    
}
 
// function get single Product
export const ProductShow = async (req, res) => {
    try {

        const product = await ProductModel
            .findById(req.params.id)
            .select({
                _id : 1,
                title : 1,
                price : 1,
                photo : 1
            });

        if(!product){
            return res.status(401).json({
                "message" : "Not Found"
            });
        }

        return res.json(product);
    } catch (error) {
        return FormatResponse.Failed(error,res);
    }
     
}
 
export const ProductCreate = async (req, res) => {
    try {                              
        let isNotValid = await ValidateProduct(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    

        if(req.file){
            req.body.photo = req.file.filename; 
        }
    
        let resMongodb = await new ProductModel(req.body).save()    

        console.log(resMongodb);

        console.log(resMongodb.id);
        console.log(resMongodb.title);
        console.log(resMongodb.price);
        console.log(resMongodb.stock);
        console.log(resMongodb.description);
               
        let resElastic = await client.create({
          index: 'products',
          type: 'product',
          id : resMongodb.id,
          body: {
                title : resMongodb.title,
                price : resMongodb.price,
                stock : resMongodb.stock,
                description : resMongodb.description,
                createdAt : resMongodb.createdAt
            }          
        })

        console.log(resElastic);

        return res.json({
            "message" : true
        });
    } catch (error) {    
       return FormatResponse.Failed(error,res);
    }
}
 
// function Update Product
export const ProductUpdate = async (req, res) => {
    try {
        let isNotValid = await ValidateProduct(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    

        const product = await ProductModel          
            .findById(req.params.id)
            .select({
                _id : 1,
                photo : 1
            });

        if(!product) {            
            return res.status(404).json({
                message : "Not Found"
            })
        }
        
        if(req.file){                        
            req.body.photo = req.file.filename;             

            if(product.photo && fs.existsSync("./assets/products/"+product.photo)){
                fs.unlinkSync("./assets/products/"+product.photo);
            }
        }

        let resMongodb = await ProductModel.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });

        console.log(resMongodb);

        let resElastic = await client.update({
            index: "products",
            type: "product",
            id: req.params.id,
            body: {            
                doc: {
                    price: req.body.price,
                    stock: req.body.stock,
                    title: req.body.title,
                    description : req.body.description
                }
            }
        })

        console.log(resElastic);

        return res.json({
            message : true
        });
    } catch (error) {        
        return FormatResponse.Failed(error,res);
    }
}
 
// function Delete Product
export const ProductDestroy = async (req, res) => {
    try {        
        const product = await ProductModel           
            .findById(req.params.id)
            .select({
                _id : 1,
                photo : 1
            });

        if(!product) {            
            return res.status(404).json({
                message: "Not Found"
            });
        }

        if(product.photo && fs.existsSync("./assets/products/"+product.photo)){
            fs.unlinkSync("./assets/products/"+product.photo);
        }

        let resMongodb = await ProductModel.deleteOne({
            _id: req.params.id
        });
        
        console.log(resMongodb);

        let resElastic = await client.delete({
            index: "products",
            type: "product",
            id: req.params.id
        })

        console.log(resElastic);

        return res.json({
            message : true
        });
    } catch (error) {    
        return FormatResponse.Failed(error,res);
    }
}

// searching -> done
// limit -> done
// orderBy -> done
// select -> done

// function Search Product With ElasticSearch
export const ProductElastic =  async (req,res) => {
   try {
    let initialSearch = {
        index: 'products',
        type: 'product',
        body: {         
            // _source : ["title"], -> only select
            // from : 1,
            size : req.query.per_page || 5,        
            sort : [
                {"createdAt" : "desc"}                            
            ]
        }        
    };

    if(req.query.search){        
        initialSearch.body.query = {    
            multi_match : {
                "query" : req.query.search,
                "type" : "phrase",
                "fields" : ["description","title","price","stock"]
            }
        }
    }

   
    let response = await client.search(initialSearch);

    console.log(response.body.hits.hits);

    return res.json({
        "message" : true
    })
   }catch (error) {        
    return FormatResponse.Failed(error,res);
   }
}