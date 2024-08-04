import { CartModel } from "./models/Cart.model.js";

class CartsDAO {
  async addCart(cart) {
    return await CartModel.create(cart);
  }

  async getCartById(id) {
    return await CartModel.findById(id).populate("products.product").lean();
  }

  async findProdInCart(filter = {}) {
    return await CartModel.find(filter);
  }

  async updateCart(...filters) {
    return await CartModel.updateOne(...filters);
  }
}

export default CartsDAO;
