import jwt from 'jsonwebtoken';

export const checkJwt = (req, res, next) => { 
  if(!req.headers["authorization"]){
  	res.status(401).json({
  		"message" : "Unauthorized"
  	});
  }

  if(req.headers.authorization.search("Bearer ") < 0){
  	res.status(401).json({
  		"message" : "Unauthorized"
  	})
  }

  try {
  	let [_,token] = req.headers.authorization.split("Bearer ");

  	let decode = jwt.verify(token, process.env.JWT_SECRET);

  	req.jwt_sub = decode.sub;
  } catch(err) {
  	console.log(err);
  	
    // winston logging
    
  	res.status(401).json({
  		"message" : "Unauthorized"
  	})
  }

  next()
}