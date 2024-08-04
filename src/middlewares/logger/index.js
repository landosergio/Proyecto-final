import logger from "../../services/loggers/logger.js";

export default function addLogger(req, res, next) {
  req.logger = logger;
  next();
}
