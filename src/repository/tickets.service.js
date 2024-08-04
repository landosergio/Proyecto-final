import TicketsDAO from "../dao/TicketsMongoDAO.js";
import TicketCodeDAO from "../dao/TicketCodeMongoDAO.js";

class TicketsService {
  constructor(dao, dao2) {
    this.ticketsDAO = dao;
    this.ticketCodeDAO = dao2;
  }

  async createTicket(prods, email) {
    let codeObj = await this.ticketCodeDAO.getCode();
    if (!codeObj) {
      await this.ticketCodeDAO.createCode();
      codeObj = await this.ticketCodeDAO.getCode();
    }
    let code = codeObj.code;
    let codeId = codeObj._id;

    let subTotals = prods.map((prod) => prod.product.price * prod.quantity);
    let total = subTotals.reduce((acum, subTotal) => acum + subTotal, 0);

    let ticket = {
      code: code.toString(),
      purchase_datetime: new Date(),
      amount: total,
      purchaser: email,
    };

    this.ticketsDAO.createTicket(ticket);

    await this.ticketCodeDAO.incCode(codeId);

    return ticket;
  }

  async getTickets() {
    return await this.ticketsDAO.getTickets();
  }
}

export const ticketsService = new TicketsService(
  new TicketsDAO(),
  new TicketCodeDAO()
);
