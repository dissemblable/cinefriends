import { Hono } from "hono"
import { filmsController } from "../controllers/films.controller.js"

const filmsRoutes = new Hono()

filmsRoutes.get("/", filmsController.getFilms)
filmsRoutes.post("/", filmsController.createFilm)
filmsRoutes.get("/:id", filmsController.getFilm)
filmsRoutes.put("/:id", filmsController.updateFilm)
filmsRoutes.delete("/:id", filmsController.deleteFilm)

export default filmsRoutes
