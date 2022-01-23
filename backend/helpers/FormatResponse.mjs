import winston from "winston";

const FormatResponse = {
	Failed : (error,res) => {
		console.log(error.message);

		winston.loggers.get("dev").info(error.message);

		return res.status(500).json({
			message : parseInt(process.env.DEBUG_MODE) 
				? error.message
				: 'Terjadi Kesalahan'
		});
	}
}

export default FormatResponse;