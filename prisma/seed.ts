import { UserRole } from "@prisma/client";
import { prisma } from "../src/Shared/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const existSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (existSuperAdmin) {
      console.log("Super admin already exist");
      return;
    }
    const hashedPassword = await bcrypt.hash("superadmin", 12);
    const createSuperAdmin = await prisma.user.create({
      data: {
        email: "super@admin.com",
        role: UserRole.SUPER_ADMIN,
        password: hashedPassword,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01234567890",
          },
        },
      },
    });
    console.log("Super admin created successfully", createSuperAdmin);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
seedSuperAdmin();
