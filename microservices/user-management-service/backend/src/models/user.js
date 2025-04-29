const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["Customer", "RestaurantAdmin", "DeliveryPersonnel", "Admin"],
      default: "Customer",
    },
    googleId: String,
    facebookId: String,
    address: { type: String },
    phoneNumber: { type: String },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    membershipTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    averageRatingGiven: {
      type: Number,
      default: 0,
    },
    totalRatingsCount: {
      type: Number,
      default: 0,
    },

    stripeCustomerId:{
      type: String,
      default : null
    },

    /*favorites: [{
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      name: { type: String } 
    }]*/
    favorites: [
      {
        restaurantId: {
          type: String,
        },
        restaurantName: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
