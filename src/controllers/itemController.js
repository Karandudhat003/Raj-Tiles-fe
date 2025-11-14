// // // const Item = require("../models/Item");

// // // // ➕ Add new item
// // // exports.addItem = async (req, res) => {
// // //   try {
// // //     const { name, description, nrp, mrp, image } = req.body;

// // //     const existingItem = await Item.findOne({ name });
// // //     if (existingItem) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Item with this code already exists",
// // //       });
// // //     }

// // //     const newItem = new Item({
// // //       name,
// // //       description,
// // //       nrp,
// // //       mrp,
// // //       image,
// // //     });

// // //     await newItem.save();

// // //     res.status(201).json({
// // //       success: true,
// // //       message: "Item added successfully",
// // //       item: newItem,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error adding item:", error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Internal Server Error",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // 📋 Get all items
// // // exports.getAllItems = async (req, res) => {
// // //   try {
// // //     const items = await Item.find().sort({ createdAt: -1 });
// // //     res.status(200).json({
// // //       success: true,
// // //       items,
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Error fetching items",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ❌ Delete item
// // // exports.deleteItem = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const deleted = await Item.findByIdAndDelete(id);

// // //     if (!deleted) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Item not found",
// // //       });
// // //     }

// // //     res.status(200).json({
// // //       success: true,
// // //       message: "Item deleted successfully",
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Error deleting item",
// // //       error: error.message,
// // //     });
// // //   }
// // // };


// // const Item = require("../models/Item");
// // const path = require("path");

// // // ➕ Add new item
// // exports.addItem = async (req, res) => {
// //   try {
// //     const { name, description, nrp, mrp } = req.body;
// //     const image = req.file ? `/uploads/${req.file.filename}` : null; // file path

// //     const existingItem = await Item.findOne({ name });
// //     if (existingItem) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Item with this code already exists",
// //       });
// //     }

// //     const newItem = new Item({
// //       name,
// //       description,
// //       nrp,
// //       mrp,
// //       image,
// //     });

// //     await newItem.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "Item added successfully",
// //       item: newItem,
// //     });
// //   } catch (error) {
// //     console.error("Error adding item:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //       error: error.message,
// //     });
// //   }
// // };


// const Item = require("../models/Item");

// // ➕ Add new item
// exports.addItem = async (req, res) => {
//   try {
//     const { name, description, nrp, mrp } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     const existingItem = await Item.findOne({ name });
//     if (existingItem) {
//       return res.status(400).json({
//         success: false,
//         message: "Item with this name already exists",
//       });
//     }

//     const newItem = new Item({
//       name,
//       description,
//       nrp,
//       mrp,
//       image,
//     });

//     await newItem.save();

//     res.status(201).json({
//       success: true,
//       message: "Item added successfully",
//       item: newItem,
//     });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// // 📋 Get all items
// exports.getAllItems = async (req, res) => {
//   try {
//     const items = await Item.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, items });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching items",
//       error: error.message,
//     });
//   }
// };

// // ❌ Delete item
// exports.deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Item.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Item deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting item",
//       error: error.message,
//     });
//   }
// };


const Item = require("../models/Item");

// ➕ Add new item
exports.addItem = async (req, res) => {
  try {
    const { name, description, nrp, mrp } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if item already exists
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item with this name already exists",
      });
    }

    const newItem = new Item({
      name,
      description: description || "",
      nrp: Number(nrp) || 0,
      mrp: Number(mrp) || 0,
      image,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 📋 Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching items",
      error: error.message,
    });
  }
};

// 📄 Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching item",
      error: error.message,
    });
  }
};

// ✏️ Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, nrp, mrp } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {
      name,
      description,
      nrp: Number(nrp),
      mrp: Number(mrp),
    };

    if (image) {
      updateData.image = image;
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
};

// ❌ Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
};