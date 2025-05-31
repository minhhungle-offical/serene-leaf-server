import { Router } from "express";
import auth from "./auth.js";
import users from "./user.js";
import products from "./product.js";
import categories from "./category.js";
import postCategories from "./postCategory.js";
import upload from "./upload.js";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", products);
router.use("/categories", categories);
router.use("/post-categories", postCategories);
router.use("/upload", upload);

export default router;
