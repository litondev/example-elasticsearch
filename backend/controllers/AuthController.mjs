import jwt from 'jsonwebtoken';
import UserModel from "../models/User.mjs";

import {ValidateSignin,ValidateSignup} from "../validators/AuthValidator.mjs";
import {BcryptCheck,BcryptHash} from "../helpers/Bcrypt.mjs";

import FormatResponse from "../helpers/FormatResponse.mjs";

export const AuthSignin = async (req, res) => {
	try{	
		let isNotValid = await ValidateSignin(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    

        let user = await UserModel.findOne({
        	email : req.body.email
        }).select({
        	_id : 1,
        	password : 1        	
        })

        if(!user){
        	return res.status(500).json({
        		"message" : "Email tidak ditemukan"
        	})
        }

        if(!BcryptCheck(req.body.password,user.password)){
        	return res.status(500).json({
        		"message" : "Password salah"
        	})
        }

		var token = jwt.sign({ 
			exp: Math.floor(Date.now() / 1000) + (60 * 60),
			sub : user.id		
		}, process.env.JWT_SECRET);

		return res.json({
			"access_token" : token
		});
	}catch(error){
       return FormatResponse.Failed(error,res);
	}
}

export const AuthSignup = async (req, res) => {
	try{
        let isNotValid = await ValidateSignup(req);

        if(isNotValid){
            return res.status(422).json({
                "message" : isNotValid.msg
            });
        }    

        let payload = req.body;

        payload["password"] = BcryptHash(payload["password"]);

        await new UserModel(payload).save()    

        return res.json({
            "message" : true
        })
	}catch(error){
       return FormatResponse.Failed(error,res);
	}
}

export const AuthMe = async(req,res) => {
	try{
	   let user = await UserModel
        .findById(req.jwt_sub)
        .select({
            username : 1,
            email : 1,
            identity: {
                card : 1
            }
        });
    
       if(!user){
            return res.status(401).json({
                "message" : "Unautohrized"
            });
       }       

       return res.json(user);
	}catch(error){
       return FormatResponse.Failed(error,res);
	}
}

