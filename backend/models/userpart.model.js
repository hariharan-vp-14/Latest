const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userParticipantSchema = new mongoose.Schema({
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
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: false,
    select: false,
  },
  eduInfo: {
    type: String,
  },
  age: {
    type: Number,
  },
  institution: {
    type: String,
  },
  disabilityType: {
    type: String,
  },
});

userParticipantSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

userParticipantSchema.methods.comparePassword = async function(Password) {
  return await bcrypt.compare(Password, this.password);
};

userParticipantSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const userParticipantModel = mongoose.model('userparticipant', userParticipantSchema);
module.exports = userParticipantModel;