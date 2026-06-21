import express from "express";
import {
  getAllProducts,
  getProductById,
  getOrdersByProductAndUser,
} from "#db/queries/products";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");
    res.send(product);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");
    const orders = await getOrdersByProductAndUser(req.params.id, req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
