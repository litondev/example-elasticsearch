// import express
import express from "express";
import UserUploadMiddleware from "../uploads/User.mjs";

// import controllers
import { 
   	UserIndex, 
    UserShow, 
    UserCreate, 
    UserUpdate,
    UserDestroy
} from "../controllers/UserController.mjs";

import {checkJwt} from "../middlewares/check-jwt.mjs";

// express router
const UserRoute = express.Router(); 

UserRoute.use(checkJwt);

// Route get All Users
UserRoute.get('/', UserIndex);
// Route get single User
UserRoute.get('/:id', UserShow);
// Route CREATE User
UserRoute.post('/',UserUploadMiddleware,UserCreate);
// Route UPDATE User
UserRoute.put('/:id',UserUploadMiddleware,UserUpdate);
// Route DELETE User
UserRoute.delete('/:id', UserDestroy);
 

// export router
export default UserRoute;