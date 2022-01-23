// import models
import ProductModel from "../models/Product.mjs";

// import helpers
import FormatResponse from "../helpers/FormatResponse.mjs";

// import validators
import {ValidateProduct} from "../validators/ProductValidator.mjs";

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
            photo : 1
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
    
        await new ProductModel(req.body).save()    

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

            if(product.photo){
                fs.unlinkSync("./assets/products/"+product.photo);
            }
        }

        await ProductModel.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });
    
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

        if(product.photo){
            fs.unlinkSync("./assets/products/"+product.photo);
        }

        await ProductModel.deleteOne({
            _id: req.params.id
        });
    
        return res.json({
            message : true
        });
    } catch (error) {    
        return FormatResponse.Failed(error,res);
    }
}