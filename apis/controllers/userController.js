const bodyParser = require("body-parser");
const userModel = require("../models/userSchema");
const socialData = require("../models/userSocialData");
const vendors = require("../models/associated_vendor");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

module.exports = {
  register: register,
  userSocialData: userSocialData,
  create_vendor: create_vendor,
  update_vendor: update_vendor,
  update_user: update_user,
  delete_user: delete_user,
  delete_vendor: delete_vendor,
  login: login,
  loggedInUser:loggedInUser
};

async function register(req, res) {
  try {
    checkMail = await userModel.findOne({
      email: req.body.email,
    });

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
        let SaveData = new userModel(req.body);
        await SaveData.save().then((result) => {
          res.status(200).json({
            message: "Registered Successfully",
            Data: result,
          });
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function userSocialData(req, res) {
  try {
    let saveSocial = new socialData(req.body);
    await saveSocial.save().then((result) => {
      res.status(200).json({
        message: "Saved",
        data: result,
      });
    });
  } catch (err) {
    res.status(401).json(err);
  }
}

async function create_vendor(req, res) {
  try {
    let checkMail = await vendors.findOne({
      vendorEmail: req.body.vendorEmail,
    });

    if (!checkMail) {
      let firstName = req.body.vendorName;
      let random = Math.floor(1000 + Math.random() * 90000000);
      let unique_id = firstName.charAt(0) + random;
      let vendorData = new vendors();
      vendorData.vendorName = req.body.vendorName;
      vendorData.vendorEmail = req.body.vendorEmail;
      vendorData.vendorAddress = req.body.vendorAddress;
      vendorData.contact = req.body.contact;
      vendorData.vendor_unique_id = unique_id;

      await vendorData.save((err, result) => {
        if (!err) {
          res.status(200).json({
            message: "Vendor Registred Successfully",
            Data: result,
          });
        } else {
          console.log(err);
          res.status(201).json({
            message: "Something erro",
            err,
          });
        }
      });
    } else {
      res.status(201).json({
        message: "User Already Available",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

async function update_vendor(req, res) {
  try {
    await vendors.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          vendorName: req.body.vendorName,
          vendorAddress: req.body.vendorAddress,
        },
      },
      {
        upsert: true,
      },
      (err, result) => {
        if (!err) {
          res.status({
            message: "Vendor Updated Successfully",
            result,
          });
        } else {
          res.status(201).json({
            message: "Something error in the updation",
            err,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(501).json(err);
  }
}

async function update_user(req, res) {
  let user_id = req.body._id;
  userModel.findOneAndUpdate(
    {
      _id: user_id,
    },
    {
      $set: {
        name: req.body.name,
        state: req.body.state,
        street: req.body.street,
        mobile: req.body.mobile,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
    (err, result) => {
      if (err) {
        res.status(201).json(err);
      } else {
        res.status(201).json({
          message: "Updated",
          result,
        });
      }
    }
  );
}

async function delete_user(req, res) {
  try {
    let user_id = req.body._id;

    userModel.findOneAndDelete(
      {
        _id: user_id,
      },
      (result, err) => {
        if (err) {
          res.status(201).json(err);
        } else {
          res.status(200).json({
            message: `User deleted`,
          });
        }
      }
    );
  } catch (error) {
    res.status(201).json(error);
  }
}

async function delete_vendor(req, res) {
  try {
    let vendor_id = req.body._id;
    vendors.findOneAndDelete(
      {
        _id: vendor_id,
      },
      (err, response) => {
        if (!err) {
          res.status(200).json({
            message: "Vendor Deleted Successfully",
          });
        } else {
          res.status(201).json(err);
        }
      }
    );
  } catch (error) {
    res.status(201).json(error);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    checkUser = await userModel.findOne({
      email: req.body.email,
    });
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
      console.log(payload)

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


async function loggedInUser(req, res){
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await userModel.findById(req.user.id);
        res.json({
          message: `User has been fetched of id ${req.user.id}`,
          data: user,
        });
      } catch (e) {
        res.send({ message: "Error in Fetching user" });
      }
}



