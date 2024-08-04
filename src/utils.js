import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import config from "./config/config.js";
import { es, faker } from "@faker-js/faker";
import nodemailer from "nodemailer";
import { productsService } from "./repository/products.service.js";

const privateKey = config.privateKey;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

////////////////////////////////////////////////////////
// A  U  T  H      Y      L  O  G  I  N

export function passportCall(strategy) {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        req.logger.error("Error de Passport");
        return next(err);
      }
      if (!user) {
        req.logger.error("No se pudo crear u obtener el usuario");
        return res
          .status(401)
          .send({ error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}

export function isLogged() {
  return async (req, res, next) => {
    req.logueado = false;

    const token = req.cookies["tokenCookie"];

    if (token) {
      jwt.verify(token, privateKey, (error, credentials) => {
        req.logueado = true;
        req.user = credentials;
        if (error) {
          req.logger.error("Error en la verificación del token");
          req.logueado = false;
        }
      });
    }
    next();
  };
}

export function authRole(roles) {
  return async (req, res, next) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }

    req.logger.warning("Credenciales insuficientes");
    res.setHeader("Content-Type", "application/json");
    res.status(401).json({ message: "Not enough credentials" });
  };
}

////////////////////////////////////////////////////////
// J  W  T      Y      C  I  F  R  A  D  O

export function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

export function generateToken(user) {
  const token = jwt.sign(
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
      expiresIn: "1d",
    }
  );
  return token;
}

////////////////////////////////////////////////////////
// F  A  K  E  R

faker.location = es;

export function generateUser() {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 110 }),
    password: faker.internet.password({ length: 10 }),
    role: "USER",
    cart: faker.database.mongodbObjectId(),
  };
}

export function generateProduct() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 1000, max: 500000 }),
    thumbnail: [generateThumbnail(), generateThumbnail(), generateThumbnail()],
    code: faker.commerce.isbn(10),
    stock: faker.number.int({ min: 0, max: 1000 }),
    status: true,
  };
}

function generateThumbnail() {
  return faker.image.urlLoremFlickr({ category: "product" });
}

////////////////////////////////////////////////////////
// M  A  I  L  E  R

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "lando.sergio999@gmail.com",
    pass: "ssoe yami kzwl kbzd",
  },
});

////////////////////////////////////////////////////////
// V  A  R  I  O  S

export function isUserCart() {
  return async (req, res, next) => {
    if (req.user.role == "ADMIN") {
      return next();
    }
    if (req.user?.cart?._id == req.params.cid) return next();
    //
    if (req.body.id == req.params.cid) return next();
    //
    req.logger.warning(
      "El usuario intentó ingresar a un carrito que no le pertenece"
    );
    res.setHeader("Content-Type", "application/json");
    res.status(401).json({ message: "Este no es tu carrito" });
  };
}

export function isProductOwner(operation) {
  return async (req, res, next) => {
    if (req.user.role == "ADMIN") {
      return next();
    }

    let product;
    try {
      product = await productsService.getProductById(req.params.pid);
    } catch (error) {}

    let productOwner = product.owner;
    let userEmail = req.user.email;

    switch (operation) {
      case "sell":
        if (productOwner == userEmail) {
          return next();
        }
        res.status(400).json({ message: "Este no es tu producto" });

        break;
      case "buy":
        if (productOwner != userEmail) {
          return next();
        }
        res
          .status(400)
          .json({ message: "No podés comprar tu propio producto" });
    }
  };
}

export function getInd(arr, val) {
  let indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

export function JSONify(str) {
  let strArr = [...str];

  let colonIndexes = getInd(strArr, ":");
  let counter = 0;
  colonIndexes.forEach((i) => {
    strArr.splice(i + counter, 0, '"');
    counter++;
  });

  let bracketIndexes = getInd(strArr, "{");
  counter = 0;
  bracketIndexes.forEach((i) => {
    strArr.splice(i + 1 + counter, 0, '"');
    counter++;
  });

  let JSONstr = strArr.join("");

  return JSONstr;
}
