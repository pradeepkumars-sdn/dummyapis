var mongoose = require("mongoose");
let schema = mongoose.Schema;

let vendors = new schema(
  {
    vendorName: {
      type: String,
      required:true
    },
    vendorEmail: {
        type: String,
        required:true
      },
    vendorAddress: {
        type: String,
        required:true
      },
      contact: {
        type: String,
        required:true
      },
      vendor_unique_id: {
        type: String,
        required:true
      },

      

    //   interest:[
    //       {
    //           working:{
    //               type:String
    //           }
    //       }
    //   ]

     
  },
  {
    collection: "vendors",
  }
);

module.exports = mongoose.model("vendors", vendors);
