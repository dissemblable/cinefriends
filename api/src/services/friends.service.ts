import { prisma } from "@/utils/db.js";

export const searchUsers = async (query: string, currentUserId: string) => {
  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        { id: { not: currentUserId } }, // Exclure l'utilisateur actuel
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
    },
    take: 20,
  });

  return users;
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  // Vérifier si une relation existe déjà
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingFriendship) {
    throw new Error("Friendship request already exists");
  }

  const friendship = await prisma.friendship.create({
    data: {
      senderId,
      receiverId,
      status: "pending",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return friendship;
};

export const acceptFriendRequest = async (
  friendshipId: string,
  userId: string
) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Friendship request not found");
  }

  // Vérifier que c'est bien le destinataire qui accepte
  if (friendship.receiverId !== userId) {
    throw new Error("Unauthorized to accept this request");
  }

  const updatedFriendship = await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: "accepted" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return updatedFriendship;
};

export const rejectFriendRequest = async (
  friendshipId: string,
  userId: string
) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Friendship request not found");
  }

  // Vérifier que c'est bien le destinataire qui refuse
  if (friendship.receiverId !== userId) {
    throw new Error("Unauthorized to reject this request");
  }

  // Supprimer la demande d'amis au lieu de juste la marquer comme rejetée
  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  return { success: true };
};

export const removeFriend = async (friendshipId: string, userId: string) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new Error("Friendship not found");
  }

  // Vérifier que l'utilisateur fait partie de cette amitié
  if (friendship.senderId !== userId && friendship.receiverId !== userId) {
    throw new Error("Unauthorized to remove this friendship");
  }

  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  return { success: true };
};

export const getFriends = async (userId: string) => {
  const friendships = await prisma.friendship.findMany({
    where: {
      AND: [
        {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        { status: "accepted" },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
    },
  });

  // Retourner la liste des amis (pas l'utilisateur actuel)
  const friends = friendships.map((friendship) => ({
    friendshipId: friendship.id,
    friend:
      friendship.senderId === userId ? friendship.receiver : friendship.sender,
  }));

  return friends;
};

export const getPendingRequests = async (userId: string) => {
  const requests = await prisma.friendship.findMany({
    where: {
      receiverId: userId,
      status: "pending",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

export const getSentRequests = async (userId: string) => {
  const requests = await prisma.friendship.findMany({
    where: {
      senderId: userId,
      status: "pending",
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

export const getFriendshipStatus = async (userId1: string, userId2: string) => {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
  });

  if (!friendship) {
    return { status: "none", friendshipId: null };
  }

  return {
    status: friendship.status,
    friendshipId: friendship.id,
    isSender: friendship.senderId === userId1,
  };
};
