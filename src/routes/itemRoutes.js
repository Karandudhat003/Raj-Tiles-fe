
});

router.post("/", upload.single("image"), itemController.addItem);
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.put("/:id", upload.single("image"), itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;

