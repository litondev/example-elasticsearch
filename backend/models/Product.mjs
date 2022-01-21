// import mongoose 
import mongoose from "mongoose";
 
// Buat Schema
const Product = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
});
 
// export model
const ProductModel = mongoose.model('Products', Product);

export default ProductModel;