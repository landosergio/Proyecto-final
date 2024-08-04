import fs from "fs";
import { __dirname } from "../utils.js";

class ProductsDAO {
  constructor() {
    this.products = ["init"];
    this.path = __dirname + "\\productos.json";
  }

  static prodId = 1;

  async getProductById(id) {
    await this.initializeProducts();

    let prod = this.products.find((product) => product.id == id);
    return prod;
  }

  async getProducts() {
    await this.initializeProducts();

    return this.products;
  }

  async addProduct(prod) {
    await this.initializeProducts();
    if (
      !this.products.some((product) => product.code == prod.code) &&
      prod.title &&
      prod.description &&
      prod.price &&
      prod.thumbnail &&
      prod.stock
    ) {
      this.products[0] &&
        (ProductsDAO.prodId = this.products[this.products.length - 1].id + 1);
      prod.id = ProductsDAO.prodId;
      this.products.push(prod);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 4)
      );
      return `Se agregó ${prod.title}`;
    } else {
      return "El producto ya existe.";
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    let prod = await this.getProductById(id, false);
    if (prod) {
      let index = this.products.indexOf(
        this.products.find((product) => product.id == id)
      );

      title && (prod.title = title);
      description && (prod.description = description);
      price && (prod.price = price);
      thumbnail && (prod.thumbnail = thumbnail);
      code && (prod.code = code);
      stock && (prod.stock = stock);

      this.products[index] = prod;

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 4)
      );
      return `Se modificó ${prod.title}`;
    } else {
      return "Producto no encontrado";
    }
  }

  async deleteProduct(id) {
    let prod = await this.getProductById(id, false);
    if (prod) {
      let productsAux = this.products.filter((prod) => prod.id != id);
      this.products = productsAux;

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 4)
      );
      return `Se eliminó ${prod.title}`;
    } else {
      return "Producto no encontrado";
    }
  }

  async initializeProducts() {
    if (this.products[0] == "init") {
      if (fs.existsSync(this.path)) {
        this.products = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        this.products[0] &&
          (ProductsDAO.prodId = this.products[this.products.length - 1].id);
      } else {
        this.products = [];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
      }
    }
  }
}

export default ProductsDAO;
