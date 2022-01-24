// import express
import express from "express";

// import controllers
import { 
    AuthSignin, 
    AuthSignup,
    AuthMe,
    AuthRefreshToken
} from "../controllers/AuthController.mjs";
 
import {checkJwt} from "../middlewares/check-jwt.mjs";

    // express router
const AuthRoute = express.Router();
 

AuthRoute.post("/signin",AuthSignin);

AuthRoute.post("/signup",AuthSignup);

AuthRoute.get("/me",checkJwt,AuthMe);

AuthRoute.post("/refresh-token",checkJwt,AuthRefreshToken);

// export router
export default AuthRoute;