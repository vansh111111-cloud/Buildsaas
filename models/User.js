const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
  type: String,
  default: null,
  required: false,
  minlength: 6,
  select: false,
},
  provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    // ROLE MANAGEMENT
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // PLAN SYSTEM
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "expired"
    },

    subscriptionEnd: {
      type: Date,
      default: null
    },

    // PROJECT RELATION
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],

    // ACCOUNT STATUS
    isVerified: {
      type: Boolean,
      default: false
    },

    accountStatus: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    }
  },
  {
    timestamps: true // automatically adds createdAt & updatedAt
  },
     
);
// at bottom of User.js

module.exports = mongoose.model("User", userSchema);
