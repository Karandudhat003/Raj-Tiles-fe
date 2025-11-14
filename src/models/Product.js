// const mongoose = require("mongoose");

// const Item = require("./Item");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },        
//   number: { type: String, required: true },
//   dis: { type: String, default: "" },
// value: { type: String, enum: ["nrp", "mrp"], required: true },
//   quantity: { type: Number, required: true, default: 0 }, // ✅ added quantity field
//   date: { type: Date, default: Date.now },
//   totalQuantity: { type: Number, default: 0 },
//   totalAmount: { type: Number, default: 0 },
//   items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
// });

// // Automatically calculate total quantity and amount before saving
// productSchema.pre("save", async function (next) {
//   if (this.items && this.items.length > 0) {
//     const itemsData = await Item.find({ _id: { $in: this.items } });
//     this.totalQuantity = itemsData.reduce((sum, i) => sum + i.quantity, 0);
//     this.totalAmount = itemsData.reduce(
//       (sum, i) => sum + i.quantity * i.rate,
//       0
//     );
//   }
//   next();                                         
// });

// mongoose.models = {};

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  dis: { type: String, default: "0" },
  value: { type: String, enum: ["nrp", "mrp"], required: true },
  quantity: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  totalQuantity: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
}, {
  timestamps: true
});

// Calculate totals before saving
productSchema.pre("save", async function (next) {
  if (this.items && this.items.length > 0) {
    const Item = mongoose.model("Item");
    const itemsData = await Item.find({ _id: { $in: this.items } });

    this.totalQuantity = itemsData.reduce((sum, i) => sum + (i.quantity || 0), 0);
    this.totalAmount = itemsData.reduce(
      (sum, i) => sum + (i.quantity || 0) * (i.rate || 0),
      0
    );
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
