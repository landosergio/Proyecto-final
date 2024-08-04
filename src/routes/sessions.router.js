import { Router } from "express";

import passport from "passport";

import { passportCall } from "../utils.js";

import SessionsController from "../controllers/sessions.controller.js";

import { authRole } from "../utils.js";

const sessionsRouter = Router();

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  SessionsController.githubCallback
);

sessionsRouter.get("/current", passportCall("jwt"), SessionsController.current);

sessionsRouter.get("/logout", SessionsController.logout);

sessionsRouter.post("/restorePassword01", SessionsController.restorePassword01);
sessionsRouter.get(
  "/restorePassword02/:token",
  SessionsController.restorePassword02
);
sessionsRouter.post(
  "/restorePassword03",
  passportCall("jwt"),
  SessionsController.restorePassword03
);

sessionsRouter.post(
  "/register",
  passportCall("register"),
  SessionsController.register
);

sessionsRouter.get(
  "/users",
  passportCall("jwt"),
  authRole(["ADMIN"]),
  SessionsController.getUsers
);

sessionsRouter.post("/login", passportCall("login"), SessionsController.login);

sessionsRouter.put(
  "/premium/:uid",
  passportCall("jwt"),
  authRole(["ADMIN"]),
  SessionsController.changeRole
);

export default sessionsRouter;
