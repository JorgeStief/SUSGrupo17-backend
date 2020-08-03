import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.index);

// Get one user
router.get(
  "/:id([0-9]+)",
  [checkJwt],
  UserController.show
);

//Create a new user
router.post("/", UserController.store);

//Edit one user
router.put(
  "/:id([0-9]+)",
  [checkJwt],
  UserController.update
);

//Delete one user
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.delete
);

export default router;