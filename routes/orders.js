import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getOrderProducts,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.use(requireUser);

router.post("/", requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;
    const order = await createOrder({ date, note, userId: req.user.id });
    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");
    res.send(order);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found.");
      if (order.user_id !== req.user.id)
        return res.status(403).send("Forbidden.");
      const product = await getProductById(req.body.productId);
      if (!product) return res.status(400).send("Product not found.");
      const orderProduct = await addProductToOrder({
        orderId: order.id,
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      res.status(201).send(orderProduct);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/:id/products", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");
    const products = await getOrderProducts(req.params.id);
    res.send(products);
  } catch (err) {
    next(err);
  }
});

export default router;
