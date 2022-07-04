var mongoose = require('mongoose');



let schema = mongoose.Schema;

let userSocialData = new schema(
    {
       facebook:{
           type:String,
            default:null
       },
       instagram:{
        type:String,
         default:null
    },
    snapchat:{
        type:String,
         default:null
    },
        
        user_id:{
            type: mongoose.Types.ObjectId,
            ref: "user",
        }
       
       


    },
    {
        collection: "userSocialData"
    }
    );




    module.exports = mongoose.model('userSocialData', userSocialData);
