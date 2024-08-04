import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { passportCall } from "../utils.js";
import { authRole } from "../utils.js";
import { isProductOwner } from "../utils.js";

const productsRouter = Router();

productsRouter.get("/:pid", ProductsController.getProductById);
productsRouter.get("/", ProductsController.getProducts);
productsRouter.post(
  "/",
  passportCall("jwt"),
  authRole(["ADMIN", "PREMIUM"]),
  ProductsController.addProduct
);
productsRouter.delete(
  "/:pid",
  passportCall("jwt"),
  authRole(["ADMIN", "PREMIUM"]),
  isProductOwner("sell"),
  ProductsController.deleteProduct
);
productsRouter.put(
  "/:pid",
  passportCall("jwt"),
  authRole(["ADMIN", "PREMIUM"]),
  isProductOwner("sell"),
  ProductsController.updateProduct
);

export default productsRouter;
