import { prisma } from "@/utils/db.js"

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      bio: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export const createUser = async (data: {
  email: string
  name: string
  password: string
}) => {
  return await prisma.user.create({
    data,
  })
}

export const updateUser = async (
  id: string,
  data: { name?: string; email?: string; bio?: string; image?: string }
) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      bio: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}
