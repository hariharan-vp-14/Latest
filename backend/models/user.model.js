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
      lastname: {
        type: String,
        required: true,
      },
    },

    age: {
      type: Number,
      required: true,
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
      minlength: 8,
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

    /* =========================
       EDUCATION DETAILS
    ========================== */
    educationLevel: {
      type: String,
      required: true,
      enum: ["High School", "Bachelor's", "Master's", "PhD", "Diploma", "Other"],
    },

    institution: {
      type: String,
      required: true,
    },

    /* =========================
       ADDITIONAL INFO
    ========================== */
    disabilityType: {
      type: String,
      enum: [
        "None",
        "Physical",
        "Visual",
        "Hearing",
        "Neurological",
        "Multiple",
        "Other",
      ],
      default: "None",
    },
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

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
