// import models
import ProductModel from "../models/Product.mjs";

// import helpers
import FormatResponse from "../helpers/FormatResponse.mjs";

// import validators
import {ValidateProduct} from "../validators/ProductValidator.mjs";

import path from "path";

import multer from "multer";     

// function get All Products
export const ProductIndex = async (req, res) => {
    try {
       const products = await ProductModel
        .find()
        .select({
            _id : 1,
            title : 1,
            price : 1,
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
                price : 1
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
 
 const ProductUpload = multer({         
        // onFileUploadStart: function (file) {
        //     console.log(file.originalname + ' is starting ...')
        // },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {                
                cb(null,"./assets/");
            },
            filename: function (req, file, cb) { 
                cb(null, file.fieldname + "-" + Date.now() + ".png");
            }
        }),


        // limits: { 
        //     fileSize: 1 * 1000 * 1000
        // },

        // fileFilter: function (req, file, cb){     
        //     if(!['jpeg','jpg','png'].includes(file.mimetype)){
        //         return cb(new Error("File tidak valid"));
        //     }
          
        //     return cb(null, true);             
        //     } 
    }).single("photo");  

// export const ProductPhoto = (req,res) => {    
//     const ProductUpload = multer({ 
//         onFileUploadStart: function (file) {
//             console.log(file.originalname + ' is starting ...')
//         },
//         storage: multer.diskStorage({
//             destination: (req, file, cb) => {                
//                 cb(null,"./assets");
//             },
//             // filename: function (req, file, cb) { 
//             //     cb(null, file.fieldname + "-" + Date.now() + ".png");
//             // }
//         }),


//         // limits: { 
//         //     fileSize: 1 * 1000 * 1000
//         // },

//         // fileFilter: function (req, file, cb){     
//         //     if(!['jpeg','jpg','png'].includes(file.mimetype)){
//         //         return cb(new Error("File tidak valid"));
//         //     }
          
//         //     return cb(null, true);             
//         //     } 
//     }).single("photo");  

//     return new Promise((reslove,reject) => {        
//         return ProductUpload(req,res,(err) => {                
//             if(err){
//                 return reject(err);
//             }else{
//                 return reslove(true);
//             }
//         });
//     });
// }
// function Create Product
export const ProductCreate = async (req, res) => {

        ProductUpload(req,res,(err) => {
            console.log(err);
        });


    // try {                
    //     // console.log(req.file);

    //     let isNotValid = await ValidateProduct(req);

    //     if(isNotValid){
    //         return res.status(422).json({
    //             "message" : isNotValid.msg
    //         });
    //     }    


    //     return res.json({
    //         "message" : "p"
    //     });

    //     await new ProductModel(req.body).save()    

    //     return res.json({
    //         "message" : true
    //     });
    // } catch (error) {    
    //    return FormatResponse.Failed(error,res);
    // }
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
                _id : 1
            });

        if(!product) {            
            return res.status(404).json({
                message : "Not Found"
            })
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
                _id : 1
            });

        if(!product) {            
            return res.status(404).json({
                message: "Not Found"
            });
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