import EErrors from "../../services/errors/enums.js";

export default function errorHandler(error, req, res, next) {
  switch (error.code) {
    case EErrors.MISSING_OR_WRONG_DATA_ERRORS:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErrors.DATABASE_ERRORS:
      res.status(500).send({ status: "error", error: error.name });
      break;
    case EErrors.WRONG_CREDENTIALS_ERRORS:
      res.status(401).send({ status: "error", error: error.name });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error" });
  }
}
