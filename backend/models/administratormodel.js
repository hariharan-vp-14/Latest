const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const administratorSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC DETAILS
    ========================== */
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
      },
      lastname: {
        type: String,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    /* =========================
       EMAIL VERIFICATION
    ========================== */
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpiry: Date,

    /* =========================
       🔐 FORGOT PASSWORD
    ========================== */
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  { timestamps: true }
);

/* =========================
   🔐 PASSWORD HASHING
========================= */
administratorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   🔑 JWT GENERATION
========================= */
administratorSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

/* =========================
   🔍 PASSWORD COMPARE
========================= */
administratorSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const administratorModel = mongoose.model(
  "administrator",
  administratorSchema
);
module.exports = administratorModel;
