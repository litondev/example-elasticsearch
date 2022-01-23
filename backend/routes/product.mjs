// import express
import express from "express";
import multer from 'multer';

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
const parsingMultipartForm = multer({
	storage: multer.diskStorage({
        destination: (req, file, cb) => {                
            cb(null,"./assets/");
        },
        filename: function (req, file, cb) { 
            cb(null, file.fieldname + "-" + Date.now() + ".png");
        }
    }),
});
 
// Route get All Products
ProductRoute.get('/', ProductIndex);
// Route get single Product
ProductRoute.get('/:id', ProductShow);
// Route CREATE Product
ProductRoute.post('/', parsingMultipartForm.single('photo'),ProductCreate);
// Route UPDATE Product
ProductRoute.put('/:id',parsingMultipartForm.single('photo'),ProductUpdate);
// Route DELETE Product
ProductRoute.delete('/:id', ProductDestroy);
 
// export router
export default ProductRoute;