import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: Array,
  code: {
    type: String,
    unique: true,
  },
  stock: Number,
  status: Boolean,
  owner: { type: String, default: "ADMIN" },
});

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("Product", ProductSchema);
