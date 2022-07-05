const bodyParser = require("body-parser");
// const userModel = require("../models/userSchema");
// const socialData = require("../models/userSocialData");
// const vendors = require("../models/associated_vendor");
const shopModel = require("../models/shopSchema");

module.exports = {
  createProduct: createProduct,
  add_shop: add_shop,
  deleteShop: deleteShop,
};

async function createProduct(req, res) {
  console.log(req.body);
}

async function add_shop(req, res) {
  try {
    let shopName = req.body.shopName;
    let shop = await shopModel.findOne({ shopName: req.body.shopName });
    if (shop) {
      res.status(201).json({ message: "Already Available" });
    } else {
      let firstName = req.body.shopName;
      let random = Math.floor(1000 + Math.random() * 90000000);
      let unique_id = firstName.charAt(0) + random;

      let shopData = new shopModel();
      shopData.shopName = shopName.toLowerCase();
      shopData.shopAddress = req.body.shopAddress;
      shopData.registration_number = req.body.registration_number;
      shopData.registration_year = req.body.registration_year;
      shopData.shop_unique_code = unique_id;
      shopData.vendor_id = req.body.vendor_id;
      await shopData.save().then((err, response) => {
        if (err) {
          res.status(201).json(err);
        } else {
          res
            .status(200)
            .json({ message: "Shop Added Successfully", Data: response });
        }
      });
    }
  } catch (error) {
    res.status(401).json(error);
  }
}

async function deleteShop(req, res) {
  try {
    shopModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { is_deleted: true } },
      { upsert: true },
      (err, response) => {
        if (err) {
          res.status(201).json(err);
        } else {
          res
            .status(200)
            .json({ message: "Shop Deleted Successfully", response });
        }
      }
    );
  } catch (error) {
    res.status(201).json(error);
  }
}
