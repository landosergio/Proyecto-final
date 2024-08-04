import { generateToken } from "../utils.js";
import userDTO from "../dao/dto/users.dto.js";
import { sessionsService } from "../repository/sessions.service.js";

import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { createHash, isValidPassword } from "../utils.js";

import { transport } from "../utils.js";

const privateKey = config.privateKey;
const port = config.port;

class SessionsController {
  static async register(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: "Usuario creado" });
  }

  static async restorePassword01(req, res) {
    let email = req.body.email;

    let user;
    try {
      user = await sessionsService.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          message: "No se encontró ningún usuario con el mail ingresado",
        });
      }
    } catch (error) {}

    const userToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        age: user.age,
        last_name: user.last_name,
        first_name: user.first_name,
        cart: user.cart,
      },
      privateKey,
      {
        expiresIn: "1h",
      }
    );

    try {
      let result = await transport.sendMail({
        from: "Sergio <lando.sergio999@gmail.com>",
        to: user.email,
        subject: "Restablecé tu contraseña",
        html: `<a href="http://localhost:${port}/api/sessions/restorePassword02/${userToken}">Entrá al link para restablecer tu contraseña</a></br>
        Tené en cuenta que sólo tiene una duración de una hora.`,
      });
    } catch (error) {}

    res
      .status(200)
      .send("Se ha enviado un mail con el link para restablecer la contraseña");
  }

  static async restorePassword02(req, res) {
    const token = req.params.token;

    let user;
    jwt.verify(token, privateKey, (error, credentials) => {
      user = credentials;
      if (error) {
        req.logger.error("Error en la verificación del token");
        return res
          .status(400)
          .redirect(`http://localhost:${port}/restorePassword01`);
      }

      res
        .cookie("tokenCookie", token, {
          maxAge: 1000 * 60 * 60 * 1,
          httpOnly: true,
        })
        .redirect(`http://localhost:${port}/restorePassword02`);
    });
  }

  static async restorePassword03(req, res) {
    let email = req.user.email;
    let newPassword = req.body.password;

    let user;
    try {
      user = await sessionsService.getUserByEmail(email);
    } catch (error) {}

    if (isValidPassword(user, newPassword)) {
      return res.send("Estás colocando la misma contraseña");
    }

    let newPassHash = createHash(newPassword);

    try {
      await sessionsService.updateUser(email, { password: newPassHash });
    } catch (error) {}

    res
      .status(200)
      .clearCookie("tokenCookie")
      .json({ message: "La contraseña se ha modificado" });
  }

  static async githubCallback(req, res) {
    req.user.email = req.user.email || "Github account";
    const access_token = generateToken(req.user);
    res
      .cookie("tokenCookie", access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect(`http://localhost:${port}/products`);
  }

  static async login(req, res) {
    const access_token = generateToken(req.user);
    res
      .cookie("tokenCookie", access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect(`http://localhost:${port}/products`);
  }

  static async current(req, res) {
    let user = new userDTO(req.user);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ user });
  }

  static async logout(req, res) {
    res.clearCookie("tokenCookie").redirect(`http://localhost:${port}/login/`);
  }

  static async getUsers(req, res) {
    let users;
    try {
      users = await sessionsService.getUsers();
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({ payload: users });
  }

  static async changeRole(req, res) {
    let uid = req.params.uid;

    try {
      await sessionsService.changeRole(uid);
    } catch (error) {
      console.log(error);
    }

    res.status(200).send("Se cambió el rol del usuario");
  }
}

export default SessionsController;
