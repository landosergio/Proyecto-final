import { Router } from "express";

import ViewsController from "../controllers/views.controller.js";

import { passportCall } from "../utils.js";

import { isLogged } from "../utils.js";
import { isUserCart } from "../utils.js";
import { authRole } from "../utils.js";

const viewsRouter = Router();

viewsRouter.get("/products", isLogged(), ViewsController.getProducts);
viewsRouter.get(
  "/carts/:cid",
  passportCall("jwt"),
  isUserCart(),
  ViewsController.getCartById
);
viewsRouter.get("/realTimeProducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/register", isLogged(), ViewsController.register);
viewsRouter.get("/login", isLogged(), ViewsController.login);
viewsRouter.get("/profile", passportCall("jwt"), ViewsController.profile);

viewsRouter.get("/restorePassword01", ViewsController.restorePassword01);
viewsRouter.get(
  "/restorePassword02",
  passportCall("jwt"),
  ViewsController.restorePassword02
);

viewsRouter.get(
  "/addProduct",
  passportCall("jwt"),
  authRole(["ADMIN", "PREMIUM"]),

  ViewsController.addProduct
);

export default viewsRouter;
