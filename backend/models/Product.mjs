// import mongoose 
import mongoose from "mongoose";
 
// Buat Schema
const Product = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price:{
        type : Number,
        required : true
    },
    photo : {
    	type : String,
    	required : false,
    	default : null
    },
    stock : {
    	type: Number,
    	required : false,
    	default : 0
    },
    description : {
    	type : String,
    	required : false,
    	default : null
    }
});
 
// export model
const ProductModel = mongoose.model('Products', Product);

export default ProductModel;