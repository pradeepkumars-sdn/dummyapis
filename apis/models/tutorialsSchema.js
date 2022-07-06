var mongoose = require('mongoose');



let schema = mongoose.Schema;

let tutorials = new schema(
    {
    
       title:{
           type:String,
           default:null
       },
       description:{
        type:String,
        default:null
    }
       


    },
    {
        collection: "tutorials"
    }
    );




    module.exports = mongoose.model('tutorials', tutorials);
