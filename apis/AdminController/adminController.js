const bodyParser = require("body-parser");
const adminModel = require("../models/adminSchema");
// const socialData = require("../models/userSocialData");
// const vendors = require("../models/associated_vendor");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

module.exports = {
  registerAdmin: registerAdmin,
  adminLogin: adminLogin,
  loggedInUser:loggedInUser
  //   loggedInUser:loggedInUser
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
      console.log(process.env.SECRETKEY)
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
        const user = await adminModel.findById(req.user.id);
        res.json({
          message: `User has been fetched of id ${req.user.id}`,
          data: user,
        });
      } catch (e) {
        res.send({ message: "Error in Fetching user" });
      }
}