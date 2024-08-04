import UsersDAO from "../dao/UsersDAO.js";

class SessionsService {
  constructor(dao) {
    this.UsersDAO = dao;
  }

  async getUsers() {
    return await this.UsersDAO.getUsers();
  }

  async getUserByEmail(email) {
    let userArr = await this.UsersDAO.getUserByEmail(email);
    if (userArr[0]) {
      let user = userArr[0];
      return user;
    }
    return null;
  }

  async getUserById(uid) {
    let user = await this.UsersDAO.getUserById(uid);
    return user ? user : null;
  }

  async updateUser(email, fields) {
    let user = await this.UsersDAO.getUserByEmail(email);

    if (!user) return false;

    return await this.UsersDAO.updateUser(email, fields);
  }

  async updateUserById(uid, fields) {
    let user = await this.UsersDAO.getUserById(uid);

    if (!user) return false;

    return await this.UsersDAO.updateUserById(uid, fields);
  }

  async changeRole(uid) {
    let user = await this.UsersDAO.getUserById(uid);

    if (user.role == "USER") {
      return await this.UsersDAO.updateUserById(uid, { role: "PREMIUM" });
    }
    await this.UsersDAO.updateUserById(uid, { role: "USER" });
  }
}

export const sessionsService = new SessionsService(new UsersDAO());
