// // // controllers/productController.js
// // const Product = require("../models/Product");
// // exports.addProduct = async (req, res) => {
// //   try {
// //     const data = req.body;

// //     // ✅ Basic validation
// //     if (!data.name || !data.number) {
// //       return res.status(400).json({ message: "Name and number are required." });
// //     }

// //     // ✅ Use items array directly (it's already array of ObjectIds)
// //     const itemIds = Array.isArray(data.items) ? data.items : [];

// //     // ✅ Create new product
// //     const newProduct = new Product({
// //       name: data.name,
// //       number: data.number,
// //       dis: data.dis || "",
// //       value: data.value?.type || data.value, // handle both object or string
// //       quantity: Number(data.quantity) || 0,
// //       items: itemIds,
// //     });

// //     await newProduct.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "Product added successfully",
// //       product: newProduct,
// //     });
// //   } catch (error) {
// //     console.error("Error adding product:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error adding product",
// //       error: error.message,
// //     });
// //   }
// // };



// // // 👉 Get All Products
// // exports.getProducts = async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json({ success: true, products });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching products",
// //       error: error.message,
// //     });
// //   }
// // };

// // // 👉 Get Product by ID
// // exports.getProductById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const product = await Product.findById(id);

// //     if (!product)
// //       return res.status(404).json({ message: "Product not found" });

// //     res.json({ success: true, product });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // 👉 Edit Product by ID
// // exports.editProduct = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const data = req.body;

// //     const existingProduct = await Product.findById(id);
// //     if (!existingProduct)
// //       return res.status(404).json({ message: "Product not found" });

// //     // Update product
// //     const updatedProduct = await Product.findByIdAndUpdate(id, data, {
// //       new: true,
// //       runValidators: true,
// //     });

// //     res.json({
// //       success: true,
// //       message: "Product updated successfully",
// //       product: updatedProduct,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error updating product",
// //       error: error.message,
// //     });
// //   }
// // };

// // // 👉 Delete Product by ID
// // exports.deleteProduct = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const product = await Product.findById(id);

// //     if (!product)
// //       return res.status(404).json({ message: "Product not found" });

// //     await Product.findByIdAndDelete(id);
// //     res.json({ success: true, message: "Product deleted successfully" });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error deleting product",
// //       error: error.message,
// //     });
// //   }
// // };



// const Product = require("../models/Product");

// // Add product
// exports.addProduct = async (req, res) => {
//   try {
//     const data = req.body;
//     const itemIds = Array.isArray(data.items) ? data.items : [];

//     const newProduct = new Product({
//       name: data.name,
//       number: data.number,
//       dis: data.dis || "",
//       value: data.value === "mrp" ? "mrp" : "nrp",
//       quantity: Number(data.quantity) || 0,
//       items: itemIds,
//     });

//     await newProduct.save();

//     res.status(201).json({ success: true, message: "Product added", product: newProduct });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error adding product", error: error.message });
//   }
// };

// // Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("items");
//     res.json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
//   }
// };

// // Get product by id
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("items");
//     if (!product) return res.status(404).json({ message: "Not found" });
//     res.json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error", error: error.message });
//   }
// };

// // Update product
// exports.editProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ success: true, message: "Updated", product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error updating", error: error.message });
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting", error: error.message });
//   }
// };


const Product = require("../models/Product");

// Add product
exports.addProduct = async (req, res) => {
  try {
    console.log("📥 Received product data:", req.body);

    const data = req.body;

    // Validation
    if (!data.name || !data.number) {
      return res.status(400).json({
        success: false,
        message: "Name and number are required."
      });
    }

    const itemIds = Array.isArray(data.items) ? data.items : [];

    const newProduct = new Product({
      name: data.name,
      number: data.number,
      dis: data.dis || "0",
      value: data.value || "nrp",
      quantity: Number(data.quantity) || 0,
      date: data.date || new Date(),
      items: itemIds,
    });

    await newProduct.save();

    console.log("✅ Product saved:", newProduct._id);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    console.log("📥 Fetching all products...");
    const products = await Product.find().populate("items").sort({ date: -1 });

    console.log(`✅ Found ${products.length} products`);

    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    console.log("📥 Fetching product:", req.params.id);

    const product = await Product.findById(req.params.id).populate("items");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log("✅ Product found:", product._id);

    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
};

// Update product
exports.editProduct = async (req, res) => {
  try {
    console.log("📥 Updating product:", req.params.id);
    console.log("📥 Update data:", req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log("✅ Product updated:", updatedProduct._id);

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    console.log("📥 Deleting product:", req.params.id);

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log("✅ Product deleted:", req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    });
  }
};
