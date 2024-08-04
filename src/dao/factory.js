import program from "../config/command.js";
import config from "../config/config.js";
import mongoose from "mongoose";

const mongoURL = config.mongoURL;

export let ProductsDAO;
export let CartsDAO;

switch (program.opts().dao) {
  case "MONGO":
    const connection = mongoose.connect(mongoURL);
    const { default: ProductsMongo } = await import("./ProductsMongoDAO.js");
    const { default: CartsMongo } = await import("./CartsMongoDAO.js");
    ProductsDAO = ProductsMongo;
    CartsDAO = CartsMongo;
    break;
  case "FS":
    const { default: ProductsFS } = await import("./ProductsFSDAO.js");
    const { default: CartsFS } = await import("./CartsFSDAO.js");
    ProductsDAO = ProductsFS;
    CartsDAO = CartsFS;
}
