import { Hono } from "hono"
import authRoutes from "./auth.routes.js"
import filmsRoutes from "./films.routes.js"
import friendsRoutes from "./friends.routes.js"
import usersRoutes from "./users.routes.js"

const routes = new Hono()

routes.route("/users", usersRoutes)
routes.route("/films", filmsRoutes)
routes.route("/friends", friendsRoutes)

routes.route("/auth", authRoutes)

export default routes
