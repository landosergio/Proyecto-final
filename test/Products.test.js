import mongoose from "mongoose";
import ProductsDAO from "../src/dao/ProductsMongoDAO.js";
import chai from "chai";

const connection = mongoose.connect(
  "mongodb+srv://landosergio:aorAdam888@codercluster.mr4aged.mongodb.net/ecommercetest?retryWrites=true&w=majority&appName=CoderCluster"
);

const expect = chai.expect;

describe("Testing Products DAO", () => {
  before(function () {
    this.productsDAO = new ProductsDAO();
    mongoose.connection.collections.products.drop();
  });
  beforeEach(function () {
    this.timeout(5000);
  });

  it("El DAO debe obtener la paginación de los productos y un arreglo docs que los contiene", async function () {
    const result = await this.productsDAO.getProducts();
    expect(result.docs).to.be.deep.equal([]);
  });
  it("El DAO debe agregar un producto correctamente a la base de datos", async function () {
    let productMock = {
      title: "Producto PreEntrega 3 aaabbb",
      description: "------------------",
      code: "MONGO-Baawwaabbdc",
      price: 1,
      stock: 17,
      thumbnail: [],
    };

    const result = await this.productsDAO.addProduct(productMock);
    this.product = result;
    expect(this.product._id).to.be.ok;
  });
  it("El dueño por defecto de un producto agregado será 'ADMIN' ", async function () {
    expect(this.product.owner).to.be.deep.equal("ADMIN");
  });
  it("El DAO puede encontrar un producto por su id ", async function () {
    const result = await this.productsDAO.getProductById(this.product._id);
    expect(result.code).equal("MONGO-Baawwaabbdc");
  });
});
