import { cartsService } from "../repository/carts.service.js";
import { productsService } from "../repository/products.service.js";
import { ticketsService } from "../repository/tickets.service.js";

export default class CartsController {
  static async addCart(req, res) {
    let cart;

    try {
      cart = await cartsService.addCart(req.body);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Carrito agregado", payload: cart });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getCartById(req, res) {
    let cId = req.params.cid;

    try {
      let cart = await cartsService.getCartById(cId);
      if (!cart) {
        req.logger.warning("Se intentó obtener un carrito que no existe");
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "No existe el carrito" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ payload: cart.products });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async addProdToCart(req, res) {
    let cId = req.params.cid;
    let pId = req.params.pid;

    try {
      await cartsService.addProdToCart(cId, pId);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto agregado" });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async deleteProdFromCart(req, res) {
    let cId = req.params.cid;
    let pId = req.params.pid;
    try {
      let prodInCart = await cartsService.deleteProdFromCart(cId, pId);
      if (!prodInCart) {
        req.logger.warning(
          "Se intentó eliminar un producto de un carrito inexistente o que no contiene dicho producto"
        );
        res.setHeader("Content-Type", "application/json");
        return res.json({
          message: "El carrito no existe o no contiene el producto",
        });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async updateCart(req, res) {
    let cId = req.params.cid;
    let prodsCompra = req.body;

    try {
      let cart = await cartsService.updateCart(cId, prodsCompra);
      if (!cart) {
        req.logger.warning("Se intentó actualizar un carrito que no existe");
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "No existe el carrito" });
      } else if (cart == "Wrong ID") {
        req.logger.error("Se ingresó un ID con un formato inválido");
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "Formato de ID no válido" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Carrito actualizado" });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async updateProductQuantity(req, res) {
    let cId = req.params.cid;
    let pId = req.params.pid;
    let newQuantity = req.body.quantity;

    let prodInCart;
    try {
      prodInCart = await cartsService.updateProductQuantity(
        cId,
        pId,
        newQuantity
      );
      if (!prodInCart) {
        req.logger.warning(
          "Se intentó modificar un producto en un carrito que no existe o no contiene dicho producto"
        );
        res.setHeader("Content-Type", "application/json");
        return res.json({
          message: "Este carrito no existe o no contiene el producto",
        });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Cantidad del producto actualizada" });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async emptyCart(req, res) {
    let cId = req.params.cid;

    try {
      let cart = await cartsService.emptyCart(cId);
      if (!cart) {
        req.logger.warning("Se intentó eliminar un carrito que no existe");
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "No existe el carrito" });
      } else if (cart == "Wrong ID") {
        req.logger.error("Se ingresó un ID con un formato inválido");
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "Formato de ID no válido" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Carrito vaciado" });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async purchase(req, res) {
    let cId = req.params.cid;
    let user = req.user;
    let cart;

    try {
      cart = await cartsService.getCartById(cId);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }

    let prods = cart.products;
    let availProds = [];
    let rest = [];

    try {
      let check = await productsService.checkStock(prods);
      availProds = check.availProds;
      rest = check.rest;
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }

    try {
      await productsService.updateStock(availProds);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }

    try {
      await cartsService.updateCart(cId, rest);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }

    let ticket;

    try {
      ticket = await ticketsService.createTicket(availProds, user.email);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(ticket);
  }

  static async getTickets(req, res) {
    try {
      let tickets = await ticketsService.getTickets();
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(tickets);
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }
}
