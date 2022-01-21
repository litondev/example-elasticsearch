import 'dotenv/config' 
import "./configs/database.mjs"

import express from "express"
const app = express();
import cors from "cors";

import ProductRoute from "./routes/product.mjs";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        "message" : "Oke"
    });
});

app.use('/product',ProductRoute);

app.listen(process.env.PORT || 3001,() => {
    console.log("Service App Is Running in port 3001");
});