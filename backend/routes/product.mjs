// import express
import express from "express";

// import controllers
import { 
    ProductIndex, 
    ProductShow, 
    ProductCreate, 
    ProductUpdate,
    ProductDestroy
} from "../controllers/ProductController.mjs";
 
    // express router
const ProductRoute = express.Router();
 
// Route get All Products
ProductRoute.get('/', ProductIndex);
// Route get single Product
ProductRoute.get('/:id', ProductShow);
// Route CREATE Product
ProductRoute.post('/', ProductCreate);
// Route UPDATE Product
ProductRoute.put('/:id', ProductUpdate);
// Route DELETE Product
ProductRoute.delete('/:id', ProductDestroy);
 
// export router
export default ProductRoute;