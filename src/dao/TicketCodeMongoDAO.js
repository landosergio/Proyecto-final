import { TicketCodeModel } from "./models/TicketCode.model.js";

class TicketCodeDAO {
  async getCode() {
    return await TicketCodeModel.findOne({});
  }
  async createCode() {
    return await TicketCodeModel.create({ code: 1 });
  }
  async incCode(id) {
    return await TicketCodeModel.updateOne({ _id: id }, { $inc: { code: 1 } });
  }
}

export default TicketCodeDAO;
