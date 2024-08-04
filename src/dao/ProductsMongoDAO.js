import { ProductModel } from "./models/Product.model.js";

class ProductsDAO {
  async getProductById(id) {
    return await ProductModel.findById(id);
  }

  async getProducts(limit, page, sort, query) {
    return await ProductModel.paginate(query, {
      limit: limit,
      page: page,
      sort: sort && { price: sort, _id: 1 },
      lean: true,
    });
  }

  async getRealTimeProducts() {
    return await ProductModel.find({});
  }
  async addProduct(prod) {
    return await ProductModel.create(prod);
  }

  async updateProduct(id, fields) {
    return await ProductModel.updateOne({ _id: id }, fields);
  }

  async deleteProduct(id) {
    return await ProductModel.deleteOne({ _id: id });
  }

  async checkStock(id, cant) {
    return await ProductModel.find({
      $and: [{ _id: id }, { stock: { $gte: cant } }],
    });
  }
}

export default ProductsDAO;
