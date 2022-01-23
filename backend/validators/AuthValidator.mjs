import { check,validationResult } from "express-validator";
import UserModel from "../models/User.mjs";

export const ValidateSignin = (req) => {
	return (async (req) => {
		await check('email')

			.not()
			.isEmpty()
			.withMessage("email harus diisi")

			.isLength({max : 20})
			.withMessage("Email terlalu panjang")
			
			.isEmail()
			.withMessage("Email tidak valid")

			.trim()
			.escape()
			.run(req);

		await check("password")

			.not()
			.isEmpty()
			.withMessage("Password harus diisi")

			.isLength({min : 8})
			.withMessage("Password terlalu pendek")

			.trim()
			.escape()
			.run(req);

		return !validationResult(req).isEmpty()
			? validationResult(req).array()[0]
			: false;
	})(req)
}

export const ValidateSignup = (req) => {
	return (async (req) => {
		await check('username')
			.not()
			.isEmpty()
			.withMessage("Username harus diisi")

			.isLength({max : 200})
			.withMessage("Username telalu panjang")

			.trim()
			.escape()
			.run(req);
			
		await check('email')

			.not()
			.isEmpty()
			.withMessage("email harus diisi")

			.isLength({max : 20})
			.withMessage("Email terlalu panjang")
			
			.isEmail()
			.withMessage("Email tidak valid")

			.custom(value => {
				return UserModel.findOne({				
					email : value					
				})				
				.then(user => {
					if(user){
						return Promise.reject("Email telah terpakai")
					}
				})
			})

			.trim()
			.escape()
			.run(req);

		await check("password")

			.not()
			.isEmpty()
			.withMessage("Password harus diisi")

			.isLength({min : 8})
			.withMessage("Password terlalu pendek")

			.trim()
			.escape()
			.run(req);

		return !validationResult(req).isEmpty()
			? validationResult(req).array()[0]
			: false;
	})(req)
}