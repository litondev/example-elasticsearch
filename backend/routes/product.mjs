// import express
import express from "express";
import ProductUploadMiddleware from "../uploads/Product.mjs";

// import controllers
import { 
    ProductIndex, 
    ProductShow, 
    ProductCreate, 
    ProductUpdate,
    ProductDestroy,

    ProductElastic
} from "../controllers/ProductController.mjs";
 
    // express router
const ProductRoute = express.Router();
 

// Route get All Products
ProductRoute.get('/', ProductIndex);

// Route Product Elastic
ProductRoute.get("/elastic",ProductElastic);

// Route get single Product
ProductRoute.get('/:id', ProductShow);
// Route CREATE Product
ProductRoute.post('/', ProductUploadMiddleware,ProductCreate);
// Route UPDATE Product
ProductRoute.put('/:id',ProductUploadMiddleware,ProductUpdate);
// Route DELETE Product
ProductRoute.delete('/:id', ProductDestroy);


// export router
export default ProductRoute;