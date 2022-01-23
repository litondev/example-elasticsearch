import { check,validationResult } from "express-validator";
import UserModel from "../models/User.mjs";

export const ValidateUser = (req) => {
	return (async (req) => {
		await check('username')

			.not()
			.isEmpty()
			.withMessage("Username harus diisi")

			.isLength({max : 20})
			.withMessage("Username terlalu panjang")

			.trim()
			.escape()
			.run(req);

			await check('email')			

				.not()
				.isEmpty()
				.withMessage("Email harus diisi")

				.custom(value => {				
					let payload = {
						email :  value,
					}

					if(req.method == "PUT" || req.method == "put"){
						payload._id = {
							$ne : req.params.id
						}
					}

					return UserModel.findOne(payload)				
					.then(user => {
						if(user){
							return Promise.reject("Email telah terpakai")
						}
					})
				})

				.isLength({max : 20})
				.withMessage("Email terlalu panjang")

				.trim()
				.escape()
				.run(req);
		

		if(req.method == "POST" || req.method == "post"){
			await check('password')

				.not()
				.isEmpty()
				.withMessage("Password harus diisi")

				.isLength({min : 8})
				.withMessage("Password terlau pendek")

				.trim()
				.escape()
				.run(req);
		}

		await check('identity.card')	
			.not()
			.isEmpty()
			.withMessage("Ktp harus diisi")

			.trim()
			.escape()
			.run(req);

		await check('contacts')		
			.isArray()				
			.withMessage("Kontak tidak valid")

			.custom(value => {
				return new Promise((reslove,reject) => {
					if(!Array.isArray(value)){
						return reject("Kontak tidak valid");
					}

					if(value.length === 0){
						return reject("Kontak harus diisi")
					}

					let isErrorInside = false;

					value.forEach(item => {
						if(typeof item != 'string'){
							isErrorInside = true;							
						}				
					});	

					if(isErrorInside){
						return reject("Isi Kontak tidak valid");
					}

					reslove(value);
				});
			})					
			.run(req);	

		await check("contacts.*")
			.trim()
			.escape()
			.run(req);

		await check('areas')
			.isArray()
			.withMessage("Area tidak valid")			
			.run(req);

		await check('areas.*.name')
			.not()
			.isEmpty()
			.withMessage("Isi nama area ada yang kosong")

			.trim()
			.escape()
			.run(req);

		await check('areas.*.type')
			.custom(value => {
				return new Promise((reslove,reject) => {					
					if(value && !['A','B','C'].includes(value)){
						return reject('Isi type area ada yang tidak valid');
					}

					return reslove(true);
				});
			})

			.trim()
			.escape()
			.run(req);

		return !validationResult(req).isEmpty()
			? validationResult(req).array()[0]
			: false;
	})(req)
}