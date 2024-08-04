import { CartsDAO } from "../dao/factory.js";

class CartsService {
  constructor(dao) {
    this.cartsDAO = dao;
  }

  async addCart(cart) {
    return await this.cartsDAO.addCart(cart);
  }

  async getCartById(cId) {
    return this.cartsDAO.getCartById(cId);
  }

  async addProdToCart(cId, pId) {
    let prodInCart = await this.findProdInCart(cId, pId);

    if (prodInCart) {
      return await this.cartsDAO.updateCart(
        { _id: cId },
        { $inc: { "products.$[p].quantity": 1 } },
        { arrayFilters: [{ "p.product": pId }] }
      );
    } else {
      let prodForCart = { product: pId, quantity: 1 };
      return await this.cartsDAO.updateCart(
        { _id: cId },
        { $push: { products: prodForCart } }
      );
    }
  }

  async deleteProdFromCart(cId, pId) {
    let cart = await this.cartsDAO.getCartById(cId);
    let prodInCart = await this.findProdInCart(cId, pId);
    if (!prodInCart || !cart) return false;

    return await this.cartsDAO.updateCart(
      { _id: cId },
      { $pull: { products: { product: pId } } }
    );
  }

  async updateCart(cId, newProducts) {
    let cart = await this.cartsDAO.getCartById(cId);
    if (!cart) return false;

    return await this.cartsDAO.updateCart(
      { _id: cId },
      { $set: { products: newProducts } }
    );
  }

  async updateProductQuantity(cId, pId, newQuantity) {
    let prodInCart;

    prodInCart = await this.findProdInCart(cId, pId);
    if (!prodInCart) return false;

    return await this.cartsDAO.updateCart(
      { _id: cId },
      { $set: { "products.$[p].quantity": newQuantity } },
      { arrayFilters: [{ "p.product": pId }] }
    );
  }

  async emptyCart(cId) {
    let cart = await this.cartsDAO.getCartById(cId);
    if (!cart) return false;

    return await this.cartsDAO.updateCart(
      { _id: cId },
      { $set: { products: [] } }
    );
  }

  async findProdInCart(cId, pId) {
    let prodInCart = await this.cartsDAO.findProdInCart({
      $and: [{ _id: cId }, { "products.product": pId }],
    });

    return prodInCart[0] ? prodInCart[0] : false;
  }
}

export const cartsService = new CartsService(new CartsDAO());
