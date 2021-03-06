// import models
import UserModel from "../models/User.mjs";

// import helpers
import FormatResponse from "../helpers/FormatResponse.mjs";

// import validators
import {ValidateUser} from "../validators/UserValidator.mjs";

// import bcrypt
import {BcryptHash} from "../helpers/Bcrypt.mjs";

import fs from "fs";

// function get All Users
export const UserIndex = async (req, res) => {
    try {
       let filter = {};

       if(req.query.search){
            filter = {
                $and : [{
                    $or : [
                        {
                            username : {
                                $regex : ".*" + req.query.search + ".*",
                            },                                          
                        },
                        {
                            email : {
                                $regex : ".*" + req.query.search + ".*"
                            }                                          
                        }
                    ]
                }]           
            }
       }

       const users = await UserModel
        .find(filter)
        .limit(req.query.per_page || 5)
        .sort({
            [req.query.order || 'createdAt'] : (req.query.ordering === 'asc' ? 1 : -1)
        })
        .select({
            _id : 1,
            username : 1,            
            email : 1,
            photo : 1,
            contacts : 1,
            areas : 1,
            identity : {
                card : 1
            },
            createdAt : 1
        });

       return res.json(users);
    } catch (error) {       
       return FormatResponse.Failed(error,res);
    }    
}
 
// function get single User
export const UserShow = async (req, res) => {
    try {

        const user = await UserModel
            .findById(req.params.id)
            .select({
                _id : 1,
                username : 1,
                email : 1,
                photo : 1,
                contacts : 1,
                areas : 1,
                identity : {
                    card : 1
                },
                createdAt : 1
            });

        if(!user){
            return res.status(401).json({
                "message" : "Not Found"
            });
        }

        return res.json(user);
    } catch (error) {
        return FormatResponse.Failed(error,res);
    }
     
}
 
export const UserCreate = async (req, res) => {
    try { 

        let isNotValid = await ValidateUser(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    
        
        console.log(req.body);

        let payload = req.body;

        if(req.file){
            req.body["photo"] = req.file.filename; 
        }

        payload["password"] = BcryptHash(payload["password"]);

        await new UserModel(payload).save()    

        return res.json({
            "message" : true
        });
    } catch (error) {    
       return FormatResponse.Failed(error,res);
    }
}
 
// function Update User
export const UserUpdate = async (req, res) => {
    try {
        let isNotValid = await ValidateUser(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    

        const user = await UserModel          
            .findById(req.params.id)
            .select({
                _id : 1,     
                photo : 1       
            });

        if(!user) {            
            return res.status(404).json({
                message : "Not Found"
            })
        }
                
        console.log(req.body);

        let payload = req.body;

        if(req.file){                        
            req.body["photo"] = req.file.filename;             

            if(user.photo){
                fs.unlinkSync("./assets/users/"+user.photo);
            }
        }

        if(payload["password"]){
            payload["password"] = BcryptHash(payload["password"]);
        }

        await UserModel.updateOne({
            _id: req.params.id
        }, {
            $set: payload
        });
    
        return res.json({
            message : true
        });
    } catch (error) {        
        return FormatResponse.Failed(error,res);
    }
}
 
// function Delete User
export const UserDestroy = async (req, res) => {
    try {        
        const user = await UserModel           
            .findById(req.params.id)
            .select({
                _id : 1,            
                photo : 1
            });

        if(!user) {            
            return res.status(404).json({
                message: "Not Found"
            });
        }
    
        if(user.photo){
            fs.unlinkSync("./assets/users/"+user.photo);
        }

        await UserModel.deleteOne({
            _id: req.params.id
        });
    
        return res.json({
            message : true
        });
    } catch (error) {    
        return FormatResponse.Failed(error,res);
    }
}