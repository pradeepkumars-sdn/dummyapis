var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

let schema = mongoose.Schema;

let user = new schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
    },
    street: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    vendor_id: {
        type: mongoose.Types.ObjectId,
            ref: "vendors",
      },
  },
  {
    collection: "user",
  }
);

user.pre("save", async function (next) {
  try {
    //console.log("this is called");
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(this.password, salt);
    this.password = hasedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", user);
