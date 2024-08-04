import { Router } from "express";

const loggerRouter = Router();

loggerRouter.get("/", (req, res) => {
  res.send("Ingresá un número del 0 al 5 en la ruta para probar el logger");
});

loggerRouter.get("/:level([0-5])", (req, res) => {
  const level = parseInt(req.params.level);
  switch (level) {
    case 0:
      req.logger.fatal("Prueba fatal - " + new Date());
      break;
    case 1:
      req.logger.error("Prueba error - " + new Date());
      break;
    case 2:
      req.logger.warning("Prueba warning - " + new Date());
      break;
    case 3:
      req.logger.info("Prueba info - " + new Date());
      break;
    case 4:
      req.logger.http("Prueba http - " + new Date());
      break;
    case 5:
      req.logger.debug("Prueba debug - " + new Date());
  }
  res.status(200).send("Log realizado con éxito");
});

loggerRouter.get("*", (req, res) => {
  res.status(400).send("No existe este nivel de log");
});

export default loggerRouter;
