import mongoose from "mongoose";

const TicketCodeSchema = mongoose.Schema({
  code: Number,
});

export const TicketCodeModel = mongoose.model("TicketCode", TicketCodeSchema);
