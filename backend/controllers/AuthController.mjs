import jwt from 'jsonwebtoken';
import UserModel from "../models/User.mjs";

import {ValidateSignin} from "../validators/AuthValidator.mjs";
import {BcryptCheck} from "../helpers/Bcrypt.mjs";

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

	}catch(error){
       return FormatResponse.Failed(error,res);
	}
}

export const AuthMe = async(req,res) => {
	try{
	   console.log(req.jwt_sub);

       return res.json({
        id : req.jwt_sub
       });
	}catch(error){
       return FormatResponse.Failed(error,res);
	}
}

