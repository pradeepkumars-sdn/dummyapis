const bodyParser = require('body-parser');
const userModel = require('../models/userSchema')
const socialData = require('../models/userSocialData');
const vendors = require('../models/associated_vendor');



  async function register(req, res){
    try{
        checkMail = await userModel.findOne({email:req.body.email});

        if(checkMail){
            res.status(401).json({message:"User Already Available"})
        }else{

            if(req.body.email == "" || req.body.name == "" || req.body.password == ""){
                res.status(201).json({message:"Please fill all the fields"})
            }else{
                let SaveData = new userModel(req.body);
              await  SaveData.save().then((result)=>{
                    res.status(200).json({message:"Registered Successfully", Data:result})
                })
            }
        }

    }
    catch(err){
        res.status(500).json(err)

    }
}

async function userSocialData(req, res){
    try{
        let saveSocial = new socialData(req.body)
         await saveSocial.save().then((result)=>{
             res.status(200).json({message:"Saved", data:result})
         })
    }
    catch(err){
        res.status(401).json(err)
    }
}

async function create_vendor(req, res){
    try{
       let checkMail = await vendors.findOne({vendorEmail:req.body.vendorEmail})
       
       if(!checkMail){

        let firstName = req.body.vendorName
        let random = Math.floor(1000 + Math.random() * 90000000)
        let unique_id = firstName.charAt(0)+ random;
           let vendorData = new vendors();
           vendorData.vendorName = req.body.vendorName
           vendorData.vendorEmail = req.body.vendorEmail
           vendorData.vendorAddress = req.body.vendorAddress
           vendorData.contact = req.body.contact
           vendorData.vendor_unique_id = unique_id

           await vendorData.save((err, result)=>{
               if(!err){
                   res.status(200).json({
                       message:"Vendor Registred Successfully",
                       Data: result
                   })
               }else{
                   console.log(err)
                  res.status(201).json({message:"Something erro", err})
               }
           })
       }else{
           res.status(201).json({message:"User Already Available"})
       }

    }catch(err){
        res.status(500).json(err)
    }
}

async function update_vendor(req, res){
try{
    
    await vendors.findByIdAndUpdate({_id:req.body._id},  {$set:{vendorName:req.body.vendorName}},{upsert:true}, (err, result)=>{
        if(!err){
            res.status({message:"Vendor Updated Successfully", result})
        }else{
            res.status(201).json({message:"Something error in the updation", err})
        }
    })
    

}catch(err){
    console.log(err);
    res.status(501).json(err)

}
     
}












module.exports = {
    register:register,
    userSocialData:userSocialData,
    create_vendor:create_vendor,
    update_vendor:update_vendor
}