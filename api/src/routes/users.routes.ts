import {
  getUserById,
  updateUser,
} from "@/controllers/users.controllers.js"
import { filmsController } from "../controllers/films.controller.js"
import { Hono } from "hono"

const usersRoutes = new Hono()

usersRoutes.get("/:id", getUserById)
usersRoutes.get("/:id/films", filmsController.getUserFilmsPublic)
usersRoutes.put("/:id", updateUser)

export default usersRoutes
