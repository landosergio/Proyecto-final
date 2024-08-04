export default class productDTO {
  constructor(prod, owner) {
    this.title = prod.title;
    this.description = prod.description;
    this.price = +prod.price;
    this.code = prod.code;
    this.stock = +prod.stock;
    this.thumbnail = [];
    this.status = true;
    this.owner = owner || "ADMIN";
  }
}
