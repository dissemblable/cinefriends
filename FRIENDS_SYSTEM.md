# Système d'Amis - CineFriends

## Vue d'ensemble

Le système d'amis permet aux utilisateurs de :
- Rechercher d'autres utilisateurs par nom ou email
- Envoyer des demandes d'amitié
- Accepter ou refuser des demandes d'amitié
- Voir la liste de leurs amis
- Supprimer des amis

## Architecture

### Base de données

**Modèle `Friendship`** (api/prisma/schema.prisma)
- `id`: Identifiant unique
- `senderId`: ID de l'utilisateur qui envoie la demande
- `receiverId`: ID de l'utilisateur qui reçoit la demande
- `status`: Statut de la relation (`pending`, `accepted`, `rejected`)
- `createdAt`: Date de création
- `updatedAt`: Date de mise à jour

### API Backend

**Routes** (api/src/routes/friends.routes.ts)
- `GET /api/friends/search?q=query` - Rechercher des utilisateurs
- `POST /api/friends/requests` - Envoyer une demande d'amitié
- `GET /api/friends/requests/pending` - Récupérer les demandes reçues
- `GET /api/friends/requests/sent` - Récupérer les demandes envoyées
- `POST /api/friends/requests/:id/accept` - Accepter une demande
- `POST /api/friends/requests/:id/reject` - Refuser une demande
- `GET /api/friends` - Récupérer la liste des amis
- `DELETE /api/friends/:id` - Supprimer un ami
- `GET /api/friends/status/:userId` - Vérifier le statut d'amitié avec un utilisateur

**Service** (api/src/services/friends.service.ts)
Contient toute la logique métier pour gérer les relations d'amitié.

**Contrôleur** (api/src/controllers/friends.controller.ts)
Gère les requêtes HTTP et les réponses.

### Frontend

**Page principale** (web/app/friends/page.tsx)
Interface complète avec 4 onglets :
1. **Friends** - Liste de tous les amis
2. **Requests** - Demandes d'amitié reçues (avec badge de notification)
3. **Sent** - Demandes d'amitié envoyées
4. **Search** - Recherche d'utilisateurs

**Composant FriendshipButton** (web/features/friends/components/FriendshipButton.tsx)
Bouton contextuel affiché sur les profils utilisateurs :
- "Add Friend" si aucune relation
- "Request Sent" si demande en attente envoyée
- "Accept / Decline" si demande reçue
- "Remove Friend" si déjà ami

**Hook useFriendRequestsCount** (web/features/friends/hooks/useFriendRequests.ts)
Hook React Query pour afficher le nombre de demandes en attente (badge dans le header).

**Service API** (web/lib/api/friends.ts)
Client API pour communiquer avec le backend.

## Fonctionnalités

### 1. Recherche d'utilisateurs
- Recherche par nom ou email (minimum 2 caractères)
- Résultats limités à 20 utilisateurs
- Exclut l'utilisateur actuel des résultats

### 2. Gestion des demandes
- Envoi de demandes d'amitié
- Notifications visuelles (badge) pour les demandes en attente
- Acceptation/refus des demandes reçues
- Vue des demandes envoyées

### 3. Liste d'amis
- Affichage de tous les amis acceptés
- Lien vers le profil de chaque ami
- Possibilité de supprimer un ami

### 4. Intégration au profil
- Bouton d'amitié contextuel sur chaque profil utilisateur
- Affichage du statut de la relation
- Actions disponibles selon le statut

## Sécurité

- Toutes les routes API nécessitent une authentification
- Vérification de l'autorisation pour accepter/refuser/supprimer
- Impossible d'envoyer une demande à soi-même
- Impossible d'avoir plusieurs demandes entre les mêmes utilisateurs

## Interface utilisateur

### Navigation
- Lien "Friends" dans le header principal
- Badge de notification pour les demandes en attente
- Menu dropdown avec accès rapide

### Design
- Interface responsive (mobile, tablette, desktop)
- Utilisation des composants shadcn/ui
- Animations et transitions fluides
- États de chargement visuels

## Migration de base de données

Pour appliquer les changements de schéma :

```bash
cd api
pnpm db:push
```

## Prochaines améliorations possibles

- Notifications en temps réel (WebSocket)
- Suggestions d'amis basées sur les films en commun
- Messagerie privée entre amis
- Partage de listes de films avec des amis
- Activité des amis (derniers films ajoutés)
