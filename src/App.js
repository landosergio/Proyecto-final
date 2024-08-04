import express from "express";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessions.router.js";
import loggerRouter from "./routes/logger.router.js";

import handlebars from "express-handlebars";

import { Server } from "socket.io";

import { productsService } from "./repository/products.service.js";

import cookieParser from "cookie-parser";

import passport from "passport";
import initializePassport from "./config/passport.config.js";

import { __dirname } from "./utils.js";
import config from "./config/config.js";
import { generateProduct } from "./utils.js";
import errorHandler from "./middlewares/errors/index.js";

import addLogger from "./middlewares/logger/index.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const { port } = config;

//Express
export const app = express();
const httpServer = app.listen(port, () =>
  console.log("Escuchando en puerto " + port)
);

// Middlewares
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addLogger);

initializePassport();
app.use(passport.initialize());

//Socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  let products;
  try {
    products = await productsService.getRealTimeProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
  socketServer.emit("realTimeProducts", products);
});

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Proyecto Coder - Backend",
      description: "Sistema de backend para un e-commerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

// Router
app.get("/", (req, res) => {
  res.redirect(`http://localhost:${port}/login`);
});

app.get("/mockingproducts", (req, res) => {
  let products = [];
  for (let i = 1; i <= 100; i++) {
    products.push(generateProduct());
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ payload: products });
});

app.use("/", viewsRouter);
app.use(
  "/api/products",
  (req, res, next) => {
    req.socketServer = socketServer;
    return next();
  },
  productsRouter
);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/loggerTest", loggerRouter);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Manejo de errores personalizado
app.use(errorHandler);
