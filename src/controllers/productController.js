// const Product = require("../models/Product");
// const Item = require("../models/Item");

// // Add product
// exports.addProduct = async (req, res) => {
//   try {
//     const data = req.body;

//     if (!data.name || !data.number || !data.address) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, number and address are required."
//       });
//     }

//     const itemsWithQuantity = Array.isArray(data.items)
//       ? data.items.map(item => ({
//         item: item._id || item.item || item,
//         quantity: item.quantity || 1
//       }))
//       : [];

//     // Normalize includeGst to boolean
//     let includeGst = false;
//     if (data.includeGst !== undefined && data.includeGst !== null) {
//       if (typeof data.includeGst === "string") {
//         includeGst = data.includeGst === "true";
//       } else {
//         includeGst = Boolean(data.includeGst);
//       }
//     }

//     const newProduct = new Product({
//       name: data.name,
//       number: data.number,
//       address: data.address,
//       includeGst: includeGst,
//       dis: data.dis || "0",
//       value: data.value || "nrp",
//       date: data.date || new Date(),
//       items: itemsWithQuantity,
//     });

//     await newProduct.save();

//     const populatedProduct = await Product.findById(newProduct._id).populate("items.item");
//     const productObj = populatedProduct.toObject();

//     // Transform items
//     productObj.items = productObj.items
//       .map(itemEntry => itemEntry.item ? { ...itemEntry.item, quantity: itemEntry.quantity } : null)
//       .filter(Boolean);

//     console.log("✅ Product created with includeGst:", productObj.includeGst);

//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product: productObj
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error adding product",
//       error: error.message
//     });
//   }
// };

// // Get all products with populated items
// exports.getProducts = async (req, res) => {
//   try {
//     console.log("📥 Fetching all products...");

//     const products = await Product.find()
//       .populate("items.item")
//       .sort({ date: -1 })
//       .lean(); // Use lean() for better performance

//     const transformedProducts = products.map(product => {
//       // Ensure includeGst is always present as boolean
//       product.includeGst = product.includeGst === true;

//       // Ensure address has default value
//       if (!product.address) {
//         product.address = "SURAT";
//       }

//       // Transform items
//       product.items = product.items.map(itemEntry => {
//         if (itemEntry.item) {
//           return {
//             ...itemEntry.item,
//             quantity: itemEntry.quantity,
//           };
//         }
//         return null;
//       }).filter(item => item !== null);

//       return product;
//     });

//     console.log(`✅ Found ${transformedProducts.length} products`);

//     // Log first product to verify includeGst
//     if (transformedProducts.length > 0) {
//       console.log("📝 Sample product includeGst:", transformedProducts[0].includeGst);
//       console.log("📝 Sample product keys:", Object.keys(transformedProducts[0]));
//     }

//     res.json({
//       success: true,
//       products: transformedProducts
//     });
//   } catch (error) {
//     console.error("❌ Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message
//     });
//   }
// };

// // Get product by id
// exports.getProductById = async (req, res) => {
//   try {
//     console.log("📥 Fetching product:", req.params.id);

//     const product = await Product.findById(req.params.id)
//       .populate("items.item")
//       .lean();

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     // Ensure includeGst is always present as boolean
//     product.includeGst = product.includeGst === true;

//     // Ensure address has default
//     if (!product.address) {
//       product.address = "SURAT";
//     }

//     // Transform items to include quantity
//     product.items = product.items.map(itemEntry => {
//       if (itemEntry.item) {
//         return {
//           ...itemEntry.item,
//           quantity: itemEntry.quantity,
//         };
//       }
//       return null;
//     }).filter(item => item !== null);

//     console.log("✅ Product found:", product._id);
//     console.log("🏠 Address:", product.address);
//     console.log("🧾 Include GST:", product.includeGst);

//     res.json({
//       success: true,
//       product: product
//     });
//   } catch (error) {
//     console.error("❌ Error fetching product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching product",
//       error: error.message
//     });
//   }
// };

// // Update product
// exports.editProduct = async (req, res) => {
//   try {
//     const data = req.body;

//     if (data.items && Array.isArray(data.items)) {
//       data.items = data.items.map(item => ({
//         item: item._id || item.item || item,
//         quantity: item.quantity || 1
//       }));
//     }

//     // Normalize includeGst to boolean
//     if (data.includeGst !== undefined && data.includeGst !== null) {
//       if (typeof data.includeGst === "string") {
//         data.includeGst = data.includeGst === "true";
//       } else {
//         data.includeGst = Boolean(data.includeGst);
//       }
//     }

//     console.log("📤 Update data includeGst:", data.includeGst);

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       data,
//       { new: true, runValidators: true }
//     ).populate("items.item");

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     const productObj = updatedProduct.toObject();

//     // Transform items
//     productObj.items = productObj.items
//       .map(itemEntry => itemEntry.item ? { ...itemEntry.item, quantity: itemEntry.quantity } : null)
//       .filter(Boolean);

//     console.log("✅ Product updated, includeGst:", productObj.includeGst);

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       product: productObj
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating product",
//       error: error.message
//     });
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     console.log("📥 Deleting product:", req.params.id);

//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);

//     if (!deletedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     console.log("✅ Product deleted:", req.params.id);

//     res.json({
//       success: true,
//       message: "Product deleted successfully"
//     });
//   } catch (error) {
//     console.error("❌ Error deleting product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting product",
//       error: error.message
//     });
//   }
// };
const Product = require("../models/Product");
const Item = require("../models/Item");
const mongoose = require("mongoose");

