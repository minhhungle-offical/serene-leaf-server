import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    // 2. Kiểm tra tồn kho và tính tổng tiền
    for (const item of cart.items) {
      const product = item.product;

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Product "${product.name}" is out of stock`,
        });
      }

      total += product.price * item.quantity;
    }

    // 3. Tạo đơn hàng
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: total,
      paymentMethod: req.body.paymentMethod || "cash",
      status: "pending", // Mặc định là pending
    });

    await order.save();

    // 4. Trừ kho sản phẩm
    for (const item of cart.items) {
      const product = item.product;
      product.quantity -= item.quantity;
      await product.save();
    }

    // 5. Xóa giỏ hàng
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      message: "Checkout success",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error });
  }
};
