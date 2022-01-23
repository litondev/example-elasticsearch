import { check,validationResult } from "express-validator";

export const ValidateProduct = (req) => {
	return (async (req) => {
		await check('title')

			.not()
			.isEmpty()
			.withMessage("Judul harus diisi")

			.isLength({max : 20})
			.withMessage("Judul terlalu panjang")

			.trim()
			.escape()
			.run(req);

		await check("price")

			.not()
			.isEmpty()
			.withMessage("Harga harus diisi")

			.isFloat()
			.withMessage("Harga tidak valid")

			.trim()
			.escape()
			.run(req);

		await check('stock')
		
			.isFloat()
			.withMessage("Stock tidak valid")

			.trim()
			.escape()
			.run(req);

		await check('description')

			.isLength({max : 200})
			.withMessage("Deskripsi terlalu panjang")

			.trim()
			.escape()
			.run(req);


		return !validationResult(req).isEmpty()
			? validationResult(req).array()[0]
			: false;
	})(req)
}