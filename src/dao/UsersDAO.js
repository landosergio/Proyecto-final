import { UserModel } from "./models/User.model.js";

class UsersDAO {
  async getUsers() {
    return await UserModel.find({}).lean();
  }

  async getUserByEmail(email) {
    return await UserModel.find({ email: email }).lean();
  }

  async getUserById(uid) {
    return await UserModel.findById(uid).lean();
  }

  async updateUser(email, fields) {
    return await UserModel.updateOne({ email: email }, fields);
  }

  async updateUserById(uid, fields) {
    return await UserModel.updateOne({ _id: uid }, fields);
  }
}

export default UsersDAO;
