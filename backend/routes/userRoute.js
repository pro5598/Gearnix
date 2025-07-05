const express = require("express");
const authenticateToken = require("../middleware/token-middleware.js"); // adjust path as needed
const {
  getAllEmployee,
  saveAllEmployee,
  updateEmployeeById,
  deleteById,
  getUserById
} = require("../controller/userController");

const router = express.Router();

router.use(express.json());

// Protect all /users routes with token authentication
router.use(authenticateToken);

router.get("/users", getAllEmployee);
router.get("/users/:id", getUserById);
router.post("/users", saveAllEmployee);
router.patch("/users/:id", updateEmployeeById);
router.delete("/users/:id", deleteById);

module.exports = router;
