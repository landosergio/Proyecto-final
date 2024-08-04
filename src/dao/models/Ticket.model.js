import mongoose from "mongoose";

const TicketSchema = mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: Date,
  amount: Number,
  purchaser: String,
});

export const TicketModel = mongoose.model("Ticket", TicketSchema);
