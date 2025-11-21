
const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Upload image buffer to Cloudinary
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "items",
        resource_type: "auto",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" }
        ]
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary using URL
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
      // Get everything after 'upload/' and before the file extension
      const publicIdWithFolder = urlParts.slice(uploadIndex + 2).join("/");
      const publicId = publicIdWithFolder.substring(0, publicIdWithFolder.lastIndexOf("."));

      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Deleted from Cloudinary:", publicId, result);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// ==========================================
// CONTROLLER FUNCTIONS
// ==========================================

/**
 * ➕ Add new item
 */
exports.addItem = async (req, res) => {
  try {
    const { name, description, nrp, mrp } = req.body;
    let imageUrl = null;

    console.log("📥 Received data:", { name, description, nrp, mrp });
    console.log("📁 File received:", req.file ? "Yes" : "No");

    // Check if item already exists
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item with this name already exists",
      });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      console.log("☁️ Uploading to Cloudinary...");
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        console.log("✅ Cloudinary upload successful:", imageUrl);
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary upload failed:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
          error: cloudinaryError.message,
        });
      }
    }

    // Create new item
    const newItem = new Item({
      name,
      description: description || "",
      nrp: Number(nrp) || 0,
      mrp: Number(mrp) || 0,
      image: imageUrl,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * 📋 Get all items
 */
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

/**
 * 📄 Get single item by ID
 */
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

/**
 * ✏️ Update item
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, nrp, mrp } = req.body;

    // Find existing item
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const updateData = {
      name,
      description,
      nrp: Number(nrp),
      mrp: Number(mrp),
    };

    // Upload new image if provided
    if (req.file) {
      console.log("☁️ Uploading new image to Cloudinary...");

      try {
        // Upload new image
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.image = result.secure_url;
        console.log("✅ New image uploaded:", result.secure_url);

        // Delete old image from Cloudinary
        if (existingItem.image) {
          console.log("🗑️ Deleting old image from Cloudinary...");
          await deleteFromCloudinary(existingItem.image);
        }
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary operation failed:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Failed to update image on Cloudinary",
          error: cloudinaryError.message,
        });
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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

/**
 * ❌ Delete item
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Delete image from Cloudinary
    if (item.image) {
      console.log("🗑️ Deleting image from Cloudinary...");
      await deleteFromCloudinary(item.image);
    }

    await Item.findByIdAndDelete(id);

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