// 🔥 Helper function to get default user ID
async function getDefaultUserId() {
  const User = mongoose.model("User");
  const defaultUser = await User.findOne({ username: "user1" });
  return defaultUser ? defaultUser._id.toString() : null;
}

// Add product
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.number || !data.address) {
      return res.status(400).json({
        success: false,
        message: "Name, number and address are required."
      });
    }

    const itemsWithQuantity = Array.isArray(data.items)
      ? data.items.map(item => ({
        item: item._id || item.item || item,
        quantity: item.quantity || 1
      }))
      : [];

    // Normalize includeGst to boolean
    let includeGst = false;
    if (data.includeGst !== undefined && data.includeGst !== null) {
      if (typeof data.includeGst === "string") {
        includeGst = data.includeGst === "true";
      } else {
        includeGst = Boolean(data.includeGst);
      }
    }

    // 🔥 Get userId from body OR use default user
    let userId = data.userId;
    let username = data.username || "Unknown User";
    
    if (!userId) {
      userId = await getDefaultUserId();
      username = "user1";
      console.log("⚠️ No userId provided, using default user1");
    }

    const productData = {
      name: data.name,
      number: data.number,
      address: data.address,
      includeGst: includeGst,
      dis: data.dis || "0",
      value: data.value || "nrp",
      date: data.date || new Date(),
      items: itemsWithQuantity,
    };

    // 🔥 Only add createdBy if userId exists
    if (userId) {
      productData.createdBy = userId;
      productData.createdByUsername = username;
    }

    const newProduct = new Product(productData);

    await newProduct.save();

    const populatedProduct = await Product.findById(newProduct._id).populate("items.item");
    const productObj = populatedProduct.toObject();

    // Transform items
    productObj.items = productObj.items
      .map(itemEntry => itemEntry.item ? { ...itemEntry.item, quantity: itemEntry.quantity } : null)
      .filter(Boolean);

    console.log("✅ Product created with includeGst:", productObj.includeGst);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: productObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message
    });
  }
};

// Get all products with populated items
exports.getProducts = async (req, res) => {
  try {
    console.log("📥 Fetching all products...");

    // 🔥 Get userId from query OR get all products
    const userId = req.query.userId;
    
    let query = {};
    if (userId) {
      query.createdBy = userId;
      console.log(`🔍 Filtering products for userId: ${userId}`);
    } else {
      console.log("📋 Fetching all products (no userId filter)");
    }

    const products = await Product.find(query)
      .populate("items.item")
      .sort({ date: -1 })
      .lean();

    const transformedProducts = products.map(product => {
      // Ensure includeGst is always present as boolean
      product.includeGst = product.includeGst === true;

      // Ensure address has default value
      if (!product.address) {
        product.address = "SURAT";
      }

      // Transform items
      product.items = product.items.map(itemEntry => {
        if (itemEntry.item) {
          return {
            ...itemEntry.item,
            quantity: itemEntry.quantity,
          };
        }
        return null;
      }).filter(item => item !== null);

      return product;
    });

    console.log(`✅ Found ${transformedProducts.length} products`);

    res.json({
      success: true,
      products: transformedProducts
    });
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

    const product = await Product.findById(req.params.id)
      .populate("items.item")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔥 Optional: Check ownership if userId provided
    const userId = req.query.userId;
    if (userId && product.createdBy && product.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied - this product belongs to another user",
      });
    }

    // Ensure includeGst is always present as boolean
    product.includeGst = product.includeGst === true;

    // Ensure address has default
    if (!product.address) {
      product.address = "SURAT";
    }

    // Transform items to include quantity
    product.items = product.items.map(itemEntry => {
      if (itemEntry.item) {
        return {
          ...itemEntry.item,
          quantity: itemEntry.quantity,
        };
      }
      return null;
    }).filter(item => item !== null);

    console.log("✅ Product found:", product._id);

    res.json({
      success: true,
      product: product
    });
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
    const data = req.body;

    // 🔥 Optional: Check ownership if userId provided
    const userId = data.userId;
    if (userId) {
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (existingProduct.createdBy && existingProduct.createdBy.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied - you can only edit your own products",
        });
      }
    }

    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map(item => ({
        item: item._id || item.item || item,
        quantity: item.quantity || 1
      }));
    }

    // Normalize includeGst to boolean
    if (data.includeGst !== undefined && data.includeGst !== null) {
      if (typeof data.includeGst === "string") {
        data.includeGst = data.includeGst === "true";
      } else {
        data.includeGst = Boolean(data.includeGst);
      }
    }

    console.log("📤 Update data includeGst:", data.includeGst);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    ).populate("items.item");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const productObj = updatedProduct.toObject();

    // Transform items
    productObj.items = productObj.items
      .map(itemEntry => itemEntry.item ? { ...itemEntry.item, quantity: itemEntry.quantity } : null)
      .filter(Boolean);

    console.log("✅ Product updated, includeGst:", productObj.includeGst);

    res.json({
      success: true,
      message: "Product updated successfully",
      product: productObj
    });
  } catch (error) {
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

    // 🔥 Optional: Check ownership if userId provided
    const userId = req.query.userId;
    if (userId) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (product.createdBy && product.createdBy.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied - you can only delete your own products",
        });
      }
    }

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
