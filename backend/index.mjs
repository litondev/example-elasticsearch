import 'dotenv/config' 
import "./configs/database.mjs"

import path from "path"
import express from "express"

import cors from "cors";

import bodyParser from "body-parser";

import winston from "winston";

// import multer from 'multer';

winston.loggers.add("dev",{
	level : 'info',
	format : winston.format.json(),
	transports : [
		new winston.transports.File({
			filename : './loggings/dev.log'
		})
	]
});

import ProductRoute from "./routes/product.mjs";
import AuthRoute from "./routes/auth.mjs";
import UserRoute from "./routes/user.mjs";

// const parsingMultipartForm = multer();

const app = express();

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());
// app.use(parsingMultipartForm.array());
app.use(cors());
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.json({
        "message" : "Running"
    });
});

app.use('/auth',AuthRoute);
app.use('/product',ProductRoute);
app.use('/user',UserRoute);

app.listen(process.env.PORT || 3001,() => {
    console.log("Service App Is Running in port 3001");
});