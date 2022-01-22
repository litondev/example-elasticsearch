import bcrypt from 'bcryptjs';

export const BcryptHash = (value) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(value, salt);

	return hash;
}

export const BcryptCheck = (value,hash) => {
	return bcrypt.compareSync(value, hash); 
}