import multer from 'multer';

const parsingMultipartForm = multer({
	storage: multer.diskStorage({
        destination: (req, file, cb) => {                
            return cb(null,"./assets/products/");
        },
        filename: function (req, file, cb) {         	
            return cb(null, file.fieldname + "-" + Date.now() + ".png");
        }
    }),
    fileFilter : (req,file,cb) => {
    	if(
    		file.mimetype == 'image/png' || 
    		file.mimetype == 'image/jpg' || 
    		file.mimetype == 'image/jpeg'
    	){
    		return cb(null,true);
    	}else{    	
    		return cb(new Error("File tidak valid"))
    	}
    },
    limits : {
    	fileSize : 1 * 1000 * 1000
    }   
}).single('photo')

const ProductUploadMiddleware = (req,res,next) => {
	return parsingMultipartForm(req,res,(err) => {
		if(!err){
			return next();
		}else{			
			return res.status(500).json({
				"message" : err.message
			})
		}
	});
}

export default ProductUploadMiddleware;