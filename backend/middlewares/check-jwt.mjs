import jwt from 'jsonwebtoken';

export const checkJwt = (req, res, next) => { 
  try {
    if(!req.headers["authorization"]){
    	return res.status(401).json({
  		  "message" : "Unauthorized"
  	 });
    }

    if(req.headers.authorization.search("Bearer ") < 0){
    	return res.status(401).json({
  		  "message" : "Unauthorized"
  	 })
    }

  	let [_,token] = req.headers.authorization.split("Bearer ");

  	let decode = jwt.verify(token, process.env.JWT_SECRET);

  	req.jwt_sub = decode.sub;
  } catch(err) {
  	console.log(err);
  	
    // winston logging
    
  	return res.status(401).json({
  		"message" : "Unauthorized"
  	})
  }

  next()
}