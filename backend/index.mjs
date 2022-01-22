import 'dotenv/config' 
import "./configs/database.mjs"

import express from "express"

import cors from "cors";

import bodyParser from "body-parser";

import ProductRoute from "./routes/product.mjs";

import winston from "winston";

winston.loggers.add("dev",{
	level : 'info',
	format : winston.format.json(),
	transports : [
		new winston.transports.File({
			filename : './loggings/dev.log'
		})
	]
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
    res.json({
        "message" : "Running"
    });
});

app.use('/product',ProductRoute);

app.listen(process.env.PORT || 3001,() => {
    console.log("Service App Is Running in port 3001");
});