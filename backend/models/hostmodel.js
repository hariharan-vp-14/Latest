const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC DETAILS
    ========================== */
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 3,
      },
      lastname: String,
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
      default: true,
    },

    /* =========================
       🔐 FORGOT PASSWORD
    ========================== */
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    /* =========================
       EXTRA HOST INFO
    ========================== */
    institution: String,
    address: String,
    designation: String,
    contact: String,
    totalNumberPhysical: Number,
  },
  { timestamps: true }
);

/* =========================
   🔐 PASSWORD HASHING
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   🔑 JWT GENERATION
========================= */
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

/* =========================
   🔍 PASSWORD COMPARE
========================= */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const hostModel = mongoose.model("Host", userSchema);
module.exports = hostModel;
