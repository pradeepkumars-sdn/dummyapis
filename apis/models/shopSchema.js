var mongoose = require('mongoose');



let schema = mongoose.Schema;

let shops = new schema(
    {
       shopName:{
           type:String,
            default:null
       },
       shopAddress:{
        type:String,
         default:null
    },
    registration_number:{
        type:String,
         default:null
    },
    registration_year:{
        type:String,
         default:null
    },
    shop_unique_code:{
        type:String,
         default:null
    },
        
        vendor_id:{
            type: mongoose.Types.ObjectId,
            ref: "vendors",
        }
       
       


    },
    {
        collection: "shops"
    }
    );




    module.exports = mongoose.model('shops', shops);
