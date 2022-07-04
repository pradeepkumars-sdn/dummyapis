const bodyParser = require('body-parser');
const userModel = require('../models/userSchema')
const socialData = require('../models/userSocialData');



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











module.exports = {
    register:register,
    userSocialData:userSocialData
}