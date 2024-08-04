import fs from "fs";
import { __dirname } from "../utils.js";

class CartsManager {
  constructor() {
    this.carts = ["init"];
    this.path = __dirname + "\\carritos.json";
  }

  static cartId = 1;

  async addCart(cart) {
    await this.initializeCarts();

    this.carts[0] &&
      (CartsManager.cartId = this.carts[this.carts.length - 1].id + 1);
    cart.id = CartsManager.cartId;
    this.carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 4));
    return "Se creó el carrito";
  }

  async getCartById(id) {
    await this.initializeCarts();

    let cart = this.carts.find((cartAux) => cartAux.id == id);

    return cart;
  }

  async addProductToCart(cId, pId) {
    await this.initializeCarts();

    let product = await prodManager.getProductById(pId);
    let cart = await this.getCartById(cId);

    if (!product || !cart) {
      return "Producto o carrito no encontrado";
    }

    let prodInCartIndex = cart.products.findIndex(
      (prod) => prod.product == product.id
    );
    let prodForCart = {};

    if (prodInCartIndex != -1) {
      cart.products[prodInCartIndex].quantity++;
    } else {
      prodForCart = { product: +pId, quantity: 1 };
      cart.products.push(prodForCart);
    }

    let cartInCartsIndex = this.carts.findIndex((cartAux) => cartAux.id == cId);
    this.carts.splice(cartInCartsIndex, 1, cart);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 4));

    return "Producto agregado al carrito";
  }

  async initializeCarts() {
    if (this.carts[0] == "init") {
      if (fs.existsSync(this.path)) {
        this.carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
        this.carts[0] &&
          (CartsManager.cartId = this.carts[this.carts.length - 1].id);
      } else {
        this.carts = [];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.carts, null, 4)
        );
      }
    }
  }
}

export default CartsManager;
