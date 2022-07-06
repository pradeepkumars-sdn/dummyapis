const bodyParser = require("body-parser");
const adminModel = require("../models/adminSchema");
const userModel = require("../models/userSchema");
const socialData = require("../models/userSocialData");
const vendors = require("../models/associated_vendor");
const shopModel = require("../models/shopSchema");

var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { Mongoose } = require("mongoose");

module.exports = {
  registerAdmin: registerAdmin,
  adminLogin: adminLogin,
  loggedInUser: loggedInUser,
  //   loggedInUser:loggedInUser
  assingVendorToUser: assingVendorToUser,
  assignShopToVendor: assignShopToVendor,
  vendorList:vendorList
};

async function registerAdmin(req, res) {
  try {
    checkMail = await adminModel.findOne({
      email: req.body.email,
    });
    console.log(checkMail);
    if (checkMail) {
      res.status(401).json({
        message: "User Already Available",
      });
    } else {
      if (
        req.body.email == "" ||
        req.body.name == "" ||
        req.body.password == ""
      ) {
        res.status(201).json({
          message: "Please fill all the fields",
        });
      } else {
        let SaveData = new adminModel(req.body);
        await SaveData.save().then((result) => {
          res.status(200).json({
            message: "Admin Registered Successfully",
            Data: result,
          });
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function adminLogin(req, res) {
  const { email, password } = req.body;
  try {
    checkUser = await adminModel.findOne({
      email: req.body.email,
    });
    console.log(checkUser);
    if (!checkUser) {
      res.status(201).json({
        message: "Email not available please register",
      });
    } else {
      const isMatch = await bcrypt.compare(password, checkUser.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect Password !",
        });
      }
      const payload = {
        user: {
          id: checkUser.id,
        },
      };
      console.log(process.env.SECRETKEY);
      const token = jwt.sign(
        payload,
        process.env.SECRETKEY,
        {
          expiresIn: "3h",
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    }
  } catch (error) {
    res.status(201).json(error);
  }
}

async function loggedInUser(req, res) {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await adminModel.findById(req.user.id);
    res.json({
      message: `User has been fetched of id ${req.user.id}`,
      data: user,
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
}

async function assingVendorToUser(req, res) {
  try {
    let vendor = await vendors.findOne({ _id: req.body.vendor_id });

    userModel.updateOne(
      {
        _id: req.body._id,
      },
      {
        $push: {
          vendors: {
            vendor_id: vendor._id,
          },
        },
      },
      {
        upsert: true,
      },
      (err, response) => {
        if (err) {
          return err;
        } else {
          res
            .status(200)
            .json({ message: "Vendor Assigned to user", response });
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
}

async function assignShopToVendor(req, res) {
  try {
    let shop = await shopModel.findOne({ _id: req.body.shop_id });
    console.log(shop._id);
    vendors.updateOne(
      { _id: req.body.vendor_id },
      { $set: { shop_id: shop._id } },
      {
        upsert: true,
      },
      (err, response) => {
        if (err) {
          res.status(501).json(err);
        } else {
          res
            .status(200)
            .json({ message: "Shop Assigned to vendor", data: response });
        }
      }
    );
  } catch (error) {
    res.status(501).json(error);
  }
}

async function vendorList(req,res){
 try{
  // let userList = await userModel.find({})

  let vendorList = await vendors.aggregate([
    {
      $lookup:{
        from:"user",
        localField:"_id",
        foreignField:"vendor_id",
        as : "Assigned_User"
      }
    }

  ])
  let newData = []
  vendorList.map(x =>{
    x.Assigned_User.map(y=>{
      newData.push({
          vendorName:x.vendorName,
         vendorAddress: x.vendorAddress,
         contact:x.contact,
          AssignedUserName:y.name,
          AssignedUserEmail: y.email,
          assignedusercontact:y.mobile


      })
    })

    console.log(newData)
    
    // newData.push({
    //   vendorName:x.vendorName,
    //   vendorAddress: x.vendorAddress,
    //   contact:x.contact,
      
     
    // })
   
  })
  if(vendorList.length>0){
    res.status(200).json({message:"Vendor Fetched", Result:newData })
  }else{
    res.status(202).json("Something went wrong")

  }
 }
 catch(error){
   console.log(error)
  res.status(501).json(error)

 }
}
