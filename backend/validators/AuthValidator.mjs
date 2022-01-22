import { check,validationResult } from "express-validator";

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