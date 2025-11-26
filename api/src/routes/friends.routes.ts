import * as friendsController from "@/controllers/friends.controller.js"
import { Hono } from "hono"

const friendsRoutes = new Hono()

// Recherche d'utilisateurs
friendsRoutes.get("/search", friendsController.searchUsers)

// Gestion des demandes d'amitié
friendsRoutes.post("/requests", friendsController.sendFriendRequest)
friendsRoutes.get("/requests/pending", friendsController.getPendingRequests)
friendsRoutes.get("/requests/sent", friendsController.getSentRequests)
friendsRoutes.post("/requests/:id/accept", friendsController.acceptFriendRequest)
friendsRoutes.post("/requests/:id/reject", friendsController.rejectFriendRequest)

// Gestion des amis
friendsRoutes.get("/", friendsController.getFriends)
friendsRoutes.delete("/:id", friendsController.removeFriend)

// Vérifier le statut d'amitié avec un utilisateur
friendsRoutes.get("/status/:userId", friendsController.getFriendshipStatus)

export default friendsRoutes
