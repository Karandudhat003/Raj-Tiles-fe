// const mongoose = require("mongoose");

// const itemSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, unique: true },
//     description: { type: String, default: "" },
//     nrp: { type: Number, required: true, default: 0 },
//     mrp: { type: Number, required: true, default: 0 },
//     image: { type: String, default: null },
//   },
//   { timestamps: true }
// );


// module.exports = mongoose.model("Item", itemSchema);

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    nrp: { type: Number, required: true, default: 0 },
    mrp: { type: Number, required: true, default: 0 },
    image: { type: String, default: null },
    // 🔥 NEW: User ownership fields
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    createdByUsername: { type: String, required: true }
  },
  { timestamps: true }
);

// 🔥 NEW: Create compound index for unique name per user
itemSchema.index({ name: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Item", itemSchema);
