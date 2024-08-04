import passport from "passport";

import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import { UserModel } from "../dao/models/User.model.js";
import { cartsService } from "../repository/carts.service.js";

import { createHash, isValidPassword } from "../utils.js";
import config from "./config.js";

const { port, privateKey, clientID, clientSecret, adminEmail, adminPassword } =
  config;

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["tokenCookie"];
  }
  return token;
}

function initializePassport() {
  passport.use(
    "register",
    new local.Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        if (!first_name || !last_name || !age) {
          return done(null, false, "Información incompleta");
        }

        try {
          let user = await UserModel.findOne({ email: username });
          if (user) {
            return done(null, false, "El usuario ya existe");
          }
          let newCart = await cartsService.addCart({ products: [] });

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "USER",
            cart: newCart._id,
          };
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al crear el usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        if (username == adminEmail) {
          if (password != adminPassword)
            return done(null, false, "Wrong password");

          let user = {
            first_name: "Diego",
            last_name: "Maradona",
            age: "∞",
            role: "ADMIN",
          };
          return done(null, user);
        }
        try {
          const user = await UserModel.findOne({ email: username }).populate({
            path: "cart",
            populate: { path: "products.product" },
          });
          if (!user) {
            return done(null, false, "User doesn't exist");
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, "Wrong password");
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `http://localhost:${port}/api/sessions/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

export default initializePassport;
