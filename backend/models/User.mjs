// import mongoose 
import mongoose from "mongoose";
 
// Buat Schema
const User = mongoose.Schema({
    username : { 
        type : String,
        required : true
    },

    email : {
    	type : String,
    	required : true        
    },

    password : {
    	type : String,
    	required : true
    },

    photo : {
        type : String,
        required : false,
        default : null
    },

    contacts : {
        type : [String],
        required : false,
        default : []
    },

    areas : {
        type : [
            mongoose.Schema({
                name : {
                    type : String,
                    required : true
                },
                type : {
                    type : String,
                    required : false,
                    default : 'A'
                }
            })
        ],
        default : []
    },

    identity : {
        card : {
            type : String,
            required : false
        }    
    }
});
 
// export model
const UserModel = mongoose.model('Users', User);

export default UserModel;