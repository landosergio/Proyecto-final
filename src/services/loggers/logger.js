import program from "../../config/command.js";
import customLevelsOptions from "./options.js";
import winston from "winston";

let logger;

switch (program.opts().env) {
  case "DEV":
    logger = winston.createLogger({
      levels: customLevelsOptions.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize({ colors: customLevelsOptions.colors }),
            winston.format.simple()
          ),
        }),
      ],
    });

    break;
  case "PROD":
    logger = winston.createLogger({
      levels: customLevelsOptions.levels,
      transports: [
        new winston.transports.Console({
          level: "info",
          format: winston.format.combine(
            winston.format.colorize({ colors: customLevelsOptions.colors }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: "./errors.log",
          level: "error",
          format: winston.format.simple(),
        }),
      ],
    });
}

export default logger;
