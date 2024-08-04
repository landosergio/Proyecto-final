export function generateProductErrorInfo(product) {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    *title : needs to be a String, received **${typeof product.title}**
    *description : needs to be a String, received **${typeof product.description}**
    *price : needs to be a Number, received **${typeof product.price}**
    *thumbnail : needs to be an Array, received **${
      Array.isArray(product.thumbnail) ? "array" : typeof product.thumbnail
    }**
    *code : needs to be a String, received **${typeof product.code}**
    *stock : needs to be a Number, received **${typeof product.stock}**`;
}
