import { productsService } from "../repository/products.service.js";
import config from "../config/config.js";
import productDTO from "../dao/dto/products.dto.js";

const adminEmail = config.adminEmail;

export default class ProductsController {
  static async getProductById(req, res) {
    let pId = req.params.pid;

    try {
      let product = await productsService.getProductById(pId);
      if (!product) {
        req.logger.warning("Se intentó agregar un producto inexistente");
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "No existe el producto" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ payload: product });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getProducts(req, res) {
    let { limit, page, sort, query } = req.query;

    try {
      let productsPagination = await productsService.getProducts(
        limit,
        page,
        sort,
        query,
        true
      );
      if (productsPagination == "wrongPage") {
        req.logger.warning("Se intentó ingresar a una página inexistente");
        return res.json({ message: "No existe la página." });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(productsPagination);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async addProduct(req, res, next) {
    let prod = new productDTO(req.body, req.user.email);

    try {
      let addProd = await productsService.addProduct(prod);
      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res
        .status(200)
        .json({ message: "Producto agregado con id " + addProd._id });
    } catch (error) {
      req.logger.error("Error en la persistencia");

      return next(error);
    }
  }

  static async updateProduct(req, res) {
    let pId = req.params.pid;
    let fields = req.body;

    try {
      let prod = await productsService.updateProduct(pId, fields);
      if (!prod) {
        req.logger.warning("Se intentó actualizar un producto que no existe");
        return res.send("No existe el producto");
      }
      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto actualizado" });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async deleteProduct(req, res) {
    let pId = req.params.pid;

    try {
      let prod = await productsService.deleteProduct(pId);
      if (!prod) {
        req.logger.warning("Se intentó eliminar un producto que no existe");
        return res.send("No existe el producto");
      }
      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }
}
