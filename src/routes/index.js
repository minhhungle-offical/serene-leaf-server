import { Router } from "express";
import auth from "./auth.js";
import users from "./user.js";
import products from "./product.js";
import categories from "./category.js";
import postCategories from "./postCategory.js";
import upload from "./upload.js";
import posts from "./post.js";
import cart from "./cart.js";
import checkout from "./checkout.js";
import orders from "./order.js";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", products);
router.use("/categories", categories);
router.use("/post-categories", postCategories);
router.use("/upload", upload);
router.use("/posts", posts);

router.use("/cart", cart);
router.use("/checkout", checkout);
router.use("/orders", orders);

export default router;
