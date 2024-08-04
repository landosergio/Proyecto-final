import mongoose from "mongoose";
import CartsDAO from "../src/dao/CartsMongoDAO.js";
import { ProductModel } from "../src/dao/models/Product.model.js";
import chai from "chai";

const connection = mongoose.connect(
  "mongodb+srv://landosergio:aorAdam888@codercluster.mr4aged.mongodb.net/ecommercetest?retryWrites=true&w=majority&appName=CoderCluster"
);

const expect = chai.expect;

describe("Testing Carts DAO", () => {
  before(function () {
    this.cartsDAO = new CartsDAO();
    mongoose.connection.collections.carts.drop();
  });
  beforeEach(function () {
    this.timeout(5000);
  });

  it("El DAO debe agregar correctamente un carrito a la base de datos", async function () {
    let cartMock = {
      products: [
        { product: "65df6a5ced26c37ebfc1cfc2", quantity: 333 },
        { product: "65df6a5ced26c37ebfc1cfc6", quantity: 222 },
        { product: "65df6a5ced26c37ebfc1cfcf", quantity: 222 },
      ],
    };

    const result = await this.cartsDAO.addCart(cartMock);
    this.cart = result;
    expect(this.cart._id).to.be.ok;
  });

  it("El DAO debe obtener un carrito por su id", async function () {
    const result = await this.cartsDAO.getCartById(this.cart._id);
    expect(result.products[0].quantity).to.be.equal(333);
  });

  it("El DAO debe actualizar un carrito con su id y un nuevo arreglo de productos", async function () {
    await this.cartsDAO.updateCart(
      { _id: this.cart._id },
      {
        $set: {
          products: [{ product: "65df6a5ced26c37ebfc1cfcf", quantity: 1 }],
        },
      }
    );
    const result = await this.cartsDAO.getCartById(this.cart._id);
    expect(result.products[0].quantity).to.be.equal(1);
  });
});
