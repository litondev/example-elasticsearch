// import express
import express from "express";

// import controllers
import { 
    AuthSignin, 
    AuthSignup,
    AuthMe,
} from "../controllers/AuthController.mjs";
 
    // express router
const AuthRoute = express.Router();
 

AuthRoute.post("/signin",AuthSignin);

AuthRoute.post("/signup",AuthSignup);

AuthRoute.get("/me",AuthMe);

// export router
export default AuthRoute;