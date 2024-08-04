import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { isProductOwner, passportCall, isUserCart } from "../utils.js";

const cartsRouter = Router();

cartsRouter.post("/", CartsController.addCart);

cartsRouter.get(
  "/:cid",
  passportCall("jwt"),
  isUserCart(),
  CartsController.getCartById
);
cartsRouter.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUserCart(),
  isProductOwner("buy"),
  CartsController.addProdToCart
);
cartsRouter.delete(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUserCart(),
  CartsController.deleteProdFromCart
);
cartsRouter.put(
  "/:cid",
  passportCall("jwt"),
  isUserCart(),
  CartsController.updateCart
);
cartsRouter.put(
  "/:cid/products/:pid",
  passportCall("jwt"),
  isUserCart(),
  CartsController.updateProductQuantity
);
cartsRouter.delete(
  "/:cid",
  passportCall("jwt"),
  isUserCart(),
  CartsController.emptyCart
);
cartsRouter.get(
  "/:cid/purchase",
  passportCall("jwt"),
  CartsController.purchase
);

cartsRouter.get("/1/tickets", CartsController.getTickets);

export default cartsRouter;
