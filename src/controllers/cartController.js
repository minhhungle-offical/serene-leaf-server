import Cart from "../models/Cart.js";

// 👉 Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: null,
      });
    }

    const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const plainCart = cart.toObject(); // ⭐️ chuyển từ Mongoose document sang object thuần

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        ...plainCart,
        total,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message || error,
    });
  }
};

// 👉 Add or update item in cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // 👉 Convert to number
  const quantityNumber = Number(quantity);

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity: quantityNumber }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantityNumber;
      } else {
        cart.items.push({ product: productId, quantity: quantityNumber });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// 👉 Update quantity of an item in cart
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const quantityNumber = Number(quantity);

  if (isNaN(quantityNumber) || quantityNumber < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.items[itemIndex].quantity = quantityNumber;

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      message: "Cart item updated",
      data: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

// 👉 Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from cart", error });
  }
};

// 👉 Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};
