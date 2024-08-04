import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

export const CartModel = mongoose.model("Cart", CartSchema);
