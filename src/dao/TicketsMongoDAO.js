import { TicketModel } from "./models/Ticket.model.js";

class TicketsDAO {
  async createTicket(ticket) {
    return await TicketModel.create(ticket);
  }
  async getTickets() {
    return await TicketModel.find({});
  }
}

export default TicketsDAO;
