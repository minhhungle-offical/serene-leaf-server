import { Router } from "express";
import auth from "./auth.js";
import users from "./user.js";
import products from "./product.js";
import categories from "./category.js";

const router = Router();

// Mount auth routes at /api/auth
router.use("/auth", auth);

// Mount user routes at /api/users
router.use("/users", users);

// Mount product routes at /api/products
router.use("/products", products);

// Mount product routes at /api/products
router.use("/categories", categories);

export default router;
